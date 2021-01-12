import dataclasses
import typing
from src.common.formatters import to_camel, to_snake
from src.types.post import DBPost, Post


PostDict = typing.Dict[str, typing.Any]


@typing.overload
def post_server_to_client(data: typing.List[DBPost]) -> typing.List[PostDict]:
    pass


@typing.overload
def post_server_to_client(data: DBPost) -> PostDict:
    pass


def post_server_to_client(data):
    """Converst DBPost to dict.
    """
    def convert(post: DBPost) -> PostDict:
        return to_camel(dataclasses.asdict(post))
    if type(data) is DBPost:
        return convert(data)
    return [convert(post) for post in data]


def post_client_to_server(data: PostDict) -> typing.Union[DBPost, Post]:
    """Converts post json from client to Post or DBPost.

    The result depends whether the posted data contains and id.
    """
    _data = to_snake(data)
    try:
        return DBPost(**_data)  # type: ignore
    except TypeError:
        # If the request is missing createdAt, id, updatedAt fields
        # then TypeError will be raised. So we can deduct that this is
        # new post.
        return Post(**_data)  # type: ignore
