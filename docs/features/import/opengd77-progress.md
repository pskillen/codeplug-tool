# OpenGD77 complete import/export — progress

**Tracking:** [codeplug-tool#38](https://github.com/pskillen/codeplug-tool/issues/38)
**Plan:** OpenGD77 complete CPS CSV import/export (#38)
**Source:** `src/models/`, `src/lib/import/opengd77/`, `src/lib/export/`, `src/routes/Export.tsx`

---

## Overall status

**Status:** In progress

**Branch:** `38/paddy/opengd77-full-import-export` (from `origin/main`)

### Scope decisions (agreed at kickoff)

- **Channel extras:** hybrid — typed primary fields + `voxEnabled`, `transmitTimeout`, `scanSkip` + `vendorExtras` bag for remaining OpenGD77-only flags.
- **Contacts:** `ID Type=Group` → `TalkGroup`; `ID Type=Private` → `Contact`. Channel→contact/RX group list stay name-based.
- **RxGroupList:** renamed from `TgList`; `TG_Lists.csv` members are vendor names (talk groups and/or contacts).
- **DTMF / APRS:** not imported; header-only in ZIP export only.
- **Export:** per-file buttons for Channels/Zones/Contacts/TG_Lists + Download-all ZIP (`fflate`).
- **Schema:** `CODEPLUG_SCHEMA_VERSION` 1→2 with v1 migration.

---

## Slices

### 0. Docs scaffold

**Status:** In progress

---

## Next

- Models + schema v2 migration.
