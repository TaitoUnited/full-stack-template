package management;

import io.micronaut.spring.tx.annotation.Transactional;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
public class UserService {

  @Inject
  UserDAO userDAO;

  @Inject
  UserProducer userProducer;

  public List<User> fetch() {
    return userDAO.fetch();
  }

  @Transactional
  public User create(User user) {
    // Add user to database and send event to Kafka
    User createdUser = userDAO.create(user);
    userProducer.send(createdUser.id, createdUser.username);
    return createdUser;
  }

}
