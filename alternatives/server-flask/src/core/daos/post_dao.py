import dataclasses
from psycopg2 import sql
import typing
from src.common.setup import db
from ..types.post import DBPost, Post


DB_POST_FIELDS: sql.SQL = sql.SQL(",").join(
    sql.Identifier(f.name) for f in dataclasses.fields(DBPost)
)


class PostDao:
    def __init__(self, database=None):
        self._db = database or db

    def search(self) -> typing.List[DBPost]:
        """Search posts from database."""
        # TODO: handle search filters, paging and total count
        statement = sql.SQL(
            """
            SELECT      {fields}
            FROM        posts
            ORDER BY    created_at DESC
            """
        ).format(
            fields=DB_POST_FIELDS,
        )
        posts = self._db.execute(statement)
        return [DBPost(*post) for post in posts]

    def create(self, post: Post) -> DBPost:
        """Create a new post to database."""
        insert_fields = []
        placeholders = []
        for f in dataclasses.fields(post):
            insert_fields.append(sql.Identifier(f.name))
            placeholders.append(sql.Placeholder(f.name))

        statement = sql.SQL(
            """
            INSERT INTO posts ({insert_fields})
            VALUES      ({placeholders})
            RETURNING   {fields}
            """
        ).format(
            insert_fields=sql.SQL(",").join(insert_fields),
            placeholders=sql.SQL(",").join(placeholders),
            fields=DB_POST_FIELDS,
        )

        record = self._db.execute(
            statement,
            params=dataclasses.asdict(post),
            single=True,
        )
        return DBPost(*record)
