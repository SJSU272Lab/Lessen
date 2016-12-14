package androidassignment.crossover.com.androidassignment.retrofit.reponses;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import androidassignment.crossover.com.androidassignment.retrofit.reponses.ProductId;

/**
 * Created by srinivas on 11-12-2016.
 */

public class ProductInsertResponse {

    @SerializedName("product_name")
    @Expose
    private String productName;
    @SerializedName("product_price")
    @Expose
    private Integer productPrice;
    @SerializedName("product_condition")
    @Expose
    private String productCondition;
    @SerializedName("address")
    @Expose
    private String address;

    @SerializedName("product_image_url")
    @Expose
    private String product_image_url;
    @SerializedName("status")
    @Expose
    private Boolean status;
    @SerializedName("_id")
    @Expose
    private ProductId Id;

    @SerializedName("is_admin_approved")
    @Expose
    private  Boolean is_admin_approved;
    @SerializedName("is_pickup_pending")
    @Expose
    private Boolean is_pickup_pending;
    @SerializedName("product_category_id")
    @Expose
    private String product_category_id;
    @SerializedName("product_stock")
    @Expose
    private String product_stock;
    @SerializedName("product_bid_start_price")
    @Expose
    private int product_bid_start_price;
    @SerializedName("product_bid_end_time")
    @Expose
    private int product_bid_end_time;
    @SerializedName("product_bid_start_time")
    @Expose
    private int product_bid_start_time;
    @SerializedName("product_bid_end")
    @Expose
    private int product_bid_end;
    @SerializedName("product_max_bid_price")
    @Expose
    private int product_max_bid_price;
    @SerializedName("product_desc")
    @Expose
    private String product_desc;


    public int getProduct_bid_start_time() {
        return product_bid_start_time;
    }

    public void setProduct_bid_start_time(int product_bid_start_time) {
        this.product_bid_start_time = product_bid_start_time;
    }

    public Boolean getIs_admin_approved() {
        return is_admin_approved;
    }

    public void setIs_admin_approved(Boolean is_admin_approved) {
        this.is_admin_approved = is_admin_approved;
    }

    public Boolean getIs_pickup_pending() {
        return is_pickup_pending;
    }

    public void setIs_pickup_pending(Boolean is_pickup_pending) {
        this.is_pickup_pending = is_pickup_pending;
    }

    public String getProduct_category_id() {
        return product_category_id;
    }

    public void setProduct_category_id(String product_category_id) {
        this.product_category_id = product_category_id;
    }

    public String getProduct_stock() {
        return product_stock;
    }

    public void setProduct_stock(String product_stock) {
        this.product_stock = product_stock;
    }

    public int getProduct_bid_start_price() {
        return product_bid_start_price;
    }

    public void setProduct_bid_start_price(int product_bid_start_price) {
        this.product_bid_start_price = product_bid_start_price;
    }

    public int getProduct_bid_end_time() {
        return product_bid_end_time;
    }

    public void setProduct_bid_end_time(int product_bid_end_time) {
        this.product_bid_end_time = product_bid_end_time;
    }

    public int getProduct_bid_end() {
        return product_bid_end;
    }

    public void setProduct_bid_end(int product_bid_end) {
        this.product_bid_end = product_bid_end;
    }

    public int getProduct_max_bid_price() {
        return product_max_bid_price;
    }

    public void setProduct_max_bid_price(int product_max_bid_price) {
        this.product_max_bid_price = product_max_bid_price;
    }

    public String getProduct_desc() {
        return product_desc;
    }

    public void setProduct_desc(String product_desc) {
        this.product_desc = product_desc;
    }




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
    public void   setProductName(String productName) {
        this.productName = productName;
    }

    /**
     *
     * @return
     * The productPrice
     */
    public Integer getProductPrice() {
        return productPrice;
    }

    /**
     *
     * @param productPrice
     * The product_price
     */
    public void setProductPrice(Integer productPrice) {
        this.productPrice = productPrice;
    }

    /**
     *
     * @return
     * The productCondition
     */
    public String getProductCondition() {
        return productCondition;
    }

    /**
     *
     * @param productCondition
     * The product_condition
     */
    public void setProductCondition(String productCondition) {
        this.productCondition = productCondition;
    }

    /**
     *
     * @return
     * The address
     */
    public String getAddress() {
        return address;
    }

    /**
     *
     * @param address
     * The address
     */
    public void setAddress(String address) {
        this.address = address;
    }

    /**
     *
     * @return
     * The status
     */
    public Boolean getStatus() {
        return status;
    }

    /**
     *
     * @param status
     * The status
     */
    public void setStatus(Boolean status) {
        this.status = status;
    }

    /**
     *
     * @return
     * The ProductId
     */
    public ProductId getProductId() {
        return Id;
    }

    /**
     *
     * @param id
     * The Id
     */
    public void setProductId(ProductId id) {
        this.Id = id;
    }

    /**
     *
     * @return
     * The product_image_url
     */

    public String getProduct_image_url() {
        return product_image_url;
    }

    /**
     *
     * @param product_image_url
     * The product_image_url
     */

    public void setProduct_image_url(String product_image_url) {
        this.product_image_url = product_image_url;
    }

}


