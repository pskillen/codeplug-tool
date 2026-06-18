# Export

How internal [codeplug models](../data-model/README.md) leave the app as vendor CPS formats.

**Tracking:** [codeplug-tool#38](https://github.com/pskillen/codeplug-tool/issues/38)

## Problem

Import brings CPS data in; export serialises the internal models back to a format the vendor CPS accepts. OpenGD77 CPS CSV is the first export target.

## Implementation status

| Area | Status | Notes |
| --- | --- | --- |
| Export registry | In progress | `src/lib/export/` |
| OpenGD77 CSV | In progress | Channels, Zones, Contacts, TG_Lists |
| OpenGD77 ZIP bundle | In progress | All 6 files via `fflate`; DTMF/APRS header-only |
| Export page (`/export`) | In progress | Nav link when a project is active |
| qDMR YAML | Deferred | [#37](https://github.com/pskillen/codeplug-tool/issues/37) — UI placeholder |
| Native YAML | Deferred | [#10](https://github.com/pskillen/codeplug-tool/issues/10) — UI placeholder |

## Documentation map

| Doc | Contents |
| --- | --- |
| [import/opengd77.md](../import/opengd77.md) | CSV columns (import + export share headers) |
| [import/opengd77-progress.md](../import/opengd77-progress.md) | Execution log |
| [import/opengd77-outstanding.md](../import/opengd77-outstanding.md) | Discovered debt |
| [data-model/README.md](../data-model/README.md) | Entity definitions |

## Related

- [Import hub](../import/README.md)
- [OpenGD77 import](../import/opengd77.md)
