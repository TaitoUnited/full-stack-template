import flask


def connect(app: flask.Flask) -> None:
    """Connects sentry.
    """
    if app.config['PYTHON_ENV'] == 'development':
        app.logger.info('Skipping sentry init in development build.')
        return None

    sentry_dsn = app.config['APP_SENTRY_DSN']
    if not sentry_dsn or not sentry_dsn.startswith('https'):
        app.logger.warning(
            f'Skipping sentry init (DSN not set up): {sentry_dsn}'
        )
        return None

    # Sentry is not available in local env.
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration

    app.logger.debug('Connecting sentry.')
    sentry_sdk.init(
        dsn=sentry_dsn,
        integrations=[FlaskIntegration()]
    )
    app.logger.info('Sentry connected.')
