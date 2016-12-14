package androidassignment.crossover.com.androidassignment;

/**
 * Created by srinivas on 09-12-2016.
 */

public class MongoQueryBuilder {
    public String getDatabaseName() {
        return "lessen";
    }
    public String getApiKey() {
        return "aMhcwsC-xs68LzUSUrhyktg2wGnpHpb-";
    }
    public String getBaseUrl()
    {
        return "https://api.mongolab.com/api/1/databases/"+getDatabaseName()+"/collections/";
    }
    public String docApiKeyUrl()
    {
        return "?apiKey="+getApiKey();
    }
    public String documentRequest()
    {
        return "product";
    }
    public String buildContactsSaveURL()
    {
        return getBaseUrl()+documentRequest()+docApiKeyUrl();
    }


}
