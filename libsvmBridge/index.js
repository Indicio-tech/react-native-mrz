import { NativeModules } from 'react-native';

const { Mrz } = NativeModules;

async function predictOne(data) {
  //bridge to javacode.
  return await Mrz.sampleMethod(data);
}

async function svmPredict(data) { // TODO: xtest might be a list.
  let arr = [];
  for (let i = 0; i < data.length; i++) {
    arr.push(await predictOne(data[i]));
  }
  return arr;
}

export default {
  svmPredict: svmPredict
};
