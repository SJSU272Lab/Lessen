package androidassignment.crossover.com.androidassignment.retrofit.services;


import android.content.Context;

import org.json.JSONObject;

import java.util.List;

import androidassignment.crossover.com.androidassignment.retrofit.reponses.UserResponse;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface UserServices{
@Headers("Content-Type : application/json")
@GET("users")
    Call<List<UserResponse>> VerifyUser(
        @Query("q" ) String queryString,
        @Query("f" ) String filterString,
        @Query("apiKey" ) String apiKey
    );
}