#import "Mrz.h"

@implementation Mrz

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(ocrFile:(NSString *)stringArgument resolver:(RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
{
    RCTLogInfo(@"Here");

    // TODO: Implement some actually useful functionality
    resolve(@[[NSString stringWithFormat: @"stringArgument: %@", stringArgument]]);
}

@end
