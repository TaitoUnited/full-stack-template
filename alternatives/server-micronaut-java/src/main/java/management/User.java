package management;

public class User {
  public String id;
  public String username;
  public String firstName;
  public String lastName;

  public User() {
  }

  public User(String id, String username, String firstName, String lastName) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public User(User user) {
    this.id = user.id;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}
