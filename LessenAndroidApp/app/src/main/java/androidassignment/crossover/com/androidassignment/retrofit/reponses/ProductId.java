package androidassignment.crossover.com.androidassignment.retrofit.reponses;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by srinivas on 11-12-2016.
 */

public class ProductId {
    @SerializedName("$oid")
    @Expose
    private String $oid;

    /**
     *
     * @return
     * The $oid
     */
    public String get$oid() {
        return $oid;
    }

    /**
     *
     * @param $oid
     * The $oid
     */
    public void set$oid(String $oid) {
        this.$oid = $oid;
    }

}
