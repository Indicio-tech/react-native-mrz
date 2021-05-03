#import "Mrz.h"

@implementation Mrz

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(ocrFile:(NSString *)stringArgument resolver:(RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
{
    RCTLogInfo(@"Starting Tesseract Engine");

    G8Tesseract *tesseract = [[G8Tesseract alloc] initWithLanguage:@"ocrb" engineMode:G8OCREngineModeDefault];

    RCTLogInfo(@"Tesseract Engine Started");

    tesseract.delegate = self;

    // Specify the image Tesseract should recognize on
    tesseract.image = [[UIImage imageNamed:stringArgument] g8_blackAndWhite];

    RCTLogInfo(@"Tesseract Process Image");

    // Start the recognition
    [tesseract recognize];

    RCTLogInfo(@"Tesseract Image Processed!");

    NSString *data = [tesseract recognizedText];
    // Retrieve the recognized text
    RCTLogInfo(@"%@", data);

    // TODO: Implement some actually useful functionality
    resolve(data);
}


- (void)progressImageRecognitionForTesseract:(G8Tesseract *)tesseract {
   // NSLog(@"progress: %lu", (unsigned long)tesseract.progress);
}

- (BOOL)shouldCancelImageRecognitionForTesseract:(G8Tesseract *)tesseract {
    return NO;  // return YES, if you need to interrupt tesseract before it finishes
}

@end
