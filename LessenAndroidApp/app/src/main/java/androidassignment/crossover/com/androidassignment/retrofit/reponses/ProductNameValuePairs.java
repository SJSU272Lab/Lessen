package androidassignment.crossover.com.androidassignment.retrofit.reponses;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.Date;

/**
 * Created by srinivas on 12-12-2016.
 */

public class ProductNameValuePairs {
    @SerializedName("product_name")
    @Expose
    private String productName;
    @SerializedName("product_price")
    @Expose
    private String productPrice;
//    @SerializedName("product_bid_end_time")
//    @Expose
//    private Integer productBidEndTime;
    @SerializedName("product_image_url")
    @Expose
    private String productImageUrl;

    /**
     *
     * @return
     * The productName
     */
    public String getProductName() {
        return productName;
    }

    /**
     *
     * @param productName
     * The product_name
     */
    public void setProductName(String productName) {
        this.productName = productName;
    }

    /**
     *
     * @return
     * The productPrice
     */
    public String getProductPrice() {
        return productPrice;
    }

    /**
     *
     * @param productPrice
     * The product_price
     */
    public void setProductPrice(String productPrice) {
        this.productPrice = productPrice;
    }

//    /**
//     *
//     * @return
//     * The productBidEndTime
//     */
//    public Integer getProductBidEndTime() {
//        return productBidEndTime;
//    }
//
//    /**
//     *
//     * @param productBidEndTime
//     * The product_bid_end_time
//     */
//    public void setProductBidEndTime(Integer productBidEndTime) {
//        this.productBidEndTime = productBidEndTime;
//    }

    /**
     *
     * @return
     * The productImageUrl
     */
    public String getProductImageUrl() {
        return productImageUrl;
    }

    /**
     *
     * @param productImageUrl
     * The product_image_url
     */
    public void setProductImageUrl(String productImageUrl) {
        this.productImageUrl = productImageUrl;
    }
}
