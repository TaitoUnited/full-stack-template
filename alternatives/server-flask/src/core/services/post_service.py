import typing
from ..types.post import DBPost, Post
from ..daos.post_dao import PostDao


class PostService:
    def __init__(self, post_dao=None):
        self._post_dao = post_dao or PostDao()

    def search(self) -> typing.List[DBPost]:
        return self._post_dao.search()

    def create(self, data: Post) -> DBPost:
        return self._post_dao.create(data)
