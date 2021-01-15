import { NativeModules } from 'react-native'

const { libsvm } = NativeModules

import Kernel from 'ml-kernel'
import range from 'lodash' // lodash.range

const predict = (bridge, xtest) => { // TODO: xtest might be a list.
  const kernel = new Kernel('linear', libsvm.DESCRIPTORS.kernelOptions); // TODO: move hard coded type to config
  const xtrain = libsvm.DESCRIPTORS.xtrain
  const ktest = kernel
    .compute(xtest, xtrain)
    .addColumn(0, range(1, xtest.length + 1));
  return  libsvm.CLASSIFIER.predict(ktest);
}

export default {
  predict,
  // do note kernelOptions.type = 'linear';
  // DESCRIPTORS: libsvm.DESCRIPTORS, // assumption, descriptors are loaded in libsvm at creation.
  // CLASSIFIER: libsvm.CLASSIFIER // assumption, model is loaded in libsvm at creation.
  // EXAMPLE_CONSTANT: libsvm.EXAMPLE_CONSTANT
}
