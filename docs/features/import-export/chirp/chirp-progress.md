# CHIRP CSV import/export — progress

**Tracking:** [codeplug-tool#103](https://github.com/pskillen/codeplug-tool/issues/103)  
**Plan:** `.cursor/plans/chirp_import_export_1e4d1ea0.plan.md`

---

## Overall status

**Status:** In progress

**Branch:** `103/paddy/chirp-import-export`

---

## Slice 0: Workflow docs + scaffold

**Status:** Done

---

## Slice 1: CHIRP wire reference + feature hub

**Status:** Done

---

## Slice 2: Adapter interface contracts

**Status:** Done

---

## Slice 3: CHIRP import adapter

**Status:** Done

---

## Slice 4: Multi-format import plumbing

**Status:** Done

**Delivered**

- `importFiles()` routes via `getImportAdapter` / `detectImportAdapter`
- `importMerge` stamps `formatId` from import result
- CHIRP `importStatus: shipped` in `vendorFormats`
- Import UI uses adapter registry; CHIRP merge test

---

## Next

- Slice 5: CHIRP export adapter
- Slice 6: Delivery-aware export UI
- Slice 7: Doc reconciliation + PR
