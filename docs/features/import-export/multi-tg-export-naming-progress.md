# Multi-TG export wire naming — progress

**Tracking:** [codeplug-tool#153](https://github.com/pskillen/codeplug-tool/issues/153) · follow-up to [#36](https://github.com/pskillen/codeplug-tool/issues/36) (regression from [#130](https://github.com/pskillen/codeplug-tool/issues/130) shortening)
**Plan:** `.cursor/plans/multi-tg_export_naming_a1f2e9f1.plan.md`
**Branch:** `multi-tg-export-naming`

---

## Overall status

**Status:** Complete

---

## Slice 1 — TG export name modes + composer

**Status:** Complete
**Commit:** `feat(channel-expansion): add multi-TG export name composition modes`

**Delivered**

- `MultiTalkGroupExportNameMode` + `composeMultiTalkGroupWireName` in `multiTalkGroupWireName.ts`
- Unit tests (`multiTalkGroupWireName.test.ts`)
- Type re-export from `import-export/types.ts`

---

## Slice 2 — Wire into expansion + protect TG identity

**Status:** Complete
**Commit:** `fix(export): preserve TG identity in multi-TG expanded wire names`

**Delivered**

- `expandTalkGroupsForExport` uses composer (default `callsign_tg_abbrev`); `append` legacy path unchanged
- `fixedSuffix` in `shortenWireName` protects trailing TG tokens
- GB7GL Glasgow × 4 TGs regression test; zone fan-out name parity

---

## Slice 3 — Export options + settings UI

**Status:** Complete
**Commit:** `feat(export): multi-TG export name mode setting`

**Delivered**

- `ExportOptions.multiTalkGroupExportNameMode`; `expandOptionsFromExport` + DM32 passthrough
- `useExportSettings` localStorage key; `ExportNameSettingsFields` Select
- `storageKeyRegistry` entry

---

## Slice 4 — Documentation

**Status:** Complete (this slice)

**Delivered**

- [multi-talkgroup-expansion.md](../../reference/multi-talkgroup-expansion.md) — wire name mode table
- [name-shortening.md](name-shortening.md) — TG-first composition + `append` caveat
- This progress log
