package androidassignment.crossover.com.androidassignment.retrofit.services;

import android.provider.ContactsContract;

import org.json.JSONObject;

import java.util.List;

import androidassignment.crossover.com.androidassignment.retrofit.reponses.ActiveProductResponse;
import androidassignment.crossover.com.androidassignment.retrofit.reponses.ProductInsertResponse;
import androidassignment.crossover.com.androidassignment.retrofit.reponses.UserResponse;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Field;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.Query;

/**
 * Created by srinivas on 09-12-2016.
 */

public interface BiddingServices {
    @Headers({
            "Accept : application/son"})
    @POST("product")
    Call<ProductInsertResponse> insertProduct(
            @Body JSONObject queryString,
            @Query("apiKey" ) String apiKey
    );

    @Headers({
            "Accept : application/son"})
    @GET("product")
    Call<List<ActiveProductResponse>> getActiveProducts(
            @Query("q" ) String queryString,
            @Query("f" ) String filterString,
            @Query("apiKey" ) String apiKey

    );

    @Headers({
            "Accept : application/son"})
    @GET("product")
    Call<List<ActiveProductResponse>> getProduct(
            @Query("q" ) String queryString,
            @Query("f" ) String filterString,
            @Query("apiKey" ) String apiKey

    );
}
