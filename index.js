import { result } from 'lodash';
import { NativeModules } from 'react-native';

const { Mrz } = NativeModules;

const RNFS = require('react-native-fs')

var getMrz = async function(filename) {
	var result = await Mrz.ocrFile(filename);

	/* 
	Remove all spaces. In some cases a space exists in between letters, and our text that we are
	interested in
	*/

	result = result.replace(/ /g, '');
	
	return result;
}

async function testMrz() {
	
	var result = await getMrz(RNFS.CachesDirectoryPath + "/image.jpg");

	console.log(result);
}

testMrz();

var detector = null;

export default getMrz;
