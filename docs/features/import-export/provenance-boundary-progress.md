# Provenance boundary fix — progress

**Tracking:** [#142](https://github.com/pskillen/codeplug-tool/issues/142) follow-up  
**Branch:** `142/pskillen/provenance-boundary-fix`  
**Status:** In progress

## Goal

`meta.imported` wire strings are merge/delta metadata for re-import — not a shadow model. After import or one-time legacy migration, persisted model FK fields are authoritative on reload and export.

## Shipped

| Slice | Status | Notes |
| --- | --- | --- |
| 0 Kickoff | In progress | Branch created; progress/outstanding logs |
| 1 Docs | Pending | |
| 2 migrateCodeplug gate | Pending | Partial RGL fix in `f30d7b2` on parent branch |
| 3 Tests | Pending | |
| 4 Export stash | Pending | |
| 5 UI counts | Pending | |
| 6 CRUD provenance sync | Pending | Optional |

## Next

Slice 0 commit → Slice 1 docs.
