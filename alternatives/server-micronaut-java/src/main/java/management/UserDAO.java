package management;

import java.util.Arrays;
import java.util.List;

import javax.inject.Singleton;

import org.apache.commons.lang3.RandomStringUtils;

/**
 * Fake UserDAO that does nothing
 */
@Singleton
public class UserDAO {

  public List<User> fetch() {
    return Arrays.asList(new User("fj35-f3k4", "johndoe", "John", "Doe"),
        new User("gj33-f3k4", "janedoe", "Jane", "Doe"));
  }

  public User create(User user) {
    User createdUser = new User(user);
    createdUser.id = RandomStringUtils.random(10);
    return createdUser;
  }

}
