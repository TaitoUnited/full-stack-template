import typing
from ..types.post import DBPost, Post
from ..daos import post_dao


def get_all_posts() -> typing.List[DBPost]:
    return post_dao.get_all_posts()


def create_post(data: Post) -> DBPost:
    return post_dao.create_post(data)
