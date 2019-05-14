package products;

public class Product {
  public String id;
  public String name;

  public Product() {
  }

  public Product(String id, String name) {
    this.id = id;
    this.name = name;
  }

  public Product(Product product) {
    this.id = product.id;
    this.name = product.name;
  }
}
