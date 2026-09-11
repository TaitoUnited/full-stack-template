# Environments

Branches map to deployment environments: `dev` deploys development; fast-forward environment branches deploy their matching environments; pull requests use isolated `pr-N` application environments while reusing designated development resources as configured by Taito.

`taito_target_env` is the requested environment and `taito_env` is the resource environment it maps to. Inspect resolved values with `taito config:local` or the corresponding explicit target before changing environment-dependent behavior.

Pull-request environments can have their own application release, hostname, and database while deliberately sharing selected development resources. Treat that distinction as part of the change: a target-specific setting does not automatically imply target-specific credentials, buckets, or other persistent resources.

Build/test enablement can depend on the mapped resource environment. Before changing branch rules or an environment override, verify the accepted target names, image-tag behavior, migrations, and test expectations remain aligned across the pipeline.

Treat canary and production-like environments as operationally sensitive. Review migrations, secrets, public URLs, and resource mappings before asking a user to run a remote command.
