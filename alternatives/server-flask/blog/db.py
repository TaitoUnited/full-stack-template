import contextlib
import flask
import psycopg2
import psycopg2.pool
import psycopg2.sql
import time
import typing


pool: psycopg2.extensions.connection = None


def connect(app: flask.Flask) -> None:
    """Initialize database connection pool.

    Uses simple connection pool. This is not thread safe, and should
    be called post-fork when behind e.g. uwsgi.
    """
    app.logger.debug('Creating DB connection pool.')
    global pool
    attempt = 1
    while pool is None:
        # simple retry loop, blocks until success or raise after max
        # attempts.
        try:
            pool = psycopg2.pool.SimpleConnectionPool(
                app.config['DATABASE_POOL_MIN'],
                app.config['DATABASE_POOL_MAX'],
                host=app.config['DATABASE_HOST'],
                port=app.config['DATABASE_PORT'],
                database=app.config['DATABASE_NAME'],
                user=app.config['DATABASE_USER'],
                password=app.config['DATABASE_PASSWORD'],
                )
        except psycopg2.OperationalError as e:
            if attempt >= app.config['DATABASE_MAX_RETRIES']:
                app.logger.exception('Could not connect to DB.')
                raise e
            else:
                timeout = min(2 ** attempt, 32)
                app.logger.error(
                    f'DB connection error, retrying in {timeout} seconds. {e}'
                )
                time.sleep(timeout)
                attempt += 1
        else:
            app.logger.info('DB connection pool created.')


@contextlib.contextmanager
def database_connection(
    autocommit: bool = False,
) -> typing.Iterator[psycopg2.extensions.connection]:
    """Context manager for database transactions.

    By default the transaction is commited when exiting the context
    manager normally or rolled back in case of unhandled exception. But
    since e.g. VACUUM can not be issued inside transaction, the
    connection commit behaviour can be altered with `autocommit=True`.
    """
    conn = pool.getconn()
    conn.autocommit = autocommit
    try:
        yield conn
    except Exception:
        conn.rollback()
        raise
    else:
        conn.commit()
    finally:
        pool.putconn(conn)


DBRow = typing.Tuple[typing.Any]


def execute(
    statement: typing.Union[str, psycopg2.sql.Composable],
    *,
    params: typing.Optional[typing.Dict[str, typing.Any]] = None,
    single: typing.Optional[bool] = False,
) -> typing.Union[DBRow, typing.List[DBRow]]:
    """Executes given statement with given params.
    """
    with database_connection() as conn, conn.cursor() as cursor:
        mogrified = cursor.mogrify(statement, params)
        flask.current_app.logger.debug(mogrified.decode('utf8'))
        cursor.execute(mogrified)
        if single:
            return cursor.fetchone()
        return cursor.fetchall()
