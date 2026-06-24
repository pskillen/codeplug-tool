# Export name shortening

Automatic abbreviation of channel wire names (and matching zone / TG-list member references) at export so they fit radio LCD limits. Stop-gap for [#130](https://github.com/pskillen/codeplug-tool/issues/130); long-term per-profile overrides remain [#122](https://github.com/pskillen/codeplug-tool/issues/122).

**Progress:** [name-shortening-progress.md](name-shortening-progress.md) · **Code:** `src/lib/channelExpansion/shortenName.ts`, `src/lib/channelExpansion/abbreviations.ts`, `src/hooks/useExportSettings.ts`

## Problem

Logical channels expand at export — multi-mode (`-F`/`-D`) and multi-talkgroup (`{talkgroup}` suffix) — producing names like `GB7AC Largs Scot West TS1` (25+ chars). Many radios have ~7–16 character LCD limits. Zone members and TG-list members must match channel names byte-for-byte, so shortening applies identically everywhere a channel wire name is emitted.

## Pipeline

Shortening runs only when a composed name exceeds the effective `maxNameLength`. Strategies apply in order; the first result that fits is kept:

1. **Talk-group abbreviation** — if the channel row ends with a multi-TG member suffix and `TalkGroup.abbreviation` is set, substitute that label first.
2. **Progressive dictionary** — word/phrase replacements from `data/dictionaries/abbreviations.yaml` (e.g. `Scotland` → `Scot` → `Sco`). Regenerate via `npm run generate:abbreviations`.
3. **Vowel-squeeze** — remove lowercase vowels from the longest remaining words (callsigns, timeslot tokens, and `-F`/`-D` suffixes are protected).
4. **Export-name-mode downgrade** — for `callsign_name` only, recompose once as `callsign_suffix` for this export row (e.g. `GB7GL Glasgow` → `GL Glasgow`). Never auto-applies `callsign_only` or `name_only`.
5. **Hard truncate** — last resort; a warning is recorded if still over budget after disambiguation suffix room is reserved.

Collision safety: `finalizeWireName` reserves uniqueness (`GB7GL`, `GB7GL 2`, …) before emitting.

`exportNameMode` on each channel is honoured unless the operator sets a **global export-time override** (the only way to force `callsign_only` / `name_only` across all channels).

## Export-time controls

Persisted in browser `localStorage` (`mm9pdy-codeplug-tool.export.*`):

| Setting | Effect |
| --- | --- |
| Shorten names | Master on/off (default **on**; no-op when names already fit) |
| Max name length | Override profile default; empty = use profile `nameLimit` |
| Export name mode | Respect per-channel, or force a global mode |
| Use talk-group abbreviations | Apply `TalkGroup.abbreviation` at export |

Surfaced on **Import & export** (download panel) and **Settings**. Values merge into `ExportOptions` at download time.

## Per-format name limits

`nameLimit` lives on each export radio profile (`src/lib/<format>/profiles.ts`). Effective length = `ExportOptions.maxNameLength ?? profile.nameLimit`.

| Format | Default `nameLimit` | Reference |
| --- | --- | --- |
| OpenGD77 | 16 | [opengd77/channels.md](../../reference/opengd77/channels.md) |
| DM32 | 16 | [dm32/channels.md](../../reference/dm32/channels.md) |
| CHIRP | 7–16 (profile-specific) | [chirp/channels.md](../../reference/chirp/channels.md) |

OpenGD77 also documents ~16 chars on the [Baofeng 1701 profile](../../reference/opengd77/radios/baofeng-1701.md).

## TalkGroup.abbreviation

Optional vendor-neutral field on `TalkGroup` (schema v13). Edited in talk-group CRUD; used **only at export** when “Use talk-group abbreviations” is enabled. Does not affect internal FKs or import identity.

## Re-import and round-trip

Shortened or truncated wire names break strict name-key merge (`channelImportMergeKeys` / `incomingChannelMergeKey`). Re-import may add duplicate channels instead of updating existing ones.

**Mitigation (shipped):** pass `relaxedChannelMatch: true` to `applyImportToCodeplug` / `previewImportMerge` to fall back to frequency + location (+ DMR colour code / timeslot) when wire-name keys miss. Multi-mode and multi-talkgroup collapse honour `ignoreNameMatch` under the same flag. Conservative: only unambiguous single RF-context matches merge.

**Follow-up:** weighted score-based matcher — [#143](https://github.com/pskillen/codeplug-tool/issues/143).

## Related

- [channel-name-parsing.md](channel-name-parsing.md) — `callsign` / `name` split and `exportNameMode`
- [channelExpansion](../../../src/lib/channelExpansion/) — expansion + shortening at export boundary
- [#122](https://github.com/pskillen/codeplug-tool/issues/122) — export profiles / per-channel “Generate short name” (long-term owner)
