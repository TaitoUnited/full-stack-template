import typing
from flask import Blueprint, request
from ..services.post_service import PostService
from ..types.post import post_server_to_client, post_client_to_server

post_service = PostService()


bp = Blueprint("posts", __name__, url_prefix="/posts")


@bp.route("")
def search() -> typing.Any:
    """Get all posts."""
    posts = post_service.search()
    return {"data": post_server_to_client(posts)}


@bp.route("", methods=("POST",))
def create() -> typing.Any:
    """Save new post to database."""
    request_data = request.get_json()
    post_data = post_client_to_server(request_data["data"])
    post = post_service.create(post_data)
    return {"data": post_server_to_client(post)}, 201
