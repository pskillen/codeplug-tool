# Import

How CPS export files enter the app and become internal [codeplug models](../data-model/README.md).

**Tracking:** [codeplug-tool#7](https://github.com/pskillen/codeplug-tool/issues/7)

## Problem

Import was hard-wired to OpenGD77 CSV inside the channel map. This refactor introduces a format registry, OpenGD77 as the first adapter, and a central store that resolves vendor names to internal ids.

## Implementation status

| Area | Status | Notes |
| --- | --- | --- |
| Internal models | Shipped | [`src/models/codeplug.ts`](../../../src/models/codeplug.ts) |
| OpenGD77 adapter | Shipped | Channels.csv + Zones.csv |
| Format registry | Shipped | OpenGD77 only; room for more brands |
| Multi-file + directory import UI | Shipped | [`ImportPanel`](../../../src/components/ImportPanel/ImportPanel.tsx) |
| Name → id resolution | Shipped | Store reducer + [`src/lib/codeplug.ts`](../../../src/lib/codeplug.ts) |
| LocalStorage persistence | Deferred | [#9](https://github.com/pskillen/codeplug-tool/issues/9) — serialize helpers exist |

## Documentation map

| Doc | Contents |
| --- | --- |
| [data-model/README.md](../data-model/README.md) | Entity definitions (canonical) |
| [opengd77.md](opengd77.md) | OpenGD77 CSV columns, classification, skip/error behaviour |
| [genericise-import-progress.md](genericise-import-progress.md) | Execution log |
| [genericise-import-outstanding.md](genericise-import-outstanding.md) | Discovered debt |

## Architecture

```mermaid
flowchart TD
  UI["ImportPanel"] --> importFiles
  importFiles --> Adapter["opengd77 adapter"]
  Adapter --> Raw["channels? + ParsedZone[]?"]
  Raw --> Store["codeplugStore APPLY_IMPORT"]
  Store --> Resolve["resolveZoneMembers"]
  Resolve --> Codeplug["Codeplug"]
```

## Code anchors

| Symbol | File | Role |
| --- | --- | --- |
| `importFiles` | `src/lib/import/index.ts` | Read files, classify, parse |
| `collectFilesFromDataTransfer` | same | Folder drag-and-drop |
| `opengd77Adapter` | `src/lib/import/opengd77/adapter.ts` | `detectKind`, delegates to parse |
| `parseChannels` / `parseZones` | `src/lib/import/opengd77/parse.ts` | CSV → models / raw zones |
| `parseCsv` | `src/lib/csv.ts` | Generic CSV tokenizer |
| `CodeplugProvider` | `src/state/codeplugStore.tsx` | Central state + import merge |

## Import UI behaviour

- **Drop target:** accepts multiple `.csv` files or a whole folder (`webkitdirectory` + `webkitGetAsEntry` for folder drops).
- **Recognised:** `Channels.csv` and `Zones.csv` (by filename or header signature).
- **Skipped:** unknown CSVs (e.g. `Contacts.csv`) — listed, not errors.
- **Errors:** parse failures (missing required columns, empty file).
- **Clear all:** resets codeplug to `emptyCodeplug()`.
- Channels and zones can be imported together (directory) or sequentially.

## Persistence note

`serializeCodeplug` / `deserializeCodeplug` and `CODEPLUG_STORAGE_KEY` are exported from the store but **not wired** to LocalStorage yet ([#9](https://github.com/pskillen/codeplug-tool/issues/9)).

## Manual verify

1. `npm run dev` → `/#/map`
2. Import `Channels.csv` — markers appear.
3. Import `Zones.csv` — hulls appear.
4. Import a whole export folder — both recognised; other files skipped.
5. Navigate Home → Map — data persists (in-memory store above routes).
6. Clear all — map empties.

## Related

- [OpenGD77 adapter](opengd77.md)
- [Data model](../data-model/README.md)
- [Map hub](../map/README.md)
