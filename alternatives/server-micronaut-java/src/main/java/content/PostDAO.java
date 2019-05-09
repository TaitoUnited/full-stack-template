package content;

import static jooq.Tables.POSTS;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Singleton;

import org.jooq.DSLContext;

@Singleton
public class PostDAO {

  private @Inject DSLContext jooq;

  public List<Post> fetch() {
    return jooq.selectFrom(POSTS).orderBy(POSTS.ID).fetchInto(Post.class);
  }

  public Post create(Post post) {
    jooq.insertInto(POSTS, POSTS.SUBJECT, POSTS.AUTHOR, POSTS.CONTENT).values(post.subject, post.author, post.content)
        .returning(POSTS.ID, POSTS.SUBJECT, POSTS.AUTHOR, POSTS.CONTENT);
    // .fetchOne().into(Post.class);
    return post;
  }

}
