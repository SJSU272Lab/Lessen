package androidassignment.crossover.com.androidassignment.retrofit.reponses;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by srinivas on 11-12-2016.
 */

public class ActiveProductResponse {

    @SerializedName("_id")
    @Expose
    private ProductId id;
    @SerializedName("nameValuePairs")
    @Expose
    private ProductNameValuePairs nameValuePairs;

    /**
     *
     * @return
     * The id
     */
    public ProductId getId() {
        return id;
    }

    /**
     *
     * @param id
     * The _id
     */
    public void setId(ProductId id) {
        this.id = id;
    }

    /**
     *
     * @return
     * The nameValuePairs
     */
    public ProductNameValuePairs getNameValuePairs() {
        return nameValuePairs;
    }

    /**
     *
     * @param nameValuePairs
     * The nameValuePairs
     */
    public void setNameValuePairs(ProductNameValuePairs nameValuePairs) {
        this.nameValuePairs = nameValuePairs;
    }

}


