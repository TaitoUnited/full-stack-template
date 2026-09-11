# Configuration and secrets

Configuration is defined through `taito-config.sh`, `scripts/taito/project.sh`, and per-environment `scripts/taito/env-*.sh` files. Use `taito config:local` to inspect the resolved local value and its source.

## Application values

- Add a non-secret application value to the central server configuration module with explicit parsing and a documented default.
- Do not read `process.env` throughout domain or client code. Pass configuration through the established configuration boundary.
- When a value affects a container, update the applicable local Compose and deployment configuration paths together.

## Secrets

- Declare secrets in `scripts/taito/project.sh`, map them to the relevant runtime locations, and keep local values only under gitignored `secrets/local/`.
- Never commit, print, log, return, or paste secret values, tokens, passwords, authorization headers, or key material.
- Use `taito secret rotate:local` only for explicitly local secret work. Remote rotation or deployment changes require an explicit user-run command and a clear target, impact, and recovery plan.

See [CLI configuration](../cli/configuration.md) for the complete declaration and wiring workflow.
