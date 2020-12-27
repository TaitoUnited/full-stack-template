# import boto3
# import flask
# from botocore.client import Config


# storage = None


# def connect(app: flask.Flask) -> None:
#     """Creates and connects S3-client.
#     """
#     app.logger.debug('Connecting to storage.')
#     global storage
#     session = boto3.session.Session()
#     storage = session.client(
#         's3',
#         aws_secret_access_key=app.config['BUCKET_KEY_SECRET'],
#         aws_access_key_id=app.config['BUCKET_KEY_ID'],
#         config=Config(s3={
#             'addressing_style': (
#                 'path'
#                 if app.config['BUCKET_FORCE_PATH_STYLE']
#                 else 'auto'
#             ),
#             'signature_version': 's3v4',
#         }),
#         endpoint_url=app.config['BUCKET_URL'],
#         region_name=app.config['BUCKET_REGION'],
#     )
#     app.logger.info('Storage connected.')
