package androidassignment.crossover.com.androidassignment;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.StrictMode;
import android.util.Log;
import android.widget.Toast;


import com.google.gson.Gson;

import org.json.JSONObject;
import org.json.JSONStringer;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.Set;

import androidassignment.crossover.com.androidassignment.retrofit.reponses.ActiveProductResponse;
import androidassignment.crossover.com.androidassignment.retrofit.reponses.ProductInsertResponse;
import androidassignment.crossover.com.androidassignment.retrofit.reponses.UserResponse;
import androidassignment.crossover.com.androidassignment.retrofit.services.BiddingServices;
import androidassignment.crossover.com.androidassignment.retrofit.services.UserServices;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

/**
 * Created by srinivas on 09-12-2016.
 */


import static androidassignment.crossover.com.androidassignment.R.drawable.user;

public class DatabaseHelper extends SQLiteOpenHelper {

    // Logcat tag
    private static final String LOG = "DatabaseHelper";

    // Database Version
    private static final int DATABASE_VERSION = 1;

    // Database Name
    private static final String DATABASE_NAME = "db_auction";


    // Table Names
    private static final String TABLE_USER = "tb_users";
    private static final String TABLE_AUCTION_ITEM = "tb_auction_items";
    private static final String TABLE_BID = "tb_bid";

    //  column names
    private static final String TABLE_USER_KEY_ID = "id";
    private static final String USER_NAME = "user_name";
    private static final String HASHED_PASSWORD = "hashed_password";
    private static final String EMAIL = "email";

    //  Table - column nmaes
    private static final String TABLE_AUCTION_ITEM_KEY_ID = "id";
    private static final String TITLE = "title";
    private static final String CATEGORY = "category";
    private static final String DESCRIPTION = "description";
    private static final String MIN_BID = "min_bid";
    private static final String END_DATE = "end_date";
    private static final String LOCATION = "location";
    private static final String USER_ID = "user_id";

    private static final String TABLE_BID_KEY_ID = "id";
    private static final String TABLE_BID_USER_ID = "user_id";
    private static final String TABLE_BID_AUCTION_ITEM_ID = "auction_item_id";
    private static final String TABLE_BID_AMOUNT = "amount";

    private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private static DatabaseHelper mInstance;
    private static Context mContext;
    private static Context mApplicationContext;
    private Retrofit mRetrofit;


    // Table Create Statements
    //  table create statement
    private static final String CREATE_TABLE_USER = "CREATE TABLE "
            + TABLE_USER + "(" + TABLE_USER_KEY_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," + USER_NAME
            + " VARCHAR(45) UNIQUE," + HASHED_PASSWORD + " VARCHAR(256)," + EMAIL
            + " VARCHAR(50)" + ")";

    // Tag table create statement
    private static final String CREATE_TABLE_AUCTION_ITEM = "CREATE TABLE " + TABLE_AUCTION_ITEM
            + "(" + TABLE_AUCTION_ITEM_KEY_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," + TITLE
            + " VARCHAR(80)," + CATEGORY + " VARCHAR(45)," + MIN_BID + " VARCHAR(45),"
            + END_DATE + " DATETIME," + LOCATION + " VARCHAR(45),"
            + USER_ID + " INTEGER," + DESCRIPTION
            + " TEXT" + ")";

