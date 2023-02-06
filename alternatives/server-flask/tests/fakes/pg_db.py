# from contextvars import Token
from typing import Any
from typing_extensions import LiteralString

from psycopg.sql import Composed, SQL

from src.common.resources import PgDBI


class FakePgDB:

    Interface = PgDBI

    def __init__(self) -> None:
        self.returns: list[Any] = []
        self.calls: list[tuple] = []

    # @property
    # def tx(self) -> Connection:
    #     tx = _tx.get()
    #     if tx is None:
    #         raise RuntimeError("Transaction has not been started")
    #     return tx

    # def start_tx(self) -> Token:
    #     tx = _tx.get()
    #     if tx is not None:
    #         # We do not know the token to reset previously set
    #         # context variable, so raise here.
    #         raise RuntimeError("Transaction has already been started")
    #     tx = self.pool.getconn()
    #     return _tx.set(tx)

    # def end_tx(self, token: Token, rollback: bool = False) -> None:
    #     tx = _tx.get()
    #     if tx is None:
    #         return
    #     try:
    #         if not rollback:
    #             tx.commit()
    #     finally:
    #         self.pool.putconn(tx)
    #         _tx.reset(token)

    def execute(
        self,
        statement: Composed | SQL | LiteralString,
        *,
        params: dict[str, Any] | None = None,
        single: bool = True,
    ) -> list[dict[str, Any]] | dict[str, Any] | None:
        self.calls.append((
            statement,
            params,
            single
        ))
        return self.returns.pop()
