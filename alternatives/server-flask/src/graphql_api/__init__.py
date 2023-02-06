from flask import Flask
from strawberry import Schema
from strawberry.extensions import Extension
from strawberry.flask.views import GraphQLView

from src.messagebus import Messagebus
from src.graphql_api.mutation import Mutation
from src.graphql_api.query import Query


class MessagebusInjector(Extension):
    """Inject the core app to the execution context."""

    def __init__(self, messagebus: Messagebus) -> None:
        self.messagebus = messagebus

    def on_request_start(self):
        if self.execution_context.context is None:
            self.execution_context.context = {}
        self.execution_context.context["messagebus"] = self.messagebus


def connect_graphql(messagebus: Messagebus, flask_app: Flask) -> Schema:
    """Instantiate graphql schema.

    TODO: output the generated schema in local env to the /shared-folder.
    """
    schema = Schema(
        query=Query,
        mutation=Mutation,
        extensions=[MessagebusInjector(messagebus)],
    )

    flask_app.add_url_rule(
        "/",
        view_func=GraphQLView.as_view("graphql_view", schema=schema),
    )

    return schema
