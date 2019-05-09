package infra;

import io.micronaut.context.annotation.Factory;

import java.io.Serializable;
import java.sql.SQLException;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.sql.DataSource;

import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;

@Factory
@SuppressWarnings("serial")
public class DSLContextFactory implements Serializable {

  @Inject
  private DataSource ds;

  @Singleton
  public DSLContext getDSLContext() throws SQLException {
    return DSL.using(ds.getConnection(), SQLDialect.POSTGRES_10);
  }
}
