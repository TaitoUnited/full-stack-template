package products;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;

import java.util.List;

import javax.inject.Inject;

import common.Envelope;

@Controller("/products")
public class ProductController {

  public static class ProductsEnvelope extends Envelope<List<Product>> {
    public ProductsEnvelope(List<Product> products) {
      super(products);
    }
  }

  @Inject
  ProductService productService;

  @Get("/")
  public ProductsEnvelope fetch() {
    return new ProductsEnvelope(productService.fetch());
  }

}
