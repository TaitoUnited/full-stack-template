# Configuration and secrets

Configuration is defined through `taito-config.sh`, `scripts/taito/project.sh`, and per-environment `scripts/taito/env-*.sh` files. Use `taito config:local` to inspect the resolved local value and its source.

## Application values

- Add a non-secret application value to the central server configuration module with explicit parsing and a documented default.
- Do not read `process.env` throughout domain or client code. Pass configuration through the established configuration boundary.
- When a value affects a container, update the applicable local Compose and deployment configuration paths together.
- Keep environment-dependent behavior explicit through the established environment indicators. Entry points, build configuration, and test harnesses are the narrow exceptions where direct environment access can be appropriate.

## Secrets

- Declare secrets in `scripts/taito/project.sh`, map them to the relevant runtime locations, and keep local values only under gitignored `secrets/local/`.
- Load secrets through the shared cached configuration path. Mark a secret mandatory when absence prevents correct startup; do not create a secret-manager client or reload secrets from domain modules.
- Never commit, print, log, return, or paste secret values, tokens, passwords, authorization headers, or key material.
- Use `taito secret rotate:local` only for explicitly local secret work. Remote rotation or deployment changes require an explicit user-run command and a clear target, impact, and recovery plan.

When adding a value, trace it end-to-end: declaration, local container mapping, deployment mapping, consumer configuration, and tests. Configuration that only works in one execution path is incomplete.

See [CLI configuration](../cli/configuration.md) for the complete declaration and wiring workflow.
