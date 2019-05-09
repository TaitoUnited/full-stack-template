package content;

import javax.inject.Inject;

import io.micronaut.configuration.kafka.annotation.KafkaKey;
import io.micronaut.configuration.kafka.annotation.KafkaListener;
import io.micronaut.configuration.kafka.annotation.OffsetReset;
import io.micronaut.configuration.kafka.annotation.Topic;

@KafkaListener(offsetReset = OffsetReset.EARLIEST)
public class UserListener {

  @Inject
  PostService postService;

  @Topic("users")
  public void receive(@KafkaKey String id, String username) {
    postService.create(new Post(null, "User " + username + " was added!",
        "Let's make him/her feel welcome", "System"));
  }

}
