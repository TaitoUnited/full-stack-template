---
name: client-feature-flags
description: Use for adding, changing, reviewing, or retiring client feature flags and their rollout lifecycle. Do not use for general environment configuration or server-side authorization.
---

# Client feature flags

Read [client feature flags](../../../docs/client/feature-flags.md).

- Define the flag and its intended environments in `client/src/services/feature-flags.ts`.
- Confirm the flag's owner, intended audience, enabled/disabled behavior, rollout condition, and removal condition before adding it.
- Use `FeatureGate` for conditional UI and `isFeatureEnabled` where behavior must branch.
- Keep a safe, coherent disabled path and avoid scattering raw flag/environment checks through presentation code. Remove temporary flags when their rollout is complete.