    private static final String CREATE_TABLE_BID = "CREATE TABLE " + TABLE_BID
            + "(" + TABLE_BID_KEY_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," + TABLE_BID_USER_ID
            + " INTEGER," + TABLE_BID_AUCTION_ITEM_ID + " INTEGER," + TABLE_BID_AMOUNT + " Integer"
            + ")";


    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        // creating required tables
        db.execSQL(CREATE_TABLE_USER);
        db.execSQL(CREATE_TABLE_AUCTION_ITEM);
        db.execSQL(CREATE_TABLE_BID);

    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // on upgrade drop older tables
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_USER);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_AUCTION_ITEM);
        db.execSQL("DROP TABLE IF EXISTS " + CREATE_TABLE_BID);
        // create new tables
        onCreate(db);
    }

    public Boolean InsertUser(UserProfile user) {


        SQLiteDatabase database = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(USER_NAME, user.getName());
        values.put(HASHED_PASSWORD, user.getHashedPassword());
        values.put(EMAIL, user.getEmail());
        long temp = database.insert(TABLE_USER, null, values);
        database.close();
        if (temp == -1)
            return false;
        else
            return true;

    }

    public int ImageIndex() {
        SQLiteDatabase db = this.getReadableDatabase();

        String selectQuery = "SELECT  MAX(" + TABLE_AUCTION_ITEM_KEY_ID + ") AS " + TABLE_AUCTION_ITEM_KEY_ID + "  FROM " + TABLE_USER + "';";

        Cursor c = null;
        int index = 0;
        try {
            c = db.rawQuery(selectQuery, null);
            c.moveToFirst();
            index = c.getInt(c.getColumnIndex(TABLE_AUCTION_ITEM_KEY_ID));
        } catch (Exception e) {
        }

        db.close();
        return (index + 1);
    }

    public int InsertAuctionItem(AuctionItem item) {


//        SQLiteDatabase database = this.getWritableDatabase();
//        ContentValues values = new ContentValues();
//        values.put(TITLE, item.getTitle());
//        values.put(CATEGORY, item.getCategory());
//        values.put(DESCRIPTION, item.getDescription());
//        values.put(MIN_BID, item.getMinBid());
//        values.put(END_DATE, item.getEndDate());
//        values.put(LOCATION, item.getLocation());
//        values.put(USER_ID, item.getUserId());
//
//
//        long temp = database.insert(TABLE_AUCTION_ITEM, null, values);
//        database.close();
//        return (int) temp;
        if (BiddingInit.getInstance().isConnectedToInterNet()) {
            BiddingServices bidServices = BiddingInit.getInstance().getBiddingServices();
            JSONObject dataObject = new JSONObject();
            try {
                dataObject.put("product_name", item.getTitle());
                dataObject.put("product_price", item.getMinBid());
                dataObject.put("product_condition", item.getDescription());
                dataObject.put("address",item.getLocation());
                dataObject.put("product_image_url",item.getImageUrl());
                dataObject.put("is_admin_approved",false);
                dataObject.put("is_pickup_pending",true);
                dataObject.put("product_category_id",10);
                dataObject.put("product_stock","1");
                dataObject.put("product_bid_start_price",0);
                dataObject.put("product_bid_end_time",0);
                dataObject.put("product_bid_start_time",0);
                dataObject.put("product_bid_end",0);
                dataObject.put("product_max_bid_price",0);
                dataObject.put("product_desc","asfdf");
                dataObject.put("status",true);
            }catch(Exception ex){
                Log.d("Data preparation Json", "InsertAuctionItem: "+ex.getMessage());
            }
            Call<ProductInsertResponse> call = bidServices.insertProduct(dataObject,BiddingInit.apiKey);
            Log.d("Calling", "Get profile: " + call);
            try {
                StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
                StrictMode.setThreadPolicy(policy);
                ProductInsertResponse body = call.execute().body();
                Log.d("Response synchronouw", "Insert user: "+body.getProductId().get$oid());
                if(body.getProductId().get$oid() != null) return 1;
            } catch (IOException ex){
                Log.d("exception", "Insert: "+ex.getMessage());
            }
        }
        return -1;
    }







    public boolean VerifyUser(UserProfile user) {

        if (BiddingInit.getInstance().isConnectedToInterNet()) {
            UserServices userServices = BiddingInit.getInstance().getUserServices();

            String query = "{\"user_email\":\""+user.getEmail()+"\",\"user_password\":\""+user.getHashedPassword()+"\"}";
            String filter = "{\"user_email\":1}";

            Call<List<UserResponse>> call = userServices.VerifyUser(query, filter, BiddingInit.apiKey);
            Log.d("Calling", "Get profile: " + call);
            try {
                StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
                StrictMode.setThreadPolicy(policy);
                List<UserResponse> body = call.execute().body();
                Log.d("Response synchronouw", "VerifyUser: "+body);
                if(body.size() > 0) return true;
            }
            catch (IOException ex){
                Log.d("exception", "VerifyUser: "+ex.getMessage());
            }


        }
        return false;
    };

    private void parseUserResponse(Response<List<UserResponse>> response) {
        Log.d("Res", "parseUserResponse: "+response.body());
        for(UserResponse l : response.body()){
            Log.d("REs1", "parseUserResponse: "+l.getUserEmail());
            Log.d("REs1", "parseUserResponse: "+l.getId().get$oid());
        }

    }


    public int GetUserId(String UserName) {
        SQLiteDatabase db = this.getReadableDatabase();

        String selectQuery = "SELECT  * FROM " + TABLE_USER + " WHERE "
                + USER_NAME + " = '" + UserName + "';";

        Cursor c = null;
        int index = 0;
        try {
            c = db.rawQuery(selectQuery, null);
            c.moveToFirst();
            index = c.getInt(c.getColumnIndex(TABLE_USER_KEY_ID));
        } catch (Exception e) {
        }
        if (c != null)

            db.close();
        return index;
    }

    public int ChangeUserPassword(String userName, String NewPassword) {

        SQLiteDatabase db = this.getReadableDatabase();


        ContentValues values = new ContentValues();
        values.put(HASHED_PASSWORD, NewPassword);

        // updating row
        return db.update(TABLE_USER, values, USER_NAME + " = ?",
                new String[]{String.valueOf(userName)});
    }

    public List<AuctionItem> getActiveAuctions(int UserId) {
        List<AuctionItem> list =  new ArrayList<AuctionItem>();
        //
        if (BiddingInit.getInstance().isConnectedToInterNet()) {
            BiddingServices bidServices = BiddingInit.getInstance().getBiddingServices();

            String query = "{\"nameValuePairs.is_admin_approved\": true}";
            String filter = "{\"nameValuePairs.product_name\":1, \"nameValuePairs.product_image_url\":1, \"nameValuePairs.product_price\":1, \"nameValuePairs.product_address\":1, \"nameValuePairs.product_bid_end_time\":1}";

            Call<List<ActiveProductResponse>> call = bidServices.getActiveProducts(query, filter, BiddingInit.apiKey);
            Log.d("Calling", "Get profile: " + call);
            try {
                StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
                StrictMode.setThreadPolicy(policy);
                List<ActiveProductResponse> body = call.execute().body();
                Log.d("Response synchronouw", "Active Products: "+body);
                if(body.size() > 0) {
                   for(ActiveProductResponse l:body){
                       Log.d("Respons", "getActiveAuctions: "+l);
                       AuctionItem ac= new AuctionItem();
                       Log.d("Values", "getActiveAuctions: "+l.getNameValuePairs());
                       ac.setImageUrl(l.getNameValuePairs().getProductImageUrl());
                       ac.setTitle(l.getNameValuePairs().getProductName());
                       ac.setOId(l.getId().get$oid());
                       if(l.getNameValuePairs().getProductPrice() != null)
                       ac.setMaxBid(Integer.parseInt(l.getNameValuePairs().getProductPrice()));
                       ac.setEndDate("12-13-2016");
                       ac.setLocation("San Jose");
                       list.add(ac);
                       Log.d("reponse vale", "getActiveAuctions: "+l.getNameValuePairs().getProductName());
                       Log.d("Object values", "getActiveAuctions: "+ac.getTitle());
                       Log.d("Object values", "getActiveAuctions: "+ac.getImageUrl());

                   }
                }
            }
            catch (IOException ex){
                Log.d("exception", "Active Products:"+ex.getMessage());
            }


        }
        return list;

    }

    public List<AuctionItem> getLostAuctions(int UserId){
        return new ArrayList<AuctionItem>();
    }
    public List<AuctionItem> getWonAuctions(int UserId){
        return new ArrayList<AuctionItem>();
    }



    public AuctionItem GetAuctionItem(String key) {
        AuctionItem item = new AuctionItem();

        if (BiddingInit.getInstance().isConnectedToInterNet()) {
            BiddingServices bidServices = BiddingInit.getInstance().getBiddingServices();

            String query = "{\"_id\":{ \"$oid\":\""+key+"\"}}";
            String filter = "{\"nameValuePairs.product_name\":1, \"nameValuePairs.product_image_url\":1, \"nameValuePairs.product_price\":1, \"nameValuePairs.product_address\":1}";

            Call<List<ActiveProductResponse>> call = bidServices.getProduct(query, filter, BiddingInit.apiKey);
            Log.d("Calling", "Get Product: " + call);
            try {
                StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
                StrictMode.setThreadPolicy(policy);
                List<ActiveProductResponse> body = call.execute().body();
                Log.d("Response synchronouw", "Active Products: "+body);
                if(body.size() > 0) {
                    for (ActiveProductResponse l : body) {
                        item.setTitle(l.getNameValuePairs().getProductName());
                        item.setImageUrl(l.getNameValuePairs().getProductImageUrl());
                        item.setMaxBid(Integer.parseInt(l.getNameValuePairs().getProductPrice()));
                        item.setOId(l.getId().get$oid());
                        item.setEndDate("12-14-2016 12:00 AM");
                    }
                }
            }
            catch (IOException ex){
                Log.d("exception", "Product :"+ex.getMessage());
            }
        }
        return item;
    }

    public int getMaxBidPrice(String key) {
        int price = 0;


        SQLiteDatabase db = this.getReadableDatabase();


        String query = "SELECT  max(amount) as MaxBid FROM " +
                TABLE_BID + " WHERE " + TABLE_BID_AUCTION_ITEM_ID + " = "
                + key + ";";
        Cursor c = db.rawQuery(query, null);

        try {
            if (c.moveToFirst()) {
                if (c.getInt(0) != 0) {
                    price = c.getInt(0);
                }
            }
        } catch (Exception e) {
        }
        return price;
    }

    public int UpdateAuctionItem(String key, AuctionItem item) {
        SQLiteDatabase db = this.getReadableDatabase();


        ContentValues values = new ContentValues();
        values.put(TITLE, item.getTitle());
        values.put(CATEGORY, item.getCategory());
        values.put(DESCRIPTION, item.getDescription());
        values.put(MIN_BID, item.getMinBid());
        values.put(END_DATE, item.getEndDate());
        values.put(LOCATION, item.getLocation());

        // updating row
        return db.update(TABLE_AUCTION_ITEM, values, TABLE_AUCTION_ITEM_KEY_ID + " = ?",
                new String[]{String.valueOf(key)});
    }

    public void DeleteAuctionItem(String key) {
        SQLiteDatabase db = this.getReadableDatabase();

        db.delete(TABLE_AUCTION_ITEM, TABLE_AUCTION_ITEM_KEY_ID + " = ?",
                new String[]{String.valueOf(key)});
        db.close();

    }

    public Boolean InsertBid(int userId, int ItemId, String Price) {

        SQLiteDatabase database = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(TABLE_BID_USER_ID, userId);
        values.put(TABLE_BID_AUCTION_ITEM_ID, ItemId);
        values.put(TABLE_BID_AMOUNT, Price);

        long temp = database.insert(TABLE_BID, null, values);
        database.close();
        if (temp == -1)
            return false;
        else
            return true;
    }

    private boolean CompareDates(String Date1String, String Date2String) {

        Date one = null;
        Date two = null;
        try {
            one = sdf.parse(Date1String);
            two = sdf.parse(Date2String);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        if (one.compareTo(two) > 0) {
            return true;
        } else {
            return false;
        }
    }

    public int getMaxBidUserId(int key) {
        int UserId = -1;


        SQLiteDatabase db = this.getReadableDatabase();


        String query = "SELECT  max(amount)," + TABLE_BID_USER_ID + "  FROM " +
                TABLE_BID + " WHERE " + TABLE_BID_AUCTION_ITEM_ID + " = "
                + key + ";";
        Cursor c = db.rawQuery(query, null);

        try {
            if (c.moveToFirst()) {
                if (c.getInt(0) != 0) {
                    UserId = c.getInt(1);
                }
            }
        } catch (Exception e) {
        }
        return UserId;
    }

    public List<AuctionHistoryPojo> GetHistoryBids(String id) {
        List<AuctionHistoryPojo> history = new ArrayList<AuctionHistoryPojo>();
        String selectQuery = "SELECT  * FROM " + TABLE_BID + "" +
                " WHERE " + TABLE_BID_AUCTION_ITEM_ID +
                " = " +
                id +
                ";";


        SQLiteDatabase db = this.getReadableDatabase();
        Cursor c = db.rawQuery(selectQuery, null);
        Cursor temp = null;
        String tempString = "";

        // looping through all rows and adding to list
        if (c.moveToFirst()) {
            do {
                AuctionHistoryPojo item = new AuctionHistoryPojo();
                tempString = "SELECT  " +
                        USER_NAME +
                        " FROM " +
                        TABLE_USER + " WHERE " + TABLE_USER_KEY_ID + " = "
                        + (c.getString(c.getColumnIndex(TABLE_BID_USER_ID))) + ";";

                temp = db.rawQuery(tempString, null);
                if (temp.moveToFirst()) {
                    item.setUserName(temp.getString(0));
                } else {
                    item.setUserName("Not Mentioned");
                }
                item.setBidAmount((c.getString(c.getColumnIndex(TABLE_BID_AMOUNT))));

                history.add(item);


            } while (c.moveToNext());
        }

        return history;
    }

    public Boolean ForgotPassword(String UserName, String email) {
        SQLiteDatabase db = this.getReadableDatabase();

        String selectQuery = "SELECT  * FROM " + TABLE_USER + " WHERE "
                + USER_NAME + " = '" + UserName + "'" +
                " AND " +
                EMAIL +
                " = '" +
                email +
                "'" +
                ";";

        Cursor c = null;

        try {
            c = db.rawQuery(selectQuery, null);


        } catch (Exception e) {
        }

        if (c.moveToFirst())
            return true;
        else
            return false;
    }

    public String RandomBid() {
        List<AuctionItem> Items = new ArrayList<AuctionItem>();
        String selectQuery = "SELECT  * FROM " + TABLE_AUCTION_ITEM + ";";


        SQLiteDatabase db = this.getReadableDatabase();
        Cursor c = db.rawQuery(selectQuery, null);
        Cursor temp = null;
        String tempString = "";


        // looping through all rows and adding to list

        String currentDateandTime = sdf.format(new Date());
        if (c.moveToFirst()) {
            do {
                if (CompareDates(c.getString(c.getColumnIndex(END_DATE)), currentDateandTime)) {
                    AuctionItem item = new AuctionItem();
                    item.setImageLoc(c.getInt(c.getColumnIndex(TABLE_AUCTION_ITEM_KEY_ID)));

                    item.setTitle((c.getString(c.getColumnIndex(TITLE))));
                    item.setCategory((c.getString(c.getColumnIndex(CATEGORY))));
                    item.setDescription((c.getString(c.getColumnIndex(DESCRIPTION))));
                    item.setMinBid((c.getString(c.getColumnIndex(MIN_BID))));
                    item.setEndDate((c.getString(c.getColumnIndex(END_DATE))));
                    item.setLocation((c.getString(c.getColumnIndex(LOCATION))));
                    item.setUserId((c.getInt(c.getColumnIndex(USER_ID))));

                    tempString = "SELECT  count(*) as CountBid,max(amount) as MaxBid FROM " +
                            TABLE_BID + " WHERE " + TABLE_BID_AUCTION_ITEM_ID + " = "
                            + c.getInt(c.getColumnIndex(TABLE_AUCTION_ITEM_KEY_ID)) + ";";

                    temp = db.rawQuery(tempString, null);
                    // adding to  list

                    if (temp.moveToFirst()) {

                        if (temp.getInt(0) != 0) {
                            item.setCount(temp.getInt(0));
                            item.setMaxBid(temp.getInt(1));

                        } else {
                            item.setMaxBid(0);
                            item.setCount(0);
                        }
                    } else {
                        item.setMaxBid(0);
                        item.setCount(0);
                    }
                    Items.add(item);
                }
            } while (c.moveToNext());
        }
        if (Items.size() > 0) {
            int Rnumber = randInt(0, Items.size() - 1);
            AuctionItem item = Items.get(Rnumber);
            int BidMinPrice = item.getMaxBid();
            if (BidMinPrice == 0)
                BidMinPrice = Integer.parseInt(item.getMinBid().trim());
            int BidAmount = randInt(BidMinPrice, BidMinPrice + 5000);
            InsertBid(1, Items.get(Rnumber).getImageLoc(), Integer.toString(BidAmount));
            return item.getTitle();
        }


        return "";
    }

    public static int randInt(int min, int max) {

        // NOTE: Usually this should be a field rather than a method
        // variable so that it is not re-seeded every call.
        Random rand = new Random();

        // nextInt is normally exclusive of the top value,
        // so add 1 to make it inclusive
        int randomNum = rand.nextInt((max - min) + 1) + min;

        return randomNum;
    }


}