# Expandable channels (multi-mode) — progress

**Tracking:** [codeplug-tool#46](https://github.com/pskillen/codeplug-tool/issues/46)  
**Plan:** `.cursor/plans/multi-mode_channels_#46_fbabf0a2.plan.md`

---

## Overall status

**Status:** In progress

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

## Next

- Slice 3: Validation + mutations
