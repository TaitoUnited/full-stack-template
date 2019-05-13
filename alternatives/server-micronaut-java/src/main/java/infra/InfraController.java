package infra;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;

import java.util.Collections;
import java.util.Map;

import javax.inject.Inject;

import org.jooq.DSLContext;

@Controller("/")
public class InfraController {

  private @Inject DSLContext jooq;

  @Get("/healthz")
  public Map<String, String> healthz() {
    return Collections.singletonMap("status", "OK");
  }

  @Get("/uptimez")
  public Map<String, String> uptimez() {
    jooq.fetch("SELECT 1");
    return Collections.singletonMap("status", "OK");
  }

}
