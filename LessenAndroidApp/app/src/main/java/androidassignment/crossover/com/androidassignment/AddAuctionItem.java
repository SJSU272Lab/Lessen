package androidassignment.crossover.com.androidassignment;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TimePicker;
import android.widget.Toast;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;

import java.io.ByteArrayOutputStream;
import java.util.Calendar;
import java.util.concurrent.ExecutionException;

/**
 * Created by srinivas on 09-12-2016.
 */


public class AddAuctionItem extends Activity {
    EditText Title, Category, Description, MinBid, Location, EndDate;
    Button AddItem;
    private static final int CAMERA_REQUEST = 1888;
    ImageView AddPhoto;
    DatabaseHelper db;
    Bitmap ImageResult = null;
    private StorageReference mStorageRef;

    SharedPreferences prefs;
    public static final String MyPREFERENCES = "MyPrefs";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.add_auction);
        Initializatoin();
        mStorageRef = FirebaseStorage.getInstance().getReference();

    }


    private void Initializatoin() {
        prefs = getSharedPreferences(MyPREFERENCES, Context.MODE_PRIVATE);
        db = new DatabaseHelper(getApplicationContext());
        Title = (EditText) findViewById(R.id.et_title);
        Category = (EditText) findViewById(R.id.et_category);
        Description = (EditText) findViewById(R.id.et_descp);
        MinBid = (EditText) findViewById(R.id.et_min_bid);
        Location = (EditText) findViewById(R.id.et_location);
        EndDate = (EditText) findViewById(R.id.et_date_time);
        AddItem = (Button) findViewById(R.id.btn_add_item);
        AddPhoto = (ImageView) findViewById(R.id.iv_add_photo);
        getActionBar().setDisplayHomeAsUpEnabled(true);
        TimePicker timepicker = (TimePicker) View.inflate(AddAuctionItem.this, R.layout.date_time_picker, null).findViewById(R.id.time_picker);
        timepicker.setIs24HourView(true);
        timepicker.setCurrentHour(Calendar.getInstance().get(Calendar.HOUR_OF_DAY));
        EndDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ShowDateTimePicker();
            }
        });

        EndDate.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (hasFocus) {
                    ShowDateTimePicker();
                }
            }
        });



        AddItem.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final AuctionItem item = new AuctionItem();
                item.setTitle(Title.getText().toString().trim());
                item.setCategory(Category.getText().toString().trim());
                item.setDescription(Description.getText().toString().trim());
                item.setMinBid(MinBid.getText().toString().trim());
                item.setLocation(Location.getText().toString().trim());
                item.setEndDate(EndDate.getText().toString().trim());
                item.setUserId(db.GetUserId(prefs.getString("user_name", "")));
                if (Title.getText().toString().trim().length() > 5) {
                    if (Category.getText().toString().trim().length() > 2) {
                        if (Description.getText().toString().trim().length() > 5) {
                            if (MinBid.getText().toString().trim().length() > 0) {
                                if (Location.getText().toString().trim().length() > 1) {
                                    if (EndDate.getText().toString().trim().length() > 5) {
                                        if (ImageResult != null) {
                                            // Image uploda to firbase
                                                StorageReference storageRef = FirebaseStorage.getInstance().getReferenceFromUrl("gs://androidbidding-master.appspot.com/");
                                                Long tsLong = System.currentTimeMillis()/1000;
                                                String ts = tsLong.toString();
                                                StorageReference mountainsRef = storageRef.child(item.getTitle()+item.getDescription()+ts);
                                                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                                                ImageResult.compress(Bitmap.CompressFormat.JPEG, 100, baos);
                                                byte[] dataArray = baos.toByteArray();


                                                UploadTask uploadTask = mountainsRef.putBytes(dataArray);
                                                uploadTask.addOnFailureListener(new OnFailureListener() {
                                                    @Override
                                                    public void onFailure(@NonNull Exception exception) {
                                                        // Handle unsuccessful uploads
                                                        ShowToast("firebase Error");
                                                    }
                                                }).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
                                                    @Override
                                                    public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                                                        // taskSnapshot.getMetadata() contains file metadata such as size, content-type, and download URL.
                                                        Uri downloadUrl = taskSnapshot.getDownloadUrl();
                                                        Log.d("Image", "onSuccess: "+downloadUrl);
                                                        item.setImageUrl(downloadUrl.toString());
                                                        Log.d("Image Url", "onSuccess: "+item.getImageUrl());
                                                        int result = db.InsertAuctionItem(item);
                                                        if (result == -1)
                                                            Toast.makeText(getApplicationContext(), "Some error occurred", Toast.LENGTH_LONG).show();
                                                        else {

                                                            Toast.makeText(getApplicationContext(), "Item posted successfully.", Toast.LENGTH_LONG).show();
                                                            finish();
                                                        }
                                                    }
                                                });


                                        } else {
                                            ShowToast("Provide image of item");
                                        }
                                    } else {
                                        ShowToast("Specify EndDate of Bid");
                                    }
                                } else {
                                    ShowToast("Provide Location");
                                }
                            } else {
                                ShowToast("Provide minimum bid amount");
                            }
                        } else {
                            ShowToast("Description must be greater than 5 length");
                        }
                    } else {
                        ShowToast("Specify category");
                    }
                } else {
                    ShowToast("Title must be greater than 5 length");
                }


            }
        });
        AddPhoto.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent cameraIntent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
                startActivityForResult(cameraIntent, CAMERA_REQUEST);
            }
        });



    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == CAMERA_REQUEST && resultCode == RESULT_OK) {
            ImageResult = ImageManup.getResizedBitmap((Bitmap) data.getExtras().get("data"), 120, 120);
            AddPhoto.setImageBitmap(ImageResult);

        }


    }

    private void ShowDateTimePicker() {
        final View dialogView = View.inflate(AddAuctionItem.this, R.layout.date_time_picker, null);

        final AlertDialog alertDialog = new AlertDialog.Builder(AddAuctionItem.this).create();

        dialogView.findViewById(R.id.date_time_set).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                DatePicker datePicker = (DatePicker) dialogView.findViewById(R.id.date_picker);
                TimePicker timePicker = (TimePicker) dialogView.findViewById(R.id.time_picker);


                String DateTime = datePicker.getYear() + "-" +
                        (datePicker.getMonth() + 1) + "-" +
                        datePicker.getDayOfMonth() + " " +
                        timePicker.getCurrentHour() + ":" +
                        timePicker.getCurrentMinute() + ":00";


                EndDate.setText(DateTime);
                alertDialog.dismiss();
            }
        });
        alertDialog.setView(dialogView);
        alertDialog.show();
    }


    private void ShowToast(String input) {
        Toast.makeText(getApplicationContext(), input, Toast.LENGTH_SHORT).show();
    }
}