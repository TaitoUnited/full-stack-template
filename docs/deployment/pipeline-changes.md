# Pipeline changes

Change pipeline definitions only when the requested behavior cannot be achieved through ordinary application, Helm, or Terraform configuration.

- Identify the affected target environment and whether the change alters build, migration, deployment, test, verification, or release behavior.
- Preserve the existing order of database deployment before application verification.
- Make any new credential, secret, cache, or artifact dependency explicit and keep it out of logs.
- Update the corresponding lockfile whenever a dependency change affects a CI-built package. Ensure source verification invokes the same `npm run verify` workflow used locally.
- Use the root `npm run verify` command for a complete source check, and `npm run verify:guidance` after changing documentation, agent instructions, or skill links.
- For Cloud Build pull-request deployments, pass `_PR_NUMBER` and let the pipeline derive `pr-<number>`; do not derive an environment name from an arbitrary PR branch. Configure PR close cleanup through `cloudbuild-pr-cleanup.yaml`, not through a regular push trigger; follow [PR environment cleanup](pr-environment-cleanup.md) for the required external trigger and webhook.
- Keep one deployment owner for a PR environment. Before adding a new GitHub Actions E2E or deployment workflow, retire or narrow any existing workflow that deploys the same environment.
- Validate syntax, package checks, and the relevant local image/configuration path. Give users the remote trigger or deployment command rather than running a mutating remote operation.
