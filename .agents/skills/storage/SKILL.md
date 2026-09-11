---
name: storage
description: Implement object-storage flows with authorization, validation, and lifecycle-aware cleanup.
---

# Object storage

Read [server storage](../../../docs/server/storage.md) and [configuration and secrets](../../../docs/configuration/secrets.md).

- Authorize access before issuing object operations or signed URLs.
- Validate file metadata and size before accepting uploads; use opaque storage keys rather than user-provided paths.
- Define cleanup and replacement behavior so unused objects do not accumulate indefinitely.

