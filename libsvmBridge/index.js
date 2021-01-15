import { NativeModules, NativeEventEmitter } from 'react-native';
import predict from './libsvmNativeModule';

const bridge = NativeModules.RNTestLibModule;
// const eventEmitter = new NativeEventEmitter(bridge);

export default {
  predict: (xtest) => predict(bridge,xtest)
};
