package com.reactlibrary;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

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

        BufferedReader reader = null;
        try {
            reader = new BufferedReader(
                new InputStreamReader(reactContext.getAssets().open("models/ESC-v2.svm.model")));

            // do reading, usually loop until end of file reading  
            String mLine;
            while ((mLine = reader.readLine()) != null) {
            //process line
                promise.resolve(mLine);
            }
        } catch (IOException e) {
            //log the exception
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    //log the exception
                }
            }
        }

        // TODO: Implement some actually useful functionality
        //callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
        String result = "Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument;
        promise.resolve(result);
    }

}
