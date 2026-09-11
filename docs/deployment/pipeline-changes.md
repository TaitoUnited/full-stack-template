# Pipeline changes

Change pipeline definitions only when the requested behavior cannot be achieved through ordinary application, Helm, or Terraform configuration.

- Identify the affected target environment and whether the change alters build, migration, deployment, test, verification, or release behavior.
- Preserve the existing order of database deployment before application verification.
- Make any new credential, secret, cache, or artifact dependency explicit and keep it out of logs.
- Update the corresponding lockfile whenever a dependency change affects a CI-built package. Ensure source verification invokes the same `npm run verify` workflow used locally.
- Validate syntax, package checks, and the relevant local image/configuration path. Give users the remote trigger or deployment command rather than running a mutating remote operation.
