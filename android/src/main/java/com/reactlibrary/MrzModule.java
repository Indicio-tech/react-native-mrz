package com.reactlibrary;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class MrzModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public MrzModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Mrz";
    }

    @ReactMethod
    public void sampleMethod(String stringArgument, int numberArgument, Promise promise) {
        // TODO: Implement some actually useful functionality
        //callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
        String result = "Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument;
        promise.resolve(result);
    }

}
