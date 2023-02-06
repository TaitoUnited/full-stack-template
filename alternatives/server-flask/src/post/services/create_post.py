from dataclasses import dataclass

from src.post.types import Post, PostDao, PostData


@dataclass(frozen=True)
class CreatePost:
    data: PostData


@dataclass(frozen=True)
class PostCreated:
    post: Post


class CreatePostHandler:
    """Create new post."""

    def __init__(self, post_dao: PostDao) -> None:
        self.post_dao = post_dao
        self.messages: list = []

    def handle(self, msg: CreatePost) -> None:
        post = self.post_dao.create(data=msg.data)
        self.messages.append(PostCreated(post))
