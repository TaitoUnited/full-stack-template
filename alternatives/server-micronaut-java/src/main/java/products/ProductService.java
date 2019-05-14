package products;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
public class ProductService {

  @Inject
  ProductDAO productDAO;

  @Inject
  ProductProducer productProducer;

  public List<Product> fetch() {
    productProducer.send("fetch", "all");
    return productDAO.fetch();
  }

}
