import dataclasses
from typing import Any
from typing_extensions import LiteralString

from psycopg import sql

from src.attachment.types import (
    Attachment,
    AttachmentDao,
    AttachmentData,
    PaginatedAttachments,
)
from src.common import types as common_types
from src.common.resources import PgDBI


def op_to_sql(operator: common_types.FilterOperator) -> LiteralString:
    match operator:
        case common_types.FilterOperator.EQ:
            return "="
        case common_types.FilterOperator.NEQ:
            return "!="
        case common_types.FilterOperator.GT:
            return ">"
        case common_types.FilterOperator.GTE:
            return ">="
        case common_types.FilterOperator.LT:
            return "<"
        case common_types.FilterOperator.LTE:
            return "<="
        case common_types.FilterOperator.LIKE:
            return "LIKE"
        case common_types.FilterOperator.ILIKE:
            return "ILIKE"


def logop_to_sql(
    logical_operator: common_types.FilterLogicalOperator,
) -> LiteralString:
    match logical_operator:
        case common_types.FilterLogicalOperator.AND:
            return "AND"
        case common_types.FilterLogicalOperator.OR:
            return "OR"


class AttachmentDaoPgDB:

    Interface = AttachmentDao

    def __init__(self, db: PgDBI) -> None:
        self.db = db

    def search(
        self,
        search: str | None,
        filter_groups: list[common_types.FilterGroup],
        order: common_types.Order,
        pagination: common_types.Pagination,
    ) -> PaginatedAttachments:
        """Search attachments from database."""

        # TODO search string

        params: dict[str, Any] = {
            "offset": pagination.offset,
            "limit": pagination.limit,
        }

        filters: list[sql.Composable] = [sql.SQL("True")]
        for group in filter_groups:
            _filters: list[sql.Composable] = []
            for filter in group.filters:
                placeholder_name = f"{filter.field}_{id(filter)}"
                _filters.append(
                    sql.SQL(" ").join(
                        [
                            sql.Identifier(filter.field),
                            sql.SQL(op_to_sql(filter.operator)),
                            sql.Placeholder(placeholder_name)
                        ]
                    )
                )
                params[placeholder_name] = filter.value
            filters.append(sql.SQL(logop_to_sql(group.operator)).join(_filters))

        if order.dir == common_types.OrderDirection.DESC:
            null_order = "NULLS LAST" if order.invert_null_order else "NULLS FIRST"
        else:
            null_order = "NULLS FIRST" if order.invert_null_order else "NULLS LAST"

        order_dir = "ASC"
        if order.dir == common_types.OrderDirection.DESC:
            order_dir = "DESC"

        select = sql.SQL("""
            WITH attachments AS(
                SELECT
                    id
                ,   created_at
                ,   updated_at
                ,   attachment_type
                ,   content_type
                ,   filename
                ,   post_id
                ,   title
                ,   description
                ,   count(*) OVER() AS total
                FROM
                    attachment
                WHERE
                    {filters}
                ORDER BY
                    {order_by} {order_dir} {null_order}
                OFFSET
                    %(offset)s
                LIMIT
                    %(limit)s
            )

            -- subqueries return NULL if now rows match
            -- so in case no attachments match
            -- we get a row (0, []) instead of no rows

            SELECT
                COALESCE(
                    (
                        SELECT
                            total
                        FROM
                            attachments
                        LIMIT
                            1
                    ),
                    0
                ) AS total
            ,   COALESCE(
                    (
                        SELECT
                            JSON_AGG(
                                JSON_BUILD_OBJECT(
                                    'id', id
                                ,   'created_at', created_at
                                ,   'updated_at', updated_at
                                ,   'attachment_type', attachment_type
                                ,   'content_type', content_type
                                ,   'filename', filename
                                ,   'post_id', post_id
                                ,   'title', title
                                ,   'description', description
                                )
                            )
                        FROM
                            attachments
                    ),
                    '[]'::JSON
                ) AS data
        """).format(
            filters=sql.SQL(" AND ").join(filters),
            null_order=sql.SQL(null_order),
            order_dir=sql.SQL(order_dir),
            order_by=sql.Identifier(order.field),
        )

        search_results = self.db.execute(select, params=params)

        if search_results is None:
            raise RuntimeError("Searching for attachments failed.")

        return PaginatedAttachments(
            total=search_results["total"],
            data=[Attachment(**data) for data in search_results["data"]],
        )

    def read(self, id: str, post_id: str | None) -> Attachment | None:
        select = """
            SELECT
                id
            ,   created_at
            ,   updated_at
            ,   attachment_type
            ,   content_type
            ,   filename
            ,   post_id
            ,   title
            ,   description
            FROM
                attachment
            WHERE
                id = %(id)s
            AND (
                %(post_id)s IS NULL
                OR post_id = %(post_id)s
            )
        """

        attachment_data = self.db.execute(select, params={"id": id, "post_id": post_id})
        if not attachment_data:
            return None
        return Attachment(**attachment_data)

    def create(self, data: AttachmentData) -> Attachment:
        insert = """
            INSERT INTO attachment (
                attachment_type
            ,   content_type
            ,   filename
            ,   post_id
            ,   title
            ,   description
            )
            VALUES (
                %(attachment_type)s
            ,   %(content_type)s
            ,   %(filename)s
            ,   %(post_id)s
            ,   %(title)s
            ,   %(description)s
            )
            RETURNING
                id
            ,   created_at
            ,   updated_at
            ,   attachment_type
            ,   content_type
            ,   filename
            ,   post_id
            ,   title
            ,   description
        """

        attachment_data = self.db.execute(insert, params=dataclasses.asdict(data))
        if attachment_data is None:
            raise RuntimeError("Could not save attachment to DB.")
        return Attachment(**attachment_data)

    def finalize(self, id: str) -> Attachment:
        update = """
            UPDATE
                attachment
            SET
                lifecycle_status = 'CREATED'
            WHERE
                id = %(id)s
            RETURNING
                id
            ,   created_at
            ,   updated_at
            ,   attachment_type
            ,   content_type
            ,   filename
            ,   post_id
            ,   title
            ,   description
        """

        attachment_data = self.db.execute(update, params={"id": id})
        if attachment_data is None:
            raise RuntimeError("Could not finalize attachment in DB.")
        return Attachment(**attachment_data)

    def update(self, id: str, data: AttachmentData) -> Attachment:
        update = """
            UPDATE
                attachment
            SET
                title = %(title)s
            ,   description = %(description)s
            WHERE
                id = %(id)s
            RETURNING
                id
            ,   created_at
            ,   updated_at
            ,   attachment_type
            ,   content_type
            ,   filename
            ,   post_id
            ,   title
            ,   description
        """

        attachment_data = self.db.execute(
            update,
            params={"id": id, "title": data.title, "description": data.description},
        )
        if attachment_data is None:
            raise RuntimeError("Could not update attachment in DB.")
        return Attachment(**attachment_data)

    def delete(self, id: str) -> Attachment:
        delete = """
            DELETE FROM
                attachment
            WHERE
                id = %(id)s
            RETURNING
                id
            ,   created_at
            ,   updated_at
            ,   attachment_type
            ,   content_type
            ,   filename
            ,   post_id
            ,   title
            ,   description
        """

        attachment_data = self.db.execute(delete, params={"id": id})
        if attachment_data is None:
            raise RuntimeError("Could not delete attachment in DB.")
        return Attachment(**attachment_data)
