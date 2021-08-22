import dataclasses
import psycopg2.sql
import typing
from src.common.setup import db
from ..types.post import DBPost, Post


DB_POST_FIELDS: psycopg2.sql.SQL = psycopg2.sql.SQL(',').join(
    psycopg2.sql.Identifier(f.name)
    for f in dataclasses.fields(DBPost)
    )


def get_all_posts() -> typing.List[DBPost]:
    """Get all post from the database.
    """
    statement = psycopg2.sql.SQL('''
        SELECT      {fields}
        FROM        posts
        ORDER BY    created_at DESC
        ''').format(
            fields=DB_POST_FIELDS,
            )
    posts = db.execute(statement)
    return [DBPost(*post) for post in posts]


def create_post(post: Post) -> DBPost:
    """Saves post to the database.
    """
    insert_fields = []
    placeholders = []
    for f in dataclasses.fields(post):
        insert_fields.append(psycopg2.sql.Identifier(f.name))
        placeholders.append(psycopg2.sql.Placeholder(f.name))

    statement = psycopg2.sql.SQL('''
        INSERT INTO posts ({insert_fields})
        VALUES      ({placeholders})
        RETURNING   {fields}
        ''').format(
            insert_fields=psycopg2.sql.SQL(',').join(insert_fields),
            placeholders=psycopg2.sql.SQL(',').join(placeholders),
            fields=DB_POST_FIELDS,
            )

    record = db.execute(
        statement,
        params=dataclasses.asdict(post),
        single=True,
        )
    return DBPost(*record)
