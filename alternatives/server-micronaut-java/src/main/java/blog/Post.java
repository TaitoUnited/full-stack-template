package blog;

public class Post {
  public String id;
  public String subject;
  public String content;
  public String author;

  public Post() {}

  public Post(String id, String subject, String content, String author) {
    this.id = id;
    this.subject = subject;
    this.content = content;
    this.author = author;
  }

}
