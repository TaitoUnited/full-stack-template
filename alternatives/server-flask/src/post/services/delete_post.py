from dataclasses import dataclass

from src.post.types import Post, PostDao


@dataclass(frozen=True)
class DeletePost:
    id: str


@dataclass(frozen=True)
class PostDeleted:
    post: Post


class DeletePostHandler:
    """Delete new post."""

    def __init__(self, post_dao: PostDao) -> None:
        self.post_dao = post_dao
        self.messages: list = []

    def handle(self, msg: DeletePost) -> None:
        post = self.post_dao.delete(id=msg.id)
        self.messages.append(PostDeleted(post))
