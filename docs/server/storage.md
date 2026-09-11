# Object storage guidance

Access local and cloud object storage through the shared S3-compatible storage abstraction. Do not create a client per request or make domain behavior depend on a local storage implementation.

Keep endpoints, bucket names, regions, and credentials in central configuration and secrets. Validate object keys, content type, and size at the application boundary; scope keys to their owning domain and prevent path traversal or unintended overwrites. Use short-lived presigned URLs with the least required permission and never expose bucket credentials in logs or responses.

Changing a deployed bucket is an infrastructure operation. Prepare and validate its configuration locally, then give the remote Taito command to the user to run.
