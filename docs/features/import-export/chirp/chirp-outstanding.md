# CHIRP CSV import/export — outstanding

Items **skipped**, **incomplete**, or **discovered during execution** — not future plan phases.

**Tracking:** [codeplug-tool#103](https://github.com/pskillen/codeplug-tool/issues/103)

---

## Resolved in #103

- Adapter interface contracts in `src/lib/import-export/`
- Registry-based import/export routing
- CHIRP import + export shipped
- Cross-format OpenGD77 → CHIRP test

## Open / deferred

- [ ] **`Comment` column** — not on internal `Channel` model; lossy on CHIRP import (documented in reference)
- [ ] **CHIRP → OpenGD77 cross-format** — not in v1; analogue channels could export but zones/contacts would be empty
- [ ] **DCS tone round-trip** — export uses CTCSS-oriented defaults for DCS wire columns
- [ ] **Real fixture round-trip** against `sample-exports/Chirp 2026-06-29/` files (manual verify; committed bundles cover CI)
