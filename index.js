import detector from './detector';

const RNFS = require('react-native-fs')
//const Image = require('image-js').Image
import Image from './image';

async function asdf() {
	console.log('asdf');
	
	var i = null
	try {
		const im = await RNFS.readFileAssets('IMG_20201223_163822755.jpg', 'base64')
		console.log(im);
		console.log('asdf4')
		i = await Image.load(Buffer.from(im, "base64"));
	} catch (error) {
		console.log('ooooooh snap')
		console.log(error)
	}
	console.log('asdf2');
	console.log(i)
	console.log(detector.detect(i))
	console.log('asdf3');
}



var setCanvas = function(myCanvas) {
	console.log("setCanvas!");	
	console.log(myCanvas);
	asdf();
};

export default detector;
export { setCanvas };
