---
name: client-feature-flags
description: Add or change client feature flags while retaining predictable environment and session behavior.
---

# Client feature flags

Read [client feature flags](../../../docs/client/feature-flags.md).

- Define the flag and its intended environments in `client/src/services/feature-flags.ts`.
- Use `FeatureGate` for conditional UI and `isFeatureEnabled` where behavior must branch.
- Keep a safe default path and remove temporary flags when their rollout is complete.

