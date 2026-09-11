# Domain model

The reusable template does not define product vocabulary. Each consuming
application should maintain its own canonical terms, ownership boundaries, and
material privacy or authorization constraints in this document.

## What to document

For every cross-layer concept that is more than a transient UI detail, record:

- its canonical singular and plural names;
- the owning domain and the entity or scope that controls access to it;
- its source of truth and any external-system relationship;
- material lifecycle, privacy, and authorization constraints; and
- terminology that must remain consistent in UI copy, GraphQL/REST contracts,
  services, persistence, and operations.

Keep database table names and schema definitions as the implementation source
of truth. This document explains the meaning and boundaries that an
implementation alone cannot make clear.

## Change discipline

Before adding or materially changing an entity, decide who owns it, what can
read or mutate it, and whether the change creates a new privacy or retention
obligation. Put business rules in services rather than transport handlers or
DAOs, and update this guide when the canonical language or boundary changes.

Do not put customer names, private operating procedures, credentials, or
provider-specific policy in the reusable template. Those belong in the
consuming application's own documentation and configuration.
