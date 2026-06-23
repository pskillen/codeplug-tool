# Expandable channels (multi-mode) — progress

**Tracking:** [codeplug-tool#46](https://github.com/pskillen/codeplug-tool/issues/46)  
**Plan:** `.cursor/plans/multi-mode_channels_#46_fbabf0a2.plan.md`

---

## Overall status

**Status:** Complete (pending PR)

**Branch:** `36/paddy/multi-talkgroup-export`

---

## Multi-talkgroup (#36)

**Tracking:** [codeplug-tool#36](https://github.com/pskillen/codeplug-tool/issues/36)

**Status:** Complete (pending PR)

### Slice 1: Documentation

**Status:** Complete

### Slice 2: Expansion core

**Status:** Complete

### Slice 3: Adapter contract

**Status:** Complete

### Slice 4: Import collapse

**Status:** Complete

### Slice 5: Merge candidates apply

**Status:** Complete

---

## Multi-mode (#46) — complete

**Status:** Complete — PR opened

**Branch:** `46/pskillen/multi-mode-channels`

---

## Slice 1: Docs kickoff

**Status:** Complete

**Delivered**

- Progress and outstanding pair created
- Data-model README updated with `multiMode` / `modeProfiles`
- OpenGD77 tier-3 reference `multi-mode.md`
- DM32 test fixtures staged under `test-data/baofeng-dm32/`

---

## Slice 2: Model + migration + channelExpansion

**Status:** Complete

**Delivered**

- `ChannelModeProfile`, `multiMode`, `modeProfiles` on `Channel`
- `CODEPLUG_SCHEMA_VERSION = 9`
- `src/lib/channelExpansion/` resolver + unit tests

---

## Slice 3: Validation + mutations

**Status:** Complete

**Delivered**

- `validateChannel` multi-mode profile rules
- `normalizeChannelForSave` in `codeplugMutations.ts`

---

## Slice 4: OpenGD77 export

**Status:** Complete

**Delivered**

- Channel and zone serialisers expand multi-mode rows (`-F` / `-D` naming)
- `multiModeExport.test.ts`

---

## Slice 5: CRUD UI

**Status:** Complete

**Delivered**

- Multi-mode checkbox + `ChannelModeProfilesEditor` on channel edit
- List/detail mode pills

---

## Slice 6: Map

**Status:** Complete

**Delivered**

- Single marker with `FM+DMR` style labels

---

## Slice 7: Import merge

**Status:** Complete

**Delivered**

- `parseChannels` best-effort merge of paired Analogue/Digital rows
- Per-profile wire ref resolution and `-F`/`-D` zone name aliases for round-trip

---

## Slice 8: Final docs + PR

**Status:** Complete

**Delivered**

- CRUD README implementation status
- Progress closeout; outstanding lists deferred work (#67, #36)

---

## Verify

- `npm run format:check && npm run lint && npm run test && npm run build`
- Create multi-mode channel in UI; export OpenGD77 ZIP — two channel rows + expanded zone members
- Import paired `GB7GL-F` / `GB7GL-D` rows — collapses to one logical channel
- OpenGD77 file-level round-trip (`r2025.02.23.01`) passes with merged `-F`/`-D` pairs

---

## Next

- Open PR closing #36 and #123
- DM32 adapter (#67) consumes `expandAllChannelsForExport` with `expandRxGroupLists: true`
