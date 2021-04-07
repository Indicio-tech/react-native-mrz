import { NativeModules } from 'react-native';
import { parse } from './mrzparser.js'

const { Mrz } = NativeModules;

const RNFS = require('react-native-fs')

var getMrz = async function(filename) {
	var ocr = await Mrz.ocrFile(filename);

	console.log(ocr);

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
	console.log("Main Bundle Path: " + RNFS.MainBundlePath);
	console.log("Cache Directory Path: " + RNFS.CachesDirectoryPath);

	console.log(RNFS.readDir(RNFS.MainBundlePath));
//	console.log(RNFS.readDir(RNFS.MainBundlePath + "/sitamobileappholder"));


	var result = await getMrz(RNFS.MainBundlePath + "/obama-viz.jpg");

	console.log(result);

	//console.log("/Users/kim/Library/Developer/CoreSimulator/Devices/A5C7D3F9-9B87-424E-9CE6-CA187746B3B5/data/Containers/Bundle/Application/00991AC1-3B8A-45EE-90DF-44189E4E3DA9/sitamobileappholder.app/tessdata");
	//console.log( RNFS.readDir("/Users/kim/Library/Developer/CoreSimulator/Devices/A5C7D3F9-9B87-424E-9CE6-CA187746B3B5/data/Containers/Bundle/Application/00991AC1-3B8A-45EE-90DF-44189E4E3DA9/sitamobileappholder.app/tessdata") );
}

//testMrz();

export default getMrz;
