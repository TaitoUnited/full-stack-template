import boto3
import flask
from botocore.client import Config


storage = None


def connect(app: flask.Flask) -> None:
    """Creates and connects S3-client.
    """
    app.logger.debug('Connecting to storage.')
    global storage
    session = boto3.session.Session()
    storage = session.client(
        's3',
        aws_secret_access_key=app.config['S3_KEY_SECRET'],
        aws_access_key_id=app.config['S3_KEY_ID'],
        config=Config(s3={
            'addressing_style': (
                'path'
                if app.config['S3_FORCE_PATH_STYLE']
                else 'auto'
            ),
            'signature_version': 's3v4',
        }),
        endpoint_url=app.config['S3_URL'],
        region_name=app.config['S3_REGION'],
    )
    app.logger.info('Storage connected.')
