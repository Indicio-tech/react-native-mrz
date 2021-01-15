import { NativeModules } from 'react-native';

const { Mrz } = NativeModules;

export default Mrz;

async function getSampleCall() {
    var bleh = await Mrz.sampleMethod("asdf", 123);
    alert(bleh);
    alert('123');
}

alert('hi')

getSampleCall();