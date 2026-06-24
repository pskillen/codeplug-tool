# Export name shortening — progress

**Tracking:** [codeplug-tool#130](https://github.com/pskillen/codeplug-tool/issues/130) · stop-gap for [#122](https://github.com/pskillen/codeplug-tool/issues/122)
**Plan:** `.cursor/plans/shorten_export_channel_names_2db5231f.plan.md`
**Branch:** `130/paddy/shorten-export-names`

---

## Overall status

**Status:** Complete (all slices shipped on branch `130/paddy/shorten-export-names`)

---

## Slice 1 — Abbreviation dictionary

**Status:** Complete (committed)
**Commit:** `799dd78` — `feat(channel-expansion): add progressive abbreviation dictionary`

---

## Slice 2 — Core shortening helper

**Status:** Complete (committed)
**Commit:** `49a14db` — `feat: add pure channel-name shortening helper`

---

## Slice 3 — TalkGroup.abbreviation

**Status:** Complete (committed)
**Commits:** `b5d4c80`, `72c0b57`

---

## Slice 4 — Wire shortening into expansion path

**Status:** Complete (committed)
**Commit:** `feat: shorten expanded channel and zone names at export`

**Delivered**

- `ExpandChannelOptions`: `shortenNames`, `nameModeOverride`, `useTalkGroupAbbreviation`, `channelById`
- `composeChannelWireName` uses `nameModeOverride` at export; warn-only blocks replaced with `finalizeWireName`
- `entityRefExportLabel` for `TalkGroup.abbreviation` at export
- Tests in `index.test.ts`

---

## Slice 5 — Per-format wiring + ExportOptions

**Status:** Complete (committed)
**Commit:** `feat: apply name shortening across opengd77, dm32 and chirp exports`

**Delivered**

- `ExportOptions` extended; `expandOptionsFromExport` + `effectiveMaxNameLength`
- `nameLimit` on OpenGD77, DM32, CHIRP profiles
- OpenGD77 serialise + `listWire` + `warnings`; DM32 serialise; CHIRP `channelToChirpRow` with per-file reserved set
- Default `shortenNames` on via `expandOptionsFromExport`

---

## Slice 6 — Export-time controls + localStorage

**Status:** Complete (committed)
**Commit:** `feat: export-time name-shortening controls persisted to localStorage`

**Delivered**

- `useExportSettings` hook (`mm9pdy-codeplug-tool.export.*`)
- `ExportNameSettingsFields` in export panel and Settings
- Storage keys registered in `storageKeyRegistry.ts`

---

## Slice 7 — Re-import matching easy win

**Status:** Complete (committed)
**Commit:** `ef58680` — `feat: relaxed frequency/location channel matching on re-import`

**Delivered**

- `ChannelMergeCandidateOptions.ignoreNameMatch` on multi-mode / multi-TG merge candidates
- `channelsAreRelaxedImportMergeCandidates` for active-import channel identity
- `ImportMergeOptions.relaxedChannelMatch` on `applyImportToCodeplug` / `previewImportMerge`
- Follow-up: [#143](https://github.com/pskillen/codeplug-tool/issues/143) (score-based matcher)

---

## Slice 8 — Documentation

**Status:** Complete (committed)
**Commit:** `5347878` — `docs: document export name shortening and tg.abbreviation`

**Delivered**

- [name-shortening.md](name-shortening.md) — pipeline, controls, round-trip caveat
- Tier-3 wire notes in `docs/reference/opengd77|dm32|chirp/channels.md`
- Import-export README status → Shipped

**Follow-up:** score-based matcher [#143](https://github.com/pskillen/codeplug-tool/issues/143)

---

## #150 — Channel.abbreviation

**Tracking:** [codeplug-tool#150](https://github.com/pskillen/codeplug-tool/issues/150)
**Branch:** `150/paddy/channel-abbreviation`

### Overall status

**Status:** Complete

### Slice 1 — Model + schema v14

**Status:** Complete
**Commit:** `69c73b9` — `feat(model): add Channel.abbreviation`

### Slice 2 — Expansion export path

**Status:** Complete
**Commit:** `7a4f3c6` — `feat(export): apply Channel.abbreviation in channel expansion`

### Slice 3 — CHIRP path + shared helper

**Status:** Complete
**Commit:** `32cc8c3` — `feat(export): apply Channel.abbreviation in CHIRP serialise`

### Slice 4 — Export-time toggle

**Status:** Complete
**Commit:** `ff0c3db` — `feat(export): channel abbreviation export-time toggle`

### Slice 5 — CRUD UI

**Status:** Complete
**Commit:** `574f879` — `feat(ui): channel abbreviation CRUD and list column`

### Slice 6 — Documentation

**Status:** Complete (this slice)
