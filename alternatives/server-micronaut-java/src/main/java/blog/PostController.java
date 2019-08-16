package blog;

import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;

import java.util.List;

import javax.inject.Inject;

import common.Envelope;

@Controller("/posts")
public class PostController {

  public static class PostsEnvelope extends Envelope<List<Post>> {
    public PostsEnvelope(List<Post> posts) {
      super(posts);
    }
  }

  public static class PostEnvelope extends Envelope<Post> {
    public PostEnvelope(Post post) {
      super(post);
    }
  }

  @Inject
  PostService postService;

  @Get("/")
  public PostsEnvelope fetch() {
    return new PostsEnvelope(postService.fetch());
  }

  @io.micronaut.http.annotation.Post("/")
  public PostEnvelope create(@Body PostEnvelope2 body) {
    return new PostEnvelope(postService.create(body.getData()));
  }

}
