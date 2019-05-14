package products;

import java.util.Arrays;
import java.util.List;

import javax.inject.Singleton;

/**
 * Fake ProductDAO that does nothing
 */
@Singleton
public class ProductDAO {

  public List<Product> fetch() {
    return Arrays.asList(
        new Product("fj35-f3k4", "product1"),
        new Product("gj33-f3k4", "product2"));
  }

}
