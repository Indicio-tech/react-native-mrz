import detector from './detector';

export default detector;

const RNFS = require('react-native-fs')
const Image = require('image-js').Image


async function asdf() {
	console.log('asdf');
	
	var i = null
	try {
		const im = await RNFS.readFileAssets('IMG_20201223_163822755.jpg', 'base64')
		console.log(im);
		console.log('asdf4')
		i = await Image.load(Buffer.from(im, "hex"));
	} catch (error) {
		console.log('ooooooh snap')
		console.log(error)
	}
	console.log('asdf2');
	console.log(i)
	detector.detect(i)
	console.log('asdf3');
}

asdf();
