# Codeplug Tool — feature reference & behaviour (developer)

Working draft for [#135](https://github.com/pskillen/codeplug-tool/issues/135). **Audience: developers and agents.** Authoritative description of *what each feature does and exactly how it behaves*, with particular attention to **where behaviour diverges by radio/format** and to the **export options** (poorly named in the UI, non-obvious order, non-obvious blast radius).

Grounded in code as of schema **v18**. File references included so this stays verifiable. Pairs with [`glossary-dev.md`](glossary-dev.md) and [`import-export-flow-diagrams.md`](import-export-flow-diagrams.md).

---

## 0. Feature inventory & status

From progress logs (prefer these over the root README/feature index, which lag — see staleness note below).

| Area | Status | Issues |
| --- | --- | --- |
| SPA shell, nav, component kit, DataTable, list prefs | Shipped | #18–21, #81, #105, #138, #146 |
| Data model (core, modes, multi-mode, naming) | Shipped | #7, #45, #46, #54 |
| Vendor-neutral model refactor (UUID FKs) | Mostly shipped (epic) | #93 |
| Codeplug projects (multi-project, start fresh, metadata) | Shipped | #9, #60/61, #102 |
| LocalStorage persistence | Shipped | #9 |
| Import/export foundation | Shipped | #7, #58, #84 |
| OpenGD77 I/O | Shipped | #38 |
| CHIRP I/O | Shipped | #103 |
| DM32 I/O | Shipped | #67, #157 |
| Native YAML I/O | Shipped | #10 |
| Export name shortening / abbreviations | Shipped | #130, #150, #153 |
| Profile-aware power/squelch | Shipped | #109 |
| Multi-mode + multi-TG expansion | Shipped | #36, #46 |
| Report (tables + detail + inset map) | Shipped | #6 |
| CRUD (all entities) + channel merge candidates | Shipped | #11–14, #116 |
| Map (inset) + operator distance | Shipped | #50, #70 |
| ukrepeater.net import/verify | Shipped | #92, #181 |
| BrandMeister network lookup | Shipped | #167 |
| Google Drive cloud sync | Shipped | #17 |
| Duplicate entity | Shipped | #179 |
| Zone from distance | Shipped | #180 |
| **TG timeslot expansion via RGL membership** | **Shipped** | **#142** |
| **Zone scratch channel + zone-derived scan lists** | **Shipped** | **#163, #164** |
| qDMR YAML; DM32 scan lists (#125); Dropbox/OneDrive; Playwright e2e | Planned/deferred | #37, #125, #15/16, #40 |

> **Doc staleness:** root `README.md` and `docs/features/README.md` mark CRUD, native YAML, repeater directories, and Google Drive as "in progress/planned" though their progress logs say complete. Trust the progress logs.

---

## 1. Project lifecycle

Four stages (`docs/features/workflows/operator-lifecycle.md`):

1. **Create or load** — start a blank project (`/codeplug/new`; not persisted until created), or import a CPS export, or import native YAML.
2. **Edit & persist** — CRUD + map + report; auto-saved to LocalStorage; nothing leaves the browser.
3. **Optional interchange** — native YAML download/upload; Google Drive open/save (Dropbox/OneDrive planned).
4. **Export to radios** — pick format + variant on Import & export, download CPS files, flash in the vendor CPS. One project can export to several formats.

**Storage:** versioned projects envelope in LocalStorage key `mm9pdy-codeplug-tool.codeplug`; separate keys for map settings and list prefs. Migrations run on load. Quota errors surface as a dismissible alert. Cloud is interchange only, not the edit store.

**Two import entry points (important):**
- **Home** import → creates a **new project**.
- **Import & export** import → **merges into the active project**.

---

## 2. The internal model is vendor-neutral; variance lives at the edges

The single most important architectural fact for help/feature docs: **the internal model has no radio/format assumptions.** All radio caps, wire names, column layouts, expansion strategies, and slot suffixes are applied **only** at the import/export boundary. CRUD and validation never enforce a radio cap.

So "how a feature behaves" almost always splits into:
- **Model behaviour** (one definition, vendor-neutral), and
- **Export/import behaviour** (diverges per format/variant).

The rest of this doc follows that split for the features where it matters.

---

## 3. Channels

**Model:** one `Channel` = one RF config. Single-mode or **multi-mode** (`multiMode` + `modeProfiles[]`). DMR refs are id FKs (`contactRef: EntityRef`, `rxGroupListId`). Frequencies are Hz. (Full field list: glossary §2.)

**CRUD:** create/edit/detail per channel; multi-mode editor with per-mode tabs; Maidenhead locator input → `GeoPoint`; "RX only" = `forbidTransmit`; add-from-ukrepeater flow.

**Channel merge candidates (#116):** post-import tool to merge channel groups that should be one logical (multi-mode or multi-TG) channel. Detection + preview + apply, rewiring zone/RGL references.

### Radio/format variance for channels
| Behaviour | OpenGD77 | DM32 | CHIRP |
| --- | --- | --- | --- |
| Multi-mode on the wire | **Split** into `-F`/`-D` rows (`expandModes: true`) | **Native** one row, dual-mode columns (`expandModes: false`) | Analogue only; digital dropped |
| Power | Profile power ladder (1701 default) | Profile power + squelch ladders | n/a |
| Duplex | RX/TX columns | RX/TX columns | `Duplex`+`Offset` ↔ frequencies |
| Name length cap | profile `nameLimit` 16 | 16 | profile slot/name limit |

---

## 4. Talk groups, contacts, RX group lists

**Model:** talk group = DMR group call (one per DMR ID); contact = private/DTMF; RX group list = ordered members (`RxGroupListMember{ ref, timeslot? }`). Shared `TalkGroup.name`/`Contact.name` namespace. (Glossary §3, §5.)

### RX group list behaviour diverges sharply by format — the key variance to document

| Aspect | OpenGD77 / 1701 | DM32 |
| --- | --- | --- |
| Radio capability | **Independent** repeater + TG selection; **true promiscuous RX** | Each digital channel = exactly one TG; **no** promiscuous RX, no independent selection |
| Native RGL file | `TG_Lists.csv` | `RXGroupLists.csv` |
| Channel→RGL on export | **Reference only** — channel keeps `rxGroupListId`; one channel row | **Fan-out** — one channel row **per RGL member** (`expandRxGroupLists: true`) |
| TX contact + RGL together | Both columns populated independently | Fan-out **skipped** (`skipExpandWhenTxContactSet`) — single row keeps RGL |
| Per-member timeslot | TG×TS expanded **contact names** in Contacts + TG_Lists (`Scotland T1/T2`) | Member timeslot applied to the expanded channel row |
| "ALL"-type list | none | `ALL` never fans out (`nonExpandableRxGroupListNames`) |
| Member cap | truncate to 32 columns **+ warning** | profile `rxGroupListMembers: 32` exists but **not enforced** on export |

**Mental models to teach:**
- **OpenGD77:** RGL is a *reference*. The radio receives many TGs on one channel. One channel stays one channel.
- **DM32:** there is no promiscuous RX, so the app *simulates* an RGL by **duplicating the channel**, once per member, each with a different TX contact. RGL membership becomes N channels.

This is why the same RX group list produces wildly different exports, and why some export options only appear/matter for one format.

---

## 5. Import — exact behaviour

Generic trunk; per-format branches at parse. Full diagram in [`import-export-flow-diagrams.md`](import-export-flow-diagrams.md). Code: `src/lib/import/index.ts`, `src/lib/importMerge.ts`.

**Pipeline:**
1. **Collect files** (`collectFilesFromDataTransfer`) — folder drops supported; prefers YAML over CSV when both present.
2. **Orchestrate** (`importFiles`) — operator must select the **format explicitly** (no auto-detect in UI); profile required for OpenGD77/CHIRP/DM32.
3. **Parse** — CSV parsed **by header name** (never column index). Native YAML uses `parseDocument`.
4. **Assemble** `ImportResult` (entities + recognised/skipped/errors). Some files are deliberately *skipped* (OpenGD77 DTMF/APRS; DM32 Scan/DMR-ID).
5. **Apply** (`applyImportToCodeplug`) — merge or overwrite.

**Merge vs overwrite (`importMerge.ts`):**
- **merge (default):** only entity types *present in the import* are touched. Match by vendor wire name (case-sensitive) / channel merge keys. Existing ids and app-only fields (e.g. `hideFromMap`) preserved. Idempotent: re-importing unchanged CPS is a no-op.
- **overwrite:** replace the whole array for each imported entity type.

**FK resolution (generic boundary):** parsers leave relationship fields `null` and stash wire names in `meta.imported`; the merge step resolves names → ids (`entityRefs.ts`): `contactWireName`→`contactRef`, `rxGroupListWireName`→`rxGroupListId`, zone/RGL member wire names → ids.

**Channel naming on import:** full wire name stored, then collapsed (multi-mode/multi-TG), then split into `callsign`/`name`/`exportNameMode` (`channelNaming.ts`).

### Import variance by format
| Format | Delivery | Entity kinds | Notable |
| --- | --- | --- | --- |
| OpenGD77 | multi-file | channels, zones, contacts, RGLs | filename+header detect; `Contacts.csv` splits group/private; multi-mode collapse in parse; TG-timeslot duplicate collapse on apply; skips DTMF/APRS; `opengd77Extras` |
| DM32 | multi-file | all six | header-only detect; native multi-mode rows; pipe-separated members; skips Scan/DMR-ID |
| CHIRP | single-file | channels only | 21-col fingerprint; duplex/offset→tx freq; merge touches channels only |
| Native YAML | single-file | all (document) | id-preserving on new project (bypasses merge); overwrite replaces codeplug wholesale |

> **Vendor-boundary smell (flagging per rule):** generic `importEntityCompare.ts` compares `opengd77Extras` — an OpenGD77-specific field used in generic merge equality. Don't copy this for new formats.

---

## 6. Export — exact behaviour and the options problem

This is the area the ticket flags as confusing. Full pipeline in [`import-export-flow-diagrams.md`](import-export-flow-diagrams.md). Code: `src/lib/import-export/` + `src/lib/export/<format>/` + `src/lib/channelExpansion/`.

### 6.1 Pipeline (order matters)
```
1. profileId        → resolve profile: nameLimit, power/squelch ladders, cardinality caps
2. ExportOptions    → merge UI settings (exportOptionsFromSettings)
3. expandOptionsFromExport → ExpandChannelOptions (DM32 overrides several here, hardcoded)
4. effectiveMaxNameLength(options, profile.nameLimit)
5. Per file:
   a. build format-specific TG wire-name map
   b. expandAllChannelsForExport / expandZoneMemberWireNames
        i.   compose wire name  (nameModeOverride, useChannelAbbreviation, per-channel exportNameMode)
        ii.  mode expansion     (expandModes)            → -F / -D rows
        iii. RGL fan-out        (expandRxGroupLists)     → one row per member (+ multi-TG name options)
        iv.  shorten/finalise   (shortenNames, maxNameLength) → abbreviate, dedupe, uniquify
   c. map row → vendor columns (channelWire)
   d. profile truncation + warnings (OpenGD77 only today)
6. collectWarnings (OpenGD77 only)
7. download (zip / single file) or cloud upload
```

### 6.2 Every export option — meaning, blast radius, order, applicability

Defined in `src/lib/import-export/types.ts` (`ExportOptions`); persisted in `useExportSettings.ts`; UI in `ExportNameSettingsFields` / `ExportFromActivePanel` / `Settings`.

| UI label | Code field | What it really does | Blast radius | When it applies | Formats (UI) |
| --- | --- | --- | --- | --- | --- |
| **Radio profile** | `profileId` | Selects radio variant: caps, ladders, default name limit | Power column, zone/RGL column counts, name-limit default, CHIRP slot cap | **First** | OpenGD77, DM32, CHIRP |
| **Shorten long channel names** | `shortenNames` | Master switch for the shortening pipeline | All channel wire names + zones + TG maps | After profile known; during expansion finalise | OpenGD77, DM32, CHIRP |
| **Target name length** | `maxNameLength` | Override profile `nameLimit` (empty = profile default) | Same as shorten | With shorten | OpenGD77, DM32, CHIRP |
| **Export name mode override** | `nameModeOverride` | Force a global `ChannelExportNameMode` (empty = per-channel) | Base wire-name composition for *all* channels; multi-TG names | **Before** shortening (compose) | OpenGD77, DM32, CHIRP |
| **Use talk group abbreviations** | `useTalkGroupAbbreviation` | Prefer `TalkGroup.abbreviation` in multi-TG member suffixes | DM32 RGL-fan-out row names | During fan-out naming | **DM32 only** (hidden elsewhere) |
| **Use channel abbreviations** | `useChannelAbbreviation` | Prefer `Channel.abbreviation` as the name qualifier | Base + multi-TG composed names | Compose step | OpenGD77, DM32, CHIRP |
| **Multi-talkgroup export name style** | `multiTalkGroupExportNameMode` | Template for RGL-fanned row names | DM32 expanded DMR rows only | Fan-out pass, before shorten | **DM32 only** |
| *(per-channel field)* **Export name mode** | `Channel.exportNameMode` | Per-channel base name composition | That channel | Compose, when override empty | all CPS |
| *(not in UI)* expand modes | `expandModes` | Split multi-mode → `-F`/`-D` | channel count, zone members | pass 1 | default true (OG); **false hardcoded (DM32)** |
| *(not in UI)* expand RGLs | `expandRxGroupLists` | Fan out DMR+RGL → one row/member | channel count, zones, TX contact column | pass 2 | default false (OG); **true hardcoded (DM32)** |
| *(not in UI)* members filter | `expandRxGroupListMembers` | `all` vs `talkGroupsOnly` | which members fan out | pass 2 | programmatic (default `all`) |
| *(not in UI)* skip when TX set | `skipExpandWhenTxContactSet` | Keep single row if TX contact + RGL both set | DM32 Scotland-style channels | pass 2 guard | hardcoded true (DM32) |
| *(not in UI)* non-expandable lists | `nonExpandableRxGroupListNames` | Named lists never fan out | channels referencing `ALL` | pass 2 guard | hardcoded `['ALL']` (DM32) |
| **Export scratch channels** | `exportScratchChannels` | Master gate for zone `exportScratchChannel` flags | DM32 scratch rows | zone export pass | **DM32 only** (`Dm32ZoneExportSettingsFields`) |
| **Export zone-derived scan lists** | `exportZoneDerivedScanLists` | Master gate for zone `exportScanList` flags | DM32 `Scan.csv`, carrier, FKs | zone export pass | **DM32 only** |

### 6.3 Why the options confuse people (call these out in help/UX)
1. **"Shorten long channel names" gates the other name controls in the UI** (mode override, abbrev toggles, multi-TG style are `disabled` when off) — yet `nameModeOverride` conceptually affects composition regardless; the UI just prevents changing it while shortening is off.
2. **"Export name mode override" (global, export-only) vs per-channel "Export name mode"** are easy to confuse. Different scopes.
3. **Multi-TG / TG-abbreviation options only apply to DM32** because only DM32 sets `expandRxGroupLists: true`. They're correctly hidden for OpenGD77/CHIRP, but their *labels* sound generic.
4. **"Target name length" hint says "profile default"** but each format/variant differs — the **profile must be picked first** for the hint to be meaningful.
5. **The biggest behavioural difference (expand modes / expand RGLs) has no UI at all** — it's hardcoded per format. So the same "Export" button does structurally different things depending on the chosen format, invisibly.
6. **Order of application is not obvious:** profile → compose (name mode/abbrev) → mode expansion → RGL fan-out → shorten/uniquify. Shortening happens **last**, after expansion has multiplied the rows, so name budgets must account for `-F`/`-D` and TG suffixes.

### 6.4 Channel expansion (the engine behind the above)
`src/lib/channelExpansion/` turns logical channels into wire rows in two passes per channel:
- **Pass 1 — mode expansion** (`expandChannelForExport`): single row, or one row per mode profile with `-F`/`-D` suffixes (OpenGD77), or one row keeping the name (DM32, `expandModes:false`).
- **Pass 2 — RGL fan-out** (`expandTalkGroupsForExport`): for DMR rows with an RGL, emit one row per member (`contactRef = member`, `rxGroupListId = null`, timeslot from member/contact). Skipped for non-expandable lists or when TX contact already set.
- **Name finalisation** (`shortenName.ts`): TG-suffix swap → dictionary abbreviation → vowel-squeeze → name-mode downgrade → hard truncate → uniquify (` 2`, ` 3`). Runs against the global `reservedWireNames` set so names stay unique across the whole export.
- **OpenGD77 TG×timeslot** (`talkGroupTimeslotExpansion.ts`): *not* channel fan-out — builds slot-suffixed **contact names** (`Scotland T1/T2`) for `Contacts.csv`/`TG_Lists.csv` when a TG is used on different slots.
- **Zone expansion** mirrors the same two passes per member, enforcing the OpenGD77 zone cap (80) with warnings.

### 6.5 Export variance by format (summary)
| | OpenGD77 | DM32 | CHIRP | Native YAML |
| --- | --- | --- | --- | --- |
| Delivery | multi-file zip | multi-file zip | single CSV | single YAML |
| expandModes | true | false | n/a (analogue) | n/a (lossless) |
| expandRxGroupLists | false | true | n/a | n/a |
| RGL on wire | `TG_Lists.csv` reference | channel fan-out | n/a | as-is |
| Warnings | yes (caps) | **none today** | slot truncation | none |
| Lossy notes | DTMF/APRS header-only; `opengd77Extras` replayed | `defaultDmrIdLabel` + many hardcoded columns; member cap not enforced | digital dropped | none (source of truth) |

---

## 7. Map, report, reference, settings (briefly)

- **Report:** tabular views of channels/zones/talk groups/contacts/RGLs with detail pages; inset map on Summary/Channels/Zones. `/map` redirects to `/channels`.
- **Map:** plots channels with valid coords; zone **convex hulls** (grouping, not coverage); FM/DMR marker colours; co-located merge; respects `useLocation`/`hideFromMap`; operator "You" marker (operator-distance). Tiles/Mapbox token/Maidenhead grid configured in Settings (token stays in LocalStorage).
- **Reference:** band plan, Maidenhead converter — global, no project required.
- **Settings:** map tiles, Mapbox token, export name settings, Google Drive.

---

## 8. Shipped zone/TG export features (#142, #163, #164)

### #142 — Talk group timeslot expansion via RGL membership (shipped)
- **Model:** per-member timeslot on `RxGroupListMember.timeslot`; one logical talk group (no slot on the entity).
- **Export (OpenGD77):** slot-suffixed wire contacts (`Scotland T1`/`T2`); RGL members resolve to matching slot variant in `TG_Lists.csv`.
- **Import:** best-effort collapse of TS-suffixed duplicates; **Find merge candidates** on Talk Groups list for manual repair.

### #163 + #164 — Zone scratch channel and zone-derived scan (shipped via #178)

Scratch moved from per-RGL to **per-zone** (`Zone.exportScratchChannel`). Scan is **per-zone** (`Zone.exportScanList`, `members[].includeInScanList`, `scanCarrierFrequencyHz`).

**Two-level gating (DM32):** both the **per-zone flag** and the **export master toggle** must be on:
- `exportScratchChannels` (in `useExportSettings`) gates `zone.exportScratchChannel`
- `exportZoneDerivedScanLists` gates `zone.exportScanList`

OpenGD77 ignores zone export flags (zone = scan list natively). CHIRP excluded from zone-derived export UI.

> Help copy: describe the *model* (one zone, one talk group) then explain export reshapes per radio.
