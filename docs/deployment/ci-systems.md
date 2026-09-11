# CI systems

The CI configuration runs the Taito pipeline in a fixed order: build preparation, artifact preparation, database deployment, application deployment, wait, tests, verification, release tagging, and build release.

Source verification and deployment serve different purposes. Source jobs should run the affected package's `npm run verify` command; deployment jobs own artifact creation, remote migrations, rollout, and remote service tests. Keep their readiness handoff explicit so an E2E job cannot test an unrelated revision or an incompletely deployed environment.

When changing CI, preserve the distinction between artifact promotion and deployment verification. Keep secrets in the CI secret store, do not expose them in logs, and verify the exact branch/environment path affected by the change. Ensure `package.json` and its lockfile stay aligned, and run locally available package checks before handing off a pipeline change.
