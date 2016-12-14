package androidassignment.crossover.com.androidassignment.retrofit.reponses;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

/**
 * Created by srinivas on 09-12-2016.
 */

public class UserResponse {
    @SerializedName("_id")
        @Expose
        private UserId id;
        @SerializedName("user_email")
        @Expose
        private String userEmail;

        /**
         * @return The id
         */
        public UserId getId() {
            return id;
        }

        /**
         * @param id The _id
         */
        public void setId(UserId id) {
            this.id = id;
        }

        /**
         * @return The userEmail
         */
        public String getUserEmail() {
            return userEmail;
        }

        /**
         * @param userEmail The user_email
         */
        public void setUserEmail(String userEmail) {
            this.userEmail = userEmail;
        }
    }


