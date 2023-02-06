from src.common import types as common_types
from src.post.types import PaginatedPosts, Post, PostDao


def search_posts(
    post_dao: PostDao,
    pagination: common_types.Pagination,
    order: common_types.Order,
    filter_groups: list[common_types.FilterGroup],
    search: str | None = None,
) -> PaginatedPosts:
    return post_dao.search(
        pagination=pagination,
        order=order,
        filter_groups=filter_groups,
        search=search,
    )


def read_post(post_dao: PostDao, post_id: str) -> Post | None:
    return post_dao.read(post_id)
