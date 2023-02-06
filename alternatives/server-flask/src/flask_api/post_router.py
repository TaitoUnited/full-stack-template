from collections.abc import Mapping

from flask import Blueprint, current_app, request

from src.messagebus import Messagebus
from src.post.services import CreatePost, PostCreated
from src.post.types import PostData
from src.post.views import read_post, search_posts


bp = Blueprint("posts", __name__, url_prefix="/posts")


@bp.route("/<int:post_id>")
def get(post_id: int) -> dict:
    """Get a post."""
    messagebus: Messagebus = current_app.extensions["messagebus"]
    posts = messagebus.run(read_post, post_id=post_id)

    return {"data": posts}


@bp.route("")
def search() -> dict:
    """Get all posts."""
    messagebus: Messagebus = current_app.extensions["messagebus"]
    posts = messagebus.run(search_posts)

    return {"data": posts}


@bp.route("", methods=("POST",))
def create() -> tuple[dict, int]:
    """Save new post to database."""
    post_data = request.get_json()

    if not isinstance(post_data, Mapping):
        return {"error": "Invalid post data."}, 400

    msg = CreatePost(data=PostData(**post_data))

    messagebus: Messagebus = current_app.extensions["messagebus"]

    recap = messagebus.handle(msg)
    result = next(
        step.message for step in recap.queue if isinstance(step.message, PostCreated)
    )

    return {"data": result.post}, 201
