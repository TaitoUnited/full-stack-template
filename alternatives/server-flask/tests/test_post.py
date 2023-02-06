from datetime import datetime, timezone
from typing import Any

from src.common.types import Pagination, Order, OrderDirection
from src.messagebus import Messagebus
from src.post.services import CreatePost, PostCreated
from src.post.types import Post, PostData
from src.post.views import search_posts
from tests.fakes import FakePgDB


POST_DATA: list[dict[str, Any]] = [
    {
        "id": 1,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "author": "Mikki Hiiri",
        "subject": "Rotankäynnin taito",
        "content": "Rotsi auki.",
    },
    {
        "id": 2,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "author": "",
        "subject": "",
        "content": "",
    },
]


def test_post_create(
    messagebus: Messagebus,
    pg_db: FakePgDB,
) -> None:
    """"""
    pg_db.returns = [POST_DATA[0]]

    recap = messagebus.handle(
        CreatePost(
            data=PostData(
                author=POST_DATA[0]["author"],
                subject=POST_DATA[0]["subject"],
                content=POST_DATA[0]["content"],
            ),
        ),
    )

    post = next(
        rec.message.post for rec in recap.queue
        if isinstance(rec.message, PostCreated)
    )

    assert post.author == POST_DATA[0]["author"]
    assert post.subject == POST_DATA[0]["subject"]
    assert post.content == POST_DATA[0]["content"]


def test_post_search(
    messagebus: Messagebus,
    pg_db: FakePgDB,
) -> None:
    pg_db.returns = [{"total": len(POST_DATA), "data": POST_DATA}]

    paginated_posts = messagebus.run(
        search_posts,
        pagination=Pagination(
            limit=20,
            offset=0,
        ),
        order=Order(
            dir=OrderDirection.DESC,
            field="created_at",
            invert_null_order=False,
        ),
        filter_groups=[],
        search=None,
    )

    # TODO
    # maybe you want to inspect the SQL sent to pg server
    # maybe not
    # print(pg_db.calls)

    assert paginated_posts.total == len(POST_DATA)

    for post in paginated_posts.data:
        for post_data in POST_DATA:
            if post_data["id"] == post.id:
                assert post == Post(
                    id=post_data["id"],
                    created_at=datetime.strptime(
                        post_data["created_at"],
                        "%Y-%m-%dT%H:%M:%S.%f%z",
                    ),
                    updated_at=datetime.strptime(
                        post_data["updated_at"],
                        "%Y-%m-%dT%H:%M:%S.%f%z",
                    ),
                    author=post_data["author"],
                    subject=post_data["subject"],
                    content=post_data["content"],
                )
                break
