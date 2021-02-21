#import "Mrz.h"

@implementation Mrz

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(ocrFile:(NSString *)stringArgument resolver:(RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
{
    RCTLogInfo(@"Here");

    G8Tesseract *tesseract = [[G8Tesseract alloc] initWithLanguage:@"ocrb"];

    RCTLogInfo(@"Here2");

    // Specify the image Tesseract should recognize on
    tesseract.image = [[UIImage imageNamed:@"image_sample.jpg"] g8_blackAndWhite];

    // Start the recognition
    [tesseract recognize];

    // Retrieve the recognized text
    RCTLogInfo(@"%@", [tesseract recognizedText]);

    RCTLogInfo(@"Here3");

    // TODO: Implement some actually useful functionality
    resolve(@[[NSString stringWithFormat: @"stringArgument: %@", stringArgument]]);
}

@end
