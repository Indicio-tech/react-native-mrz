package com.reactlibrary;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import com.googlecode.tesseract.android.TessBaseAPI;

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
      
        final TessBaseAPI baseApi = new TessBaseAPI();

        final String CACHE_DIR = reactContext.getCacheDir() + "/tessdata/";

        final String CACHE_DIR_OCRB = CACHE_DIR + "ocrb.traineddata";

        FileOutputStream output_ocrb = null;
        // make tessdata dir and extract asset to cache dir
        try {
            File cache_ocrb = new File(CACHE_DIR_OCRB);

            if (!cache_ocrb.exists())
            {
                File cache_orcb_dir = new File(CACHE_DIR);

                if (!cache_orcb_dir.exists())
                    cache_orcb_dir.mkdirs();

                output_ocrb = new FileOutputStream(cache_ocrb);

                InputStream input_ocrb = null;
                try {
                    input_ocrb = reactContext.getAssets().open("tessdata/ocrb.traineddata");

                    byte[] buf = new byte[1024];
                    int len;
                    while ((len = input_ocrb.read(buf)) > 0) {
                        output_ocrb.write(buf, 0, len);
                    }
                } catch (IOException e ) {
                    if (input_ocrb != null)
                        input_ocrb.close();
                } finally {

                }


            } 
        }catch (IOException e ) {

        } finally {
            if (output_ocrb != null)
                try {
                    output_ocrb.close();
                } catch (IOException e) {}

        }

        final String TESSBASE_PATH = CACHE_DIR;
        final String DEFAULT_LANGUAGE = "ocrb";

        boolean success = baseApi.init(TESSBASE_PATH, DEFAULT_LANGUAGE);

        Log.d(TAG, TESSBASE_PATH);
        Log.d(TAG, "TessBaseAPI created!");
        Log.d(TAG, "" + success);

        final String IMAGE_PATH = CACHE_DIR + "image.jpg";
        baseApi.setImage(new File(IMAGE_PATH));

        Log.d(TAG, baseApi.getUTF8Text());

        baseApi.end(); // we are done with the baseAPI and must cleanup native resources

/*        BufferedReader reader = null;
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
        }*/

        // TODO: Implement some actually useful functionality
        //callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
        String result = "Received: " + readableArray.toString();
        promise.resolve(null);
    }

}
