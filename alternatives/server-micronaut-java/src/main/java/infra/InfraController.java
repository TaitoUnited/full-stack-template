package infra;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;

import java.util.Collections;
import java.util.Map;

@Controller("/")
public class InfraController {

  @Get("/healthz")
  public Map<String, String> healthz() {
    return Collections.singletonMap("status", "OK");
  }

  @Get("/uptimez")
  public Map<String, String> uptimez() {
    return Collections.singletonMap("status", "OK");
  }

}
