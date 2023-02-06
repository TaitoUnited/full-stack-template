from contextvars import ContextVar, Token
import logging
from typing import Any, ClassVar, Literal, overload, Protocol

from psycopg import Connection
from psycopg.rows import dict_row
from psycopg.sql import Composed, LiteralString, SQL
from psycopg_pool import ConnectionPool


class PgDBI(Protocol):

    def start_tx(self) -> Token:
        ...

    def end_tx(self, token: Token, rollback: bool = False) -> None:
        ...

    @overload
    def execute(
        self,
        statement: Composed | SQL | LiteralString,
        *,
        params: dict[str, Any] | None = None,
        single: Literal[False],
    ) -> list[dict[str, Any]]:
        ...

    @overload
    def execute(
        self,
        statement: Composed | SQL | LiteralString,
        *,
        params: dict[str, Any] | None = None,
        single: Literal[True],
    ) -> dict[str, Any] | None:
        ...

    @overload
    def execute(
        self,
        statement: Composed | SQL | LiteralString,
        *,
        params: dict[str, Any] | None = None,
    ) -> dict[str, Any] | None:
        ...


_tx: ContextVar[Connection | None] = ContextVar("_tx", default=None)


class PgDB:
    """Simple wrapper around PG connection."""

    Interface = PgDBI
    logger = logging.getLogger(__name__)
    # Pool is a classvar so all instances share the same one
    pool: ClassVar[ConnectionPool]

    def __init__(
        self,
        database_host: str,
        database_port: int,
        database_user: str,
        database_password: str,
        database_name: str,
        database_pool_max: int,
        database_pool_min: int,
    ) -> None:
        if not hasattr(self, "pool"):
            self.__class__.pool = ConnectionPool(
                conninfo=(
                    f"postgresql://{database_user}:{database_password}"
                    f"@{database_host}:{database_port}/{database_name}"
                ),
                max_size=database_pool_max,
                min_size=database_pool_min,
            )
            self.logger.info("Database connection pool initialized")

    @property
    def tx(self) -> Connection:
        tx = _tx.get()
        if tx is None:
            raise RuntimeError("Transaction has not been started")
        return tx

    def start_tx(self) -> Token:
        tx = _tx.get()
        if tx is not None:
            # We do not know the token to reset previously set
            # context variable, so raise here.
            raise RuntimeError("Transaction has already been started")
        tx = self.pool.getconn()
        return _tx.set(tx)

    def end_tx(self, token: Token, rollback: bool = False) -> None:
        tx = _tx.get()
        if tx is None:
            return
        try:
            if not rollback:
                tx.commit()
        finally:
            self.pool.putconn(tx)
            _tx.reset(token)

    def execute(
        self,
        statement: Composed | SQL | LiteralString,
        *,
        params: dict[str, Any] | None = None,
        single: bool = True,
    ) -> list[dict[str, Any]] | dict[str, Any] | None:
        with (
            self.tx as conn,
            conn.cursor(row_factory=dict_row) as cursor
        ):
            cursor.execute(statement, params)
            if single:
                return cursor.fetchone()
            return cursor.fetchall()
