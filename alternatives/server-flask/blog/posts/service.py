import typing
from blog.types.post import DBPost, Post
from . import db


def get_all_posts() -> typing.List[DBPost]:
    return db.get_all_posts()


def create_post(data: Post) -> DBPost:
    return db.create_post(data)
