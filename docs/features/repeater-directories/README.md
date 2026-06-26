# Repeater directories

Network-backed repeater lookup sources that populate the internal codeplug model — siblings to CPS file import, not another CSV format.

**Tracking:** [codeplug-tool#92](https://github.com/pskillen/codeplug-tool/issues/92) (ukrepeater.net) · [#167](https://github.com/pskillen/codeplug-tool/issues/167) (BrandMeister)

## Problem

Operators hand-type repeater frequencies, tones, talk groups, and locations. Authoritative listings live on network directories (ukrepeater.net for UK analogue/DMR, BrandMeister for DMR repeaters worldwide). The app should fetch listings and add or verify entities in the active codeplug.

## Implementation status

| Area | Status | Notes |
| --- | --- | --- |
| ukrepeater.net (ETCC API) | Shipped | [#92](https://github.com/pskillen/codeplug-tool/issues/92) — search/add + verify |
| BrandMeister (Halligan API v2) | Shipped | [#167](https://github.com/pskillen/codeplug-tool/issues/167) — DMR search/add, TG/RX auto-create, verify |
| RepeaterBook / other directories | Deferred | Generic `RepeaterDirectorySource` interface for future sources |
| Shared reference library target | Blocked | [#30](https://github.com/pskillen/codeplug-tool/issues/30) |

## Documentation map

| Doc | Role |
| --- | --- |
| [ukrepeater-progress.md](ukrepeater-progress.md) | ukrepeater execution log |
| [ukrepeater-outstanding.md](ukrepeater-outstanding.md) | ukrepeater debt |
| [brandmeister-progress.md](brandmeister-progress.md) | BrandMeister execution log |
| [brandmeister-outstanding.md](brandmeister-outstanding.md) | BrandMeister debt |
| [reference/ukrepeater/](../../reference/ukrepeater/README.md) | ETCC API field mapping |
| [reference/brandmeister/](../../reference/brandmeister/README.md) | Halligan API field mapping |
| [data-model](../data-model/README.md) | Internal `Channel` model |
| [import-export](../import-export/README.md) | CPS file import (separate concern) |
| [crud](../crud/README.md) | Channel create/edit routes |

## Concepts

- **Directory vs CPS import:** CPS adapters parse local files; directory sources `fetch` remote JSON and map at the boundary via [`src/lib/repeaterDirectories/`](../../../src/lib/repeaterDirectories/).
- **Internal FKs:** Zone membership uses UUID `memberChannelIds`. Talk groups dedupe by DMR id (`TalkGroup.number`). RX lists use `memberRefs` with UUID ids.
- **Provenance:** `meta.repeaterDirectory` stores remote listing/device id, fetch time, and snapshot metadata for verify/refresh — not export source of truth.
- **Vendor-neutral model:** No radio profile caps in mapper, mutations, or CRUD UI.

## Flows

### ukrepeater.net

| Flow | Route / UI |
| --- | --- |
| Search and add | `/channels/add-from-ukrepeater` |
| Verify | Channel detail → **Check ukrepeater.net** |

### BrandMeister ([#167](https://github.com/pskillen/codeplug-tool/issues/167))

| Flow | Route / UI |
| --- | --- |
| Search and add DMR channel | `/channels/add-from-brandmeister` — optional talk groups + RX list |
| Pre-fill on edit | DMR channel editor → **Look up** |
| Verify channel | DMR channel detail → **Check BrandMeister** |
| Verify talk group | Talk group detail → **Check BrandMeister** (catalogue name) |
| Verify RX list | RX list detail → **Check BrandMeister** (static TG membership vs linked repeater) |

## Related

- [operator lifecycle](../workflows/operator-lifecycle.md)
- [map — channels](../map/channels.md)
