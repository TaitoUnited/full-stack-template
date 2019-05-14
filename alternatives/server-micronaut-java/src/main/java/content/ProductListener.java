package content;

import javax.inject.Inject;

import io.micronaut.configuration.kafka.annotation.KafkaKey;
import io.micronaut.configuration.kafka.annotation.KafkaListener;
import io.micronaut.configuration.kafka.annotation.OffsetReset;
import io.micronaut.configuration.kafka.annotation.Topic;

@KafkaListener(offsetReset = OffsetReset.EARLIEST)
public class ProductListener {

  @Inject
  PostService postService;

  @Topic("products")
  public void receive(@KafkaKey String operation, String filter) {
    postService.create(new Post(null, "Products fetch",
        "Someone is interested of our products. Go and sell!", "System"));
  }

}
