package androidassignment.crossover.com.androidassignment;

/**
 * Created by shilpa on 09-12-2016.
 */
public class AuctionHistoryPojo {
    private String UserName;

    AuctionHistoryPojo() {
    }

    AuctionHistoryPojo(String userName, String bidAmount) {
        this.UserName = userName;
        this.BidAmount = bidAmount;
    }

    public String getBidAmount() {
        return BidAmount;
    }

    public void setBidAmount(String bidAmount) {
        BidAmount = bidAmount;
    }

    public String getUserName() {
        return UserName;
    }

    public void setUserName(String userName) {
        UserName = userName;
    }

    private String BidAmount;
}
