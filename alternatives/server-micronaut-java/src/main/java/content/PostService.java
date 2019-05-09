package content;

import io.micronaut.spring.tx.annotation.Transactional;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
public class PostService {

  @Inject
  PostDAO postDAO;

  public List<Post> fetch() {
    return postDAO.fetch();
  }

  // TODO: @Transactional does not work properly?
  // package org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy
  // not in classpath?
  @Transactional
  public Post create(Post post) {
    return postDAO.create(post);
  }

}
