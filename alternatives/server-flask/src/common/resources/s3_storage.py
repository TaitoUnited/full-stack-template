import boto3
from botocore.config import Config


class S3Storage:

    def __init__(
        self,
        bucket_endpoint: str,
        bucket_region: str,
        bucket_bucket: str,
        # bucket_gcp_project_id: str,
        # bucket_browse_url: str,
        # bucket_download_url: str,
        bucket_key_id: str,
        bucket_key_secret: str,
        bucket_force_path_style: bool,
    ) -> None:
        self.bucket = bucket_bucket
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=bucket_key_id,
            aws_secret_access_key=bucket_key_secret,
            endpoint_url=bucket_endpoint,
            config=Config(
                region_name=bucket_region,
                s3={
                    "addressing_style": "path" if bucket_force_path_style else "auto",
                },
            ),
        )

    def create_presigned_url_put_object(
        self,
        path: str,
        content_type: str,
        content_disposition: str,
    ) -> str:
        """Generate a presigned URL S3 PUT request to upload a file."""
        return self.s3_client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": self.bucket,
                "Key": path,
                "ContentType": content_type,
                "ContentDisposition": content_disposition,
            },
            ExpiresIn=30*60,
            HttpMethod="PUT",
        )

    def create_presigned_url_get_object(self, path: str) -> str:
        """Generate a presigned URL S3 GET request."""
        return self.s3_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": self.bucket,
                "Key": path,
            },
            ExpiresIn=30*60,
            HttpMethod="GET",
        )
