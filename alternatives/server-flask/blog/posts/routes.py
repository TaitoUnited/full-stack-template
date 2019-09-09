import typing
from flask import Blueprint, request
from . import service, transforms


bp = Blueprint('posts', __name__, url_prefix='/posts')


@bp.route('')
def get_all_posts() -> typing.Any:
    """Get all posts.
    """
    posts = service.get_all_posts()
    return {'data': transforms.post_server_to_client(posts)}


@bp.route('', methods=('POST',))
def create_post() -> typing.Any:
    """Save new post to database.
    """
    request_data = request.get_json()
    post_data = transforms.post_client_to_server(request_data['data'])
    post = service.create_post(post_data)
    return {'data': transforms.post_server_to_client(post)}, 201
