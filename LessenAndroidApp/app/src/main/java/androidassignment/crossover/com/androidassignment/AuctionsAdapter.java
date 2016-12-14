package androidassignment.crossover.com.androidassignment;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.PopupMenu;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by srinivas on 09-12-2016.
 */
public class AuctionsAdapter extends ArrayAdapter<AuctionItem> {

    Context context;
    private List<AuctionItem> ActiveAuctions;
    private static String ITEM_ID = "item_id";
    DatabaseHelper db;

    public AuctionsAdapter(Activity context, List<AuctionItem> activeAuctions) {
        super(context, R.layout.auctions_row, activeAuctions);
        // TODO Auto-generated constructor stub
        ActiveAuctions = new ArrayList<AuctionItem>();
        this.ActiveAuctions = activeAuctions;
        db = new DatabaseHelper(context);
        this.context = context;
    }

    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {
        // TODO Auto-generated method stub
        LayoutInflater inflater = (LayoutInflater) context
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View single_row = inflater.inflate(R.layout.auctions_row, null,
                true);
        TextView AuctionTitle = (TextView) single_row.findViewById(R.id.auction_title);
        TextView AuctionPrice = (TextView) single_row.findViewById(R.id.auction_item_price);
        TextView AuctionCountBids = (TextView) single_row.findViewById(R.id.auction_items_count);
        TextView AuctionTimeDate = (TextView) single_row.findViewById(R.id.auction_items_date_time);
        TextView AuctionLocation = (TextView) single_row.findViewById(R.id.auction_items_location);
        ImageView imageView = (ImageView) single_row.findViewById(R.id.iv_auction_image);
        Button PlaceBid = (Button) single_row.findViewById(R.id.bt_place_bid);

        Log.d("Actin", "getView: "+ActiveAuctions.size()+ActiveAuctions.get(0));
        AuctionTitle.setText(ActiveAuctions.get(position).getTitle());
        AuctionTimeDate.setText(ActiveAuctions.get(position).getEndDate());
        AuctionLocation.setText(ActiveAuctions.get(position).getLocation());
        AuctionPrice.setText(Integer.toString(ActiveAuctions.get(position).getMaxBid()));
        AuctionCountBids.setText(Integer.toString(ActiveAuctions.get(position).getCount()));
        Glide.with(context).load(ActiveAuctions.get(position).getImageUrl())
                .thumbnail(0.5f)
                .crossFade()
                .diskCacheStrategy(DiskCacheStrategy.ALL)
                .into(imageView);
        PlaceBid.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent placeBid = new Intent(context, PlaceBid.class);
                placeBid.putExtra(ITEM_ID, ActiveAuctions.get(position).getOId());
                context.startActivity(placeBid);
            }
        });
        View overflow = single_row.findViewById(R.id.album_overflow);
        if (ActiveAuctions.get(position).getIsEditable()) {overflow.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                PopupMenu popupMenu = new PopupMenu(context,
                        v);
                popupMenu.getMenuInflater().inflate(R.menu.auction_item_menu,

                        popupMenu.getMenu());
                popupMenu
                        .setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {

                            @Override
                            public boolean onMenuItemClick(MenuItem arg0) {
                                // TODO Auto-generated method stub
                                if (arg0.getItemId() == R.id.action_delete) {
                                    //do something
                                    db.DeleteAuctionItem(Integer.toString(ActiveAuctions.get(position).getImageLoc()));
                                    ActiveAuctions.remove(position);
                                    notifyDataSetChanged();
                                } else {
                                    Intent editItem = new Intent(context, EditAuctionItem.class);

                                    editItem.putExtra(ITEM_ID, Integer.toString(ActiveAuctions.get(position).getImageLoc()));
                                    context.startActivity(editItem);

                                }

                                return false;
                            }
                        });
                popupMenu.show();


            }
        });
        } else {
            overflow.setVisibility(View.GONE);
        }


        return single_row;
    }
}
