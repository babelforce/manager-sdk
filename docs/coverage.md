---
title: Coverage & parity
sidebar_label: Coverage
sidebar_position: 98
---

# Coverage & parity

Every SDK is generated from the same OpenAPI specs. **Canonical scope: 397 operations** (plus 1 intentionally excluded, e.g. webhook receivers).

This matrix tracks which generated operations each language facade **wraps** (matched by operation name) — it does not verify behavioral equivalence across languages.

| Spec | Scope | TypeScript | Go | Rust |
| --- | --- | --- | --- | --- |
| auth | 3 | 3/3 (100%) | 3/3 (100%) | 3/3 (100%) |
| manager | 356 | 356/356 (100%) | 356/356 (100%) | 356/356 (100%) |
| task-automation | 30 | 30/30 (100%) | 30/30 (100%) | 30/30 (100%) |
| task-schedule | 4 | 4/4 (100%) | 4/4 (100%) | 4/4 (100%) |
| user | 4 | 4/4 (100%) | 4/4 (100%) | 4/4 (100%) |
| **Total** | **397** | **397/397 (100%)** | **397/397 (100%)** | **397/397 (100%)** |

> Every in-scope operation is wrapped in all three languages.
