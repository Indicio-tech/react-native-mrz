package com.reactlibrary;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class MrzModule extends ReactContextBaseJavaModule {
    private static String TAG = "MrzInterface";

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
    public void sampleMethod(ReadableArray readableArray, Promise promise) {
        Log.d(TAG, "Lifecycle - sampleMethod");

        BufferedReader reader = null;
        try {
            reader = new BufferedReader(
                new InputStreamReader(reactContext.getAssets().open("models/ESC-v2.svm.model")));


            libsvm.svm_model model = libsvm.svm.svm_load_model(reader);

            libsvm.svm_node[] d = new libsvm.svm_node[readableArray.size()] ;
            for (int i = 0; i < readableArray.size(); i++)
            {
                libsvm.svm_node tmp = new libsvm.svm_node();
                Log.d(TAG, "" + i);
                Log.d(TAG, "" + tmp);
                tmp.value = readableArray.getDouble(i);
                d[i] = tmp;
            }
            // TODO fix readableArray data type...
            double result = libsvm.svm.svm_predict(model, d);
            Log.d(TAG, model.toString());
            // do reading, usually loop until end of file reading  
//            String mLine;
//            while ((mLine = reader.readLine()) != null) {
//            //process line
//                promise.resolve(mLine);
//            }
            promise.resolve(result);
            return;
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
        String result = "Received: " + readableArray.toString();
        promise.resolve(null);
    }

}
