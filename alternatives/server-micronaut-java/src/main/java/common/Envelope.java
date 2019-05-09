package common;

/**
 * Envelope for http request and response body content
 */
public class Envelope<T> {
  private T data;

  public Envelope() {
  }

  public Envelope(T data) {
    this.data = data;
  }

  public T getData() {
    return data;
  }

  public void setData(T data) {
    this.data = data;
  }

}
