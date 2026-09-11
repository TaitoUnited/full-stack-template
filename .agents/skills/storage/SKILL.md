---
name: storage
description: Use for S3-compatible clients, buckets, object keys, uploads, presigned URLs, or storage configuration. Do not use for non-storage providers or OAuth integrations; use integrations instead.
---

# Object storage

Read [server storage](../../../docs/server/storage.md) and [configuration and secrets](../../../docs/configuration/secrets.md).

- Authorize access before issuing object operations or signed URLs.
- Validate file metadata and size before accepting uploads; use opaque storage keys rather than user-provided paths.
- Obtain clients through the shared registry, retain central configuration for endpoints/buckets/credentials, and keep server-side operations separate from client-facing URL signing.
- Use least-privilege presigned URLs with short expiries, and keep local-storage implementation details out of domain code.
- Define cleanup and replacement behavior so unused objects do not accumulate indefinitely.
