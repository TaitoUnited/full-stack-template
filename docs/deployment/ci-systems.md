# CI systems

The CI configuration runs the Taito pipeline in a fixed order: build preparation, artifact preparation, database deployment, application deployment, wait, tests, verification, release tagging, and build release.

When changing CI, preserve the distinction between artifact promotion and deployment verification. Keep secrets in the CI secret store, do not expose them in logs, and verify the exact branch/environment path affected by the change. Run the locally available package checks before handing off a pipeline change.
