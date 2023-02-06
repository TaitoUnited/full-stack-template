import dataclasses
from datetime import datetime

from psycopg import sql

from src.common.resources import PgDBI
from src.common import types as common_types
from src.post.types import PaginatedPosts, Post, PostDao, PostData


class PostDaoPgDB:

    Interface = PostDao

    def __init__(self, pgDB: PgDBI):
        self.db = pgDB

    def read(self, post_id: str) -> Post | None:
        """Get post from DB."""
        select = """
            SELECT
                id
            ,   created_at
            ,   updated_at
            ,   author
            ,   content
            ,   subject
            FROM
                post
            WHERE
                id = %(id)s
        """
        post_data = self.db.execute(select, params={"id": post_id})
        if not post_data:
            return None
        return Post(**post_data)

    def search(
        self,
        pagination: common_types.Pagination,
        order: common_types.Order,
        filter_groups: list[common_types.FilterGroup],
        search: str | None = None,
    ) -> PaginatedPosts:
        """Search posts from database."""

        # TODO filter_groups and search string
        # filter_groups done in AttachmentDaoPgDB

        if order.dir == common_types.OrderDirection.DESC:
            null_order = "NULLS LAST" if order.invert_null_order else "NULLS FIRST"
        else:
            null_order = "NULLS FIRST" if order.invert_null_order else "NULLS LAST"

        order_dir = "ASC"
        if order.dir == common_types.OrderDirection.DESC:
            order_dir = "DESC"

        select = sql.SQL("""
            WITH posts AS(
                SELECT
                    id
                ,   created_at
                ,   updated_at
                ,   author
                ,   content
                ,   subject
                FROM
                    post
                ORDER BY
                    {order_by} {order_dir} {null_order}
                OFFSET
                    %(offset)s
                LIMIT
                    %(limit)s
            )

            SELECT
                (SELECT count(*) FROM post) AS total
            ,   JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id', id
                    ,   'created_at', created_at
                    ,   'updated_at', updated_at
                    ,   'author', author
                    ,   'content', content
                    ,   'subject', subject
                    )
                ) AS data
            FROM
                posts
        """).format(
            null_order=sql.SQL(null_order),
            order_dir=sql.SQL(order_dir),
            order_by=sql.Identifier(order.field),
        )

        search_results = self.db.execute(
            select,
            params={
                "offset": pagination.offset,
                "limit": pagination.limit,
            },
        )

        if search_results is None:
            raise RuntimeError("Searching posts failed.")

        return PaginatedPosts(
            total=search_results["total"],
            data=[
                Post(
                    id=data["id"],
                    created_at=datetime.strptime(
                        data["created_at"],
                        "%Y-%m-%dT%H:%M:%S.%f%z",
                    ),
                    updated_at=datetime.strptime(
                        data["updated_at"],
                        "%Y-%m-%dT%H:%M:%S.%f%z",
                    ),
                    author=data["author"],
                    content=data["content"],
                    subject=data["subject"],
                )
                for data in search_results["data"]],
        )

    def create(self, data: PostData) -> Post:
        """Create a new post to database."""
        insert = sql.SQL("""
            INSERT INTO post (
                author
            ,   content
            ,   subject
            )
            VALUES (
                %(author)s
            ,   %(content)s
            ,   %(subject)s
            )
            RETURNING
                id
            ,   created_at
            ,   updated_at
            ,   author
            ,   content
            ,   subject
        """)

        post_data = self.db.execute(insert, params=dataclasses.asdict(data))
        if not post_data:
            raise RuntimeError("Could not create post.")
        return Post(**post_data)

    def update(self, id: str, data: PostData) -> Post:
        update = """
            UPDATE
                post
            SET
                subject = %(subject)s
            ,   content = %(content)s
            ,   author = %(author)s
            WHERE
                id = %(id)s
            RETURNING
                id
            ,   created_at
            ,   updated_at
            ,   author
            ,   content
            ,   subject
        """

        post_data = self.db.execute(
            update,
            params={
                "id": id,
                "subject": data.subject,
                "content": data.content,
                "author": data.author,
            },
        )
        if post_data is None:
            raise RuntimeError("Could not update post in DB.")
        return Post(**post_data)

    def delete(self, id: str) -> Post:
        delete = """
            DELETE FROM
                post
            WHERE
                id = %(id)s
            RETURNING
                id
            ,   created_at
            ,   updated_at
            ,   author
            ,   content
            ,   subject
        """

        post_data = self.db.execute(delete, params={"id": id})
        if post_data is None:
            raise RuntimeError("Could not delete post in DB.")
        return Post(**post_data)
