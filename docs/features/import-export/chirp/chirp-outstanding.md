# CHIRP CSV import/export — outstanding

Items **skipped**, **incomplete**, or **discovered during execution** — not future plan phases.

**Tracking:** [codeplug-tool#103](https://github.com/pskillen/codeplug-tool/issues/103)

---

## Resolved in #103

- Adapter interface contracts in `src/lib/import-export/`
- Registry-based import/export routing
- CHIRP import + export shipped
- Cross-format OpenGD77 → CHIRP test
- File-level round-trip system tests (`test-data/chirp/`) with `wireColumns` provenance for verbatim export

## Open / deferred

- [ ] **`Comment` column** — preserved via `wireColumns` on import for round-trip; not a first-class `Channel` field ([#108](https://github.com/pskillen/codeplug-tool/issues/108) pattern for modelled fields)
- [ ] **CHIRP → OpenGD77 cross-format** — not in v1
- [ ] **OpenGD77 file-level round-trip** — [#108](https://github.com/pskillen/codeplug-tool/issues/108)
