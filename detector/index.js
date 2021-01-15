//import libsvmBridge from '../libsvmBridge';
import getMrz from './getMrz'
import mrzOcr from './ocr';

export default {
    detect: getMrz,
    //read: mrzOcr,
    //...libsvmBridge // TODO: needed?
};