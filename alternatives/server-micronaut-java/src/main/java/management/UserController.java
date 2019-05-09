package management;

import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;

import java.util.List;

import javax.inject.Inject;

import common.Envelope;

@Controller("/users")
public class UserController {

  public static class UsersEnvelope extends Envelope<List<User>> {
    public UsersEnvelope(List<User> users) {
      super(users);
    }
  }

  public static class UserEnvelope extends Envelope<User> {
    public UserEnvelope(User user) {
      super(user);
    }
  }

  @Inject
  UserService userService;

  @Get("/")
  public UsersEnvelope fetch() {
    // Create new user on each fetch just for Kafka demonstration purposes
    userService.create(new User(null, "newuser", "New", "User"));
    return new UsersEnvelope(userService.fetch());
  }

}
