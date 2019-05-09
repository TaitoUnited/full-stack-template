package content;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Singleton;

// import io.micronaut.spring.tx.annotation.Transactional;

@Singleton
public class PostService {

  @Inject
  PostDAO postDAO;

  public List<Post> fetch() {
    return postDAO.fetch();
  }

  // @Transactional
  public Post create(Post post) {
    return postDAO.create(post);
  }

}
