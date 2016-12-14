package androidassignment.crossover.com.androidassignment;

import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.StrictMode;
import android.provider.Settings;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;
import android.util.Log;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import androidassignment.crossover.com.androidassignment.retrofit.services.BiddingServices;
import androidassignment.crossover.com.androidassignment.retrofit.services.UserServices;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Created by srinivas on 09-12-2016.
 */

public class BiddingInit extends MultiDexApplication {

    private static BiddingInit mInstance;
    private static Context mContext;
    private static Context mApplicationContext;
    private Retrofit mRetrofit;

    public static String apiKey = "aMhcwsC-xs68LzUSUrhyktg2wGnpHpb-";




    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    /**
     * Returns the Application class instance
     */

    public static synchronized BiddingInit getInstance() {
        if (mInstance == null) {
            mInstance = new BiddingInit();
        }
        return mInstance;
    }


    @Override
    public void onCreate() {
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        super.onCreate();

        initializeVariables();
        buildRetrofitClient();
        //FileManager.createAllDirectories(getApplicationContext());
    }

    private void buildRetrofitClient() {

        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
// set your desired log level
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient.Builder httpClient = new OkHttpClient.Builder();
// add your other interceptors …

// add logging as last interceptor
        httpClient.addInterceptor(logging);  // <-- this is the important line!
        mRetrofit = new Retrofit.Builder()
                .addConverterFactory(GsonConverterFactory.create())
                .client(httpClient.build())
                .baseUrl("https://api.mongolab.com/api/1/databases/lessen/collections/").build();
    }


    public UserServices getUserServices() {
        return mRetrofit.create(UserServices.class);
    }

    public BiddingServices getBiddingServices() {
        return mRetrofit.create(BiddingServices.class);
    }


    private void initializeVariables() {
        mInstance = this;
        mApplicationContext = this.getApplicationContext();

    }

    /**
     * Returns the current activity context
     */

    public Context getCurrentActivityContext() {
        if (mContext == null) {
            return mApplicationContext;
        } else {
            return mContext;
        }
    }



    /**
     * Checks Internet connection's availability
     *
     * @return availability
     */
    public boolean isConnectedToInterNet() {
        ConnectivityManager connectivity = (ConnectivityManager) getCurrentActivityContext()
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivity != null) {
            NetworkInfo[] info = connectivity.getAllNetworkInfo();
            if (info != null)
                for (int i = 0; i < info.length; i++) {
                    if (info[i].getState() == NetworkInfo.State.CONNECTED) {
                        return true;
                    }
                }
        }
        return false;
    }






}