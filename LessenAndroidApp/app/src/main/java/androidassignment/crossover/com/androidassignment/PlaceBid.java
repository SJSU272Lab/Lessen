package androidassignment.crossover.com.androidassignment;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;

/**
 * Created by srinivas on 09-12-2016.
 */
public class PlaceBid extends Activity {
    private static String ITEM_ID = "item_id";
    EditText Title, Category, Description, AmountBid, Location, EndDate;
    Button placeBid;
    ImageView ModifyPhoto;
    DatabaseHelper db;
    String key = "0";
    AuctionItem auctionItem;
    SharedPreferences prefs;
    public static final String MyPREFERENCES = "MyPrefs";
    Context context = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        context = this;
        prefs = getSharedPreferences(MyPREFERENCES, Context.MODE_PRIVATE);
        setContentView(R.layout.auction_bid);
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            key = extras.getString(ITEM_ID);
        }
        getActionBar().setDisplayHomeAsUpEnabled(true);
        db = new DatabaseHelper(getApplicationContext());
        Title = (EditText) findViewById(R.id.et_title);
        Category = (EditText) findViewById(R.id.et_category);
        Description = (EditText) findViewById(R.id.et_descp);
        AmountBid = (EditText) findViewById(R.id.et_place_bid);
        Location = (EditText) findViewById(R.id.et_location);
        EndDate = (EditText) findViewById(R.id.et_date_time);
        placeBid = (Button) findViewById(R.id.btn_place_bid);
        placeBid.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent main = new Intent(getApplicationContext(), MainActivity.class);
                startActivity(main);
                finish();
//                int MaxPrice = db.getMaxBidPrice(Integer.toString(auctionItem.getImageLoc()));
//                if (MaxPrice == 0) {
//                    MaxPrice = Integer.parseInt(auctionItem.getMinBid());
//                }
//                if ((!AmountBid.getText().toString().trim().isEmpty()) &&
//                        Integer.parseInt(AmountBid.getText().toString().trim()) > MaxPrice) {
//                    db.InsertBid(db.GetUserId(prefs.getString("user_name", "0")),
//                            auctionItem.getImageLoc(), AmountBid.getText().toString().trim());
//                    Toast.makeText(getApplicationContext(), "Successfully entered", Toast.LENGTH_LONG).show();
//                    finish();
//                } else
//                    Toast.makeText(getApplicationContext(), "Enter more than $" + MaxPrice, Toast.LENGTH_LONG).show();
            }
        });
        ModifyPhoto = (ImageView) findViewById(R.id.iv_add_photo);
        auctionItem = new AuctionItem();
        new GetAuctionItem().execute();
    }

    class GetAuctionItem extends AsyncTask<Void, Integer, String> {


        protected void onPreExecute() {
        }

        protected String doInBackground(Void... arg0) {
            auctionItem = db.GetAuctionItem(key);

            return "";
        }


        protected void onPostExecute(String result) {
            Title.setText(auctionItem.getTitle());
            Category.setText(auctionItem.getCategory());
            Description.setText(auctionItem.getDescription());
            int price = auctionItem.getMaxBid();
            if (price == 0)
                AmountBid.setHint("Min bidding price: $" + auctionItem.getMinBid());
            else
                AmountBid.setHint("Min bidding price: $" + price);
            Location.setText(auctionItem.getLocation());
            EndDate.setText("2016-12-12 12:00 AM");
            ModifyPhoto.setImageBitmap(ImageManup.loadImageFromStorage(Integer.toString(
                    auctionItem.getImageLoc()), getApplicationContext()));

            Glide.with(context).load(auctionItem.getImageUrl())
                    .thumbnail(0.5f)
                    .crossFade()
                    .diskCacheStrategy(DiskCacheStrategy.ALL)
                    .into(ModifyPhoto);

        }
    }
}
