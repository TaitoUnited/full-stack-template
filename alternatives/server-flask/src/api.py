from flask import Flask
from .infra import infra_router
from .core.routers import post_router


def register_rest_routes(app: Flask):
    app.register_blueprint(infra_router.bp)
    app.register_blueprint(post_router.bp)


def register_graphql_resolvers(app: Flask):
    # TODO: Add GraphQL support
    return
