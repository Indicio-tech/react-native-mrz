import { countBy, result } from 'lodash';
import { NativeModules } from 'react-native';
import { parse } from './mrzparser.js'

const { Mrz } = NativeModules;

const RNFS = require('react-native-fs')

var getMrz = async function(filename) {
	var ocr = await Mrz.ocrFile(filename);

	/* 
	Remove all spaces. In some cases a space exists in between letters, and our text that we are
	interested in
	*/

	ocr = ocr.replace(/ /g, '');
	ocr = ocr.match(/.{44}/g)

	if (ocr.length < 2)
		return null; // we didn't find the mrz :-(

	// we are going to assume that we want the last two strings that are 44 characters long
	// since the mrz strings are on the bottom of the passport.
	try {
		var mrz = parse(ocr[ocr.length-2] + ocr[ocr.length-1]);
	} catch ( error ) {
		return null; // we were unable to properly parse the mrz strings
	}
	
	if (! mrz['checkDigit']['valid'])
		return null; // the passport check digits failed, so this is not a valid passport string
	
	return mrz;
}

async function testMrz() {
	
	var result = await getMrz(RNFS.CachesDirectoryPath + "/image.jpg");

	console.log(result);
}

testMrz();

var detector = null;

export default getMrz;
