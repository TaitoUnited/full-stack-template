import typing
from flask import Blueprint, request
from ..services import post_service
from ..types.post import post_server_to_client, post_client_to_server


bp = Blueprint("posts", __name__, url_prefix="/posts")


@bp.route("")
def get_all_posts() -> typing.Any:
    """Get all posts."""
    posts = post_service.get_all_posts()
    return {"data": post_server_to_client(posts)}


@bp.route("", methods=("POST",))
def create_post() -> typing.Any:
    """Save new post to database."""
    request_data = request.get_json()
    post_data = post_client_to_server(request_data["data"])
    post = post_service.create_post(post_data)
    return {"data": post_server_to_client(post)}, 201
