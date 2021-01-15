import hog from 'hog-features'
import getLinesFromImage from './getLinesFromImage'
import predict from '../libsvmBridge/libsvmNativeModule'

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
  return rois;
}

async function ocr(rois){
  let ocrResult = [];
  const xtest = getDescriptors(rois.map((roi) => roi.image));
  predicted = predict(xtest)

  predicted = predicted.map((p) => String.fromCharCode(p));
  predicted.forEach((p, idx) => {rois[idx].predicted = p;});
  let count = 0;
  for (let line of lines) {
    let lineText = '';
    for (let i = 0; i < line.rois.length; i++) {
      lineText += predicted[count++];
    }
    ocrResult.push(lineText);
  }

  return {
    rois,
    ocrResult,
    mask,
    painted,
    averageSurface
  };
}

async function mrzOcr(image, roiOptions = {}){
  rois = await detect(image, roiOptions);
  results = await ocr(rois);
  return results;
}

module.exports = {detect,ocr,mrzOcr};