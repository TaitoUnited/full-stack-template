"""WSGI entrypoint."""
from src.bootstrap import create_messagebus
from src.config import get_config
from src.flask_api import create_flask_app
from src.graphql_api import connect_graphql
from src.logs import setup_logging
from src.sentry import connect_sentry


config = get_config()
setup_logging(config)
connect_sentry(config)

# Summon the app
messagebus = create_messagebus(config)

# Let the HTTP and GQL come
application = create_flask_app(messagebus)  # application is the name uWSGI excepts by default
connect_graphql(messagebus=messagebus, flask_app=application)
