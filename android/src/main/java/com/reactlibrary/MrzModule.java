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
    public void ocrFile(String filePath, Promise promise) {
        Log.d(TAG, "Lifecycle - ocrFile");
      
        final String CACHE_DIR = reactContext.getCacheDir() + "/tessdata/";
        final String CACHE_DIR_OCRB = CACHE_DIR + "ocrb_int.traineddata";

        FileOutputStream output_ocrb = null;
        Log.d(TAG, "Lifecycle - ocrFile - extract ocrb_int.traineddata to cache");
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
                    input_ocrb = reactContext.getAssets().open("tessdata/ocrb_int.traineddata");

                    byte[] buf = new byte[1024];
                    int len;
                    while ((len = input_ocrb.read(buf)) > 0) {
                        output_ocrb.write(buf, 0, len);
                    }
                } catch (IOException e ) {
                    Log.d(TAG, e.getMessage());
                } finally {
                    if (input_ocrb != null)
                        input_ocrb.close();
                }
            } 
        } catch (IOException e ) {
            Log.d(TAG, e.getMessage());
        } finally {
            if (output_ocrb != null)
                try {
                    output_ocrb.close();
                } catch (IOException e) {
                    Log.d(TAG, e.getMessage());
                }

        }
        Log.d(TAG, "Lifecycle - ocrFile - extracted ocrb_int.traineddata to cache");

        Log.d(TAG, "Lifecycle - ocrFile - verifiy ocrb_int.traineddata exists");

        // Verify
        File cache_ocrb = new File(CACHE_DIR_OCRB);

        if (!cache_ocrb.exists())
        {
            Log.d(TAG, "Lifecycle - ocrFile - ERROR ocrb_int.traineddata doesn't exist");

            promise.resolve(null); // return null string if file doesn't exist
            return;
        }

        Log.d(TAG, "Lifecycle - ocrFile - ocrb_int.traineddata exists");

        final String TESSBASE_PATH = CACHE_DIR;
        final String DEFAULT_LANGUAGE = "ocrb_int";

        Log.d(TAG, "Lifecycle - ocrFile - init tesseract");

        final TessBaseAPI baseApi = new TessBaseAPI();

        try {
            Log.d(TAG, "Lifecycle - ocrFile - tessbase_path: " + TESSBASE_PATH);
            boolean success = baseApi.init(TESSBASE_PATH, DEFAULT_LANGUAGE);

            Log.d(TAG, "Lifecycle - ocrFile - init tesseract success? " + success);
            
            if (!success) {
                promise.resolve(null); // return null string if file doesn't exist
                return;
            }
            
            Log.d(TAG, "Lifecycle - ocrFile - process file");

            final String IMAGE_PATH = filePath;

            Log.d(TAG, "Lifecycle - ocrFile - file:" + IMAGE_PATH);

            File image_file = new File(IMAGE_PATH);

            if (!image_file.exists())
            {
                Log.d(TAG, "Lifecycle - ocrFile - ERROR file doesn't exist");
    
                promise.resolve(null); // return null string if file doesn't exist
                return;
            }

            baseApi.setImage(image_file);

            String result = baseApi.getUTF8Text();

            Log.d(TAG, "Lifecycle - ocrFile - result:" + result);

            promise.resolve(result);
        } finally {
            baseApi.end(); // we are done with the baseAPI and must cleanup native resources
        }

        Log.d(TAG, "Lifecycle - ocrFile - Finished");
    }

}
