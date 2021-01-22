import hog from 'hog-features'
import getLinesFromImage from './getLinesFromImage'
//import predict from '../libsvmBridge/libsvmNativeModule'

const RNFS = require('react-native-fs')
const BSON = require('bson')
const Kernel = require('ml-kernel');
const range = require('lodash.range');

const SVMPromise = Promise.resolve(require('libsvm-js/asm'));
// This line only works in debug mode :'(
//const SVMPromise = Promise.resolve(require('libsvm-js/dist/browser/asm/libsvm'));

let SVM;

function getKernel(options) {
  options = Object.assign({ type: 'linear' }, options);
  return new Kernel(options.type, options);
}

async function loadSVM() {
  SVM = await SVMPromise;
}

async function predict(Xtest) {

  await loadSVM();
  // browser/asm/libsvm.js
	// It isn't advertized that we can do this, but we are going to because
	// we want the browser version, not the nodejs version, and react native
	// breaks the detection between the two.
  const model = await RNFS.readFileAssets('models/ESC-v2.svm.model', 'utf8')
  const descriptors = await RNFS.readFileAssets('models/ESC-v2.svm.descriptors', 'base64')
  var buff =  Buffer.from(descriptors, "base64")
  const bson = new BSON();
  const { descriptors: Xtrain, kernelOptions } = bson.deserialize(buff);

  // looks like our classifier might not be loading right?
	const classifier = SVM.load(model);

  // const prediction = predict(classifier, Xtrain, Xtest, kernelOptions);
  // return prediction;

  const kernel = getKernel(kernelOptions);
  const Ktest = kernel
    .compute(Xtest, Xtrain)
    .addColumn(0, range(1, Xtest.length + 1));

  console.log("Ktest");
  console.log(Ktest);

  return classifier.predict(Ktest.data);
}

function extractHOG(image) {
  image = image.scale({ width: 20, height: 20 });
  image = image.pad({
    size: 2
  });
  let optionsHog = {
    cellSize: 5,
    blockSize: 2,
    blockStride: 1,
    bins: 4,
    norm: 'L2'
  };
  let hogFeatures = hog.extractHOG(image, optionsHog);
  return hogFeatures;
}

// Get descriptors for images from 1 identity card
function getDescriptors(images) {
  const result = [];
  for (let image of images) {
    result.push(extractHOG(image));
  }

  const heights = images.map((img) => img.height);
  const maxHeight = Math.max.apply(null, heights);
  const minHeight = Math.min.apply(null, heights);
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    let bonusFeature = 1;
    if (minHeight !== maxHeight) {
      bonusFeature = (img.height - minHeight) / (maxHeight - minHeight);
    }
    result[i].push(bonusFeature);
  }
  return result;
}

async function detect(image, roiOptions = {
  positive: true,
  negative: false,
  minSurface: 5,
  minRatio: 0.3,
  maxRatio: 3.0,
  algorithm: 'otsu',
  randomColors: true,
  method: 'svm' // roiOptions = Object.assign({}, { method: 'svm' }, roiOptions);
}) {
  let rois;
  let { lines, mask, painted, averageSurface } = getLinesFromImage(
    image,
    roiOptions
  );

  // A line should have at least 5 ROIS (swiss driving license)
  lines = lines.filter((line) => line.rois.length > 5);

  // we keep maximum the last 3 lines
  if (lines.length > 3) {
    lines = lines.slice(lines.length - 3, lines.length);
  }

  rois = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.rois.length; j++) {
      const roi = line.rois[j];
      rois.push({
        image: image.crop({
          x: roi.minX,
          y: roi.minY,
          width: roi.width,
          height: roi.height
        }),
        width: roi.width,
        height: roi.height,
        line: i,
        column: j
      });
    }
  }
  return {rois, lines};
}

async function ocr(rois, lines){
  let ocrResult = [];
  const xtest = getDescriptors(rois.map((roi) => roi.image));
  predicted = await predict(xtest)

  console.log("predicted");
  console.log(predicted);
  predicted = predicted.map((p) => String.fromCharCode(p));
  predicted.forEach((p, idx) => {rois[idx].predicted = p;});
  let count = 0;
  for (let line of lines) {
    let lineText = '';
    for (let i = 0; i < line.rois.length; i++) {
      //console.log("predicted[" + i + "]: " + line.rois[count])
      lineText += predicted[count++];
    }
    ocrResult.push(lineText);
  }

  console.log(ocrResult)

  return {
    rois,
    ocrResult//,
//    mask,
//    painted,
//    averageSurface
  };
}

var mrzOcr = async function mrzOcr(image){
  var {rois, lines} = await detect(image);
  console.log("rois");
  console.log(rois);
  results = await ocr(rois, lines);
  return results;
}

module.exports = mrzOcr;