# OpenGD77 CSV import

Deep dive for the first CPS adapter. Entity shapes live in the [data model](../data-model/README.md).

## Classification

`detectKind(fileName, headerRow)` in [`src/lib/import/opengd77/adapter.ts`](../../../src/lib/import/opengd77/adapter.ts):

| Signal | Result |
| --- | --- |
| Filename contains `channel` (case-insensitive) | `channels` |
| Filename contains `zone` | `zones` |
| Headers include `Channel Name` + `Latitude` | `channels` |
| Headers include `Zone Name` | `zones` |
| Otherwise | `unknown` → skipped |

Typical export filenames: `Channels.csv`, `Zones.csv`.

## Channels.csv

Parsed by `parseChannels` in [`src/lib/import/opengd77/parse.ts`](../../../src/lib/import/opengd77/parse.ts). Columns matched by **header name**, not index.

### Required columns

| Header | Maps to |
| --- | --- |
| `Channel Name` | `Channel.name` |
| `Latitude` | `location.lat` |
| `Longitude` | `location.lon` |

### Optional columns

| Header | Maps to |
| --- | --- |
| `Channel Number` | `number` |
| `Channel Type` | `mode` (`Digital`→`digital`, `Analogue`/`Analog`→`analogue`, else `other`) |
| `Rx Frequency` | `rxFrequency` |
| `Tx Frequency` | `txFrequency` |
| `Contact` | `contactName` |
| `TG List` | `rxGroupListName` |
| `Use Location` | `useLocation` (`Yes` case-insensitive → `true`) |

Each channel receives a new internal `id` via `newId()`. Invalid coordinates → `location: null`. Empty rows and rows without a channel name are skipped. UTF-8 BOM is stripped.

## Zones.csv

Parsed by `parseZones` → `ParsedZone { name, memberNames }`. Member names are **not** resolved to ids here.

### Required

| Header | Maps to |
| --- | --- |
| `Zone Name` | `name` |

### Member columns

Headers matching `/^Channel\d+$/i` (`Channel1`…`Channel80`) supply `memberNames` in column order. Empty cells skipped. Member name case is preserved.

## Name → id resolution

After parse, the store reducer:

1. Builds `name → channelId` map (case-sensitive, first-wins).
2. Sets each zone's `sourceMemberNames` from `memberNames`.
3. Computes `memberChannelIds` via `resolveZoneMembers`.

Unmatched names surface in the map UI as "not in Channels.csv".

## Skip vs error

| Outcome | When |
| --- | --- |
| **Skipped** | File kind `unknown` (e.g. `Contacts.csv`, `TG_Lists.csv`) |
| **Error** | Recognised file fails parse (missing column, empty CSV) |
| **Recognised** | Successfully parsed channels or zones file |

## Related

- [Import hub](README.md)
- [Data model — Zone](../data-model/README.md#zone)
