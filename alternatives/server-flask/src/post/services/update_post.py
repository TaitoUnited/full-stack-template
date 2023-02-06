from dataclasses import dataclass

from src.post.types import Post, PostDao, PostData


@dataclass(frozen=True)
class UpdatePost:
    id: str
    data: PostData


@dataclass(frozen=True)
class PostUpdated:
    post: Post


class UpdatePostHandler:
    """Update new post."""

    def __init__(self, post_dao: PostDao) -> None:
        self.post_dao = post_dao
        self.messages: list = []

    def handle(self, msg: UpdatePost) -> None:
        post = self.post_dao.update(id=msg.id, data=msg.data)
        self.messages.append(PostUpdated(post))
