import { NativeModules } from 'react-native';

const { Mrz } = NativeModules;

const RNFS = require('react-native-fs')

async function asdf() {
	
	var i = null
	try {
		const im = await RNFS.readFileAssets('IMG_20201223_163822755.jpg', 'base64')
		//console.log(im);
		i = await Image.load(Buffer.from(im, "base64"));

//		var d = detector.detect(i)

//		var r = await detector.read(d)

		console.log(r);
	} catch (error) {
		console.log('ooooooh snap')
		console.log(error)
	}

	await Mrz.sampleMethod([]);

}

asdf();

var detector = null;

//var setCanvas = function(myCanvas) {
//	console.log("setCanvas!");	
//	console.log(myCanvas);
//	asdf();
//};

export default detector;
//export { setCanvas };
