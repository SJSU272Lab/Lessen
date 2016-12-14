package androidassignment.crossover.com.androidassignment;

/**
 * Created by shilpa on 09-12-2016.
 */
public class UserProfile {
    String Email;
    String Name;


    UserProfile(String email, String name, String hashedPassword) {
        this.setEmail(email);
        this.setName(name);
        this.setHashedPassword(hashedPassword);
    }

    UserProfile(String email, String password) {

        this.setEmail(email);
        this.setHashedPassword(password);
    }

    public String getHashedPassword() {
        return HashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        HashedPassword = hashedPassword;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    String HashedPassword;
}
