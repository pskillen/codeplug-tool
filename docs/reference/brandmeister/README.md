# BrandMeister Halligan API v2 reference

Authoritative reference for the **BrandMeister Dashboard REST API** (`https://api.brandmeister.network/v2/`) used by the BrandMeister repeater directory in codeplug-tool.

**Tracking:** [codeplug-tool#167](https://github.com/pskillen/codeplug-tool/issues/167)

This is a **remote directory API**, not a CPS wire format. Mapping to the internal [codeplug model](../../features/data-model/README.md) lives in [`src/lib/repeaterDirectories/brandmeister/`](../../../src/lib/repeaterDirectories/brandmeister/). Feature behaviour: [repeater-directories](../../features/repeater-directories/README.md).

## API

| Property | Value |
| --- | --- |
| Base URL | `https://api.brandmeister.network/v2/` |
| Docs | [api.brandmeister.network/docs](https://api.brandmeister.network/docs/) |
| CORS | `Access-Control-Allow-Origin` reflects request origin (verified: `localhost:5173`, GitHub Pages) — callable from the browser SPA |
| Rate limit | `X-RateLimit-Limit: 60` per window (observed on spike) |
| Stability | Third-party — degrade gracefully on failure; cache responses; attribute source in UI |

### Endpoints used by codeplug-tool

| Endpoint | Auth | Returns |
| --- | --- | --- |
| `GET /device/byCall?callsign={call}` | **No** | Array of device records for callsign |
| `GET /device/{id}` | **No** | Single device record |
| `GET /device/{id}/talkgroup` | **No** | Static talk groups configured on device (slot + TG id) |
| `GET /talkgroup/{id}` | **No** | Talk group metadata (`ID`, `Name`) |
| `GET /device/{id}/action/getRepeater` | **Yes** (dashboard token) | **Not used** — returns `Unauthenticated` without token; device record carries frequencies and colour code |

Spike date: 2026-06-26. Re-verify auth/CORS if the API changes.

## Device record (sample)

From `GET /device/byCall?callsign=GB7HH`:

```json
{
  "id": 235226,
  "callsign": "GB7HH",
  "linkname": "MMDVM Host",
  "hardware": "MMDVM",
  "firmware": "20240210_PS4",
  "tx": "439.7500",
  "rx": "430.7500",
  "colorcode": 3,
  "status": 3,
  "lastKnownMaster": 2341,
  "lat": 51.565,
  "lng": 0.1843,
  "city": "Romford",
  "website": "http://qrz.com/db/gb7hh",
  "priorityDescription": "GB7HH Romford, UK",
  "description": "Covers East London, West Essex and North Kent",
  "last_seen": "2026-06-26 16:58:18",
  "statusText": "Both Slots Linked"
}
```

Frequencies are **MHz strings** with four decimal places. Convert to integer **Hz** for the internal model.

## Static talk group record (sample)

From `GET /device/235226/talkgroup`:

```json
{
  "talkgroup": "2350",
  "slot": "2",
  "repeaterid": "235226"
}
```

`slot` is `"1"` or `"2"` (DMR time slot). `talkgroup` is the DMR talk group ID string.

## Talk group metadata (sample)

From `GET /talkgroup/9`:

```json
{
  "ID": 9,
  "Name": "Local"
}
```

## Frequency inversion (critical)

Repeater-side frequencies are **inverted** vs the radio channel (same rule as ukrepeater.net):

| BrandMeister field | Internal `Channel` |
| --- | --- |
| `tx` (repeater output, MHz) | `rxFrequency` (Hz) |
| `rx` (repeater input, MHz) | `txFrequency` (Hz) |

## Field mapping (BrandMeister device → internal)

| BrandMeister | Internal target | Notes |
| --- | --- | --- |
| `callsign` | `Channel.callsign` | Directory search key |
| `city` / `priorityDescription` | `Channel.name` qualifier | Prefer `city`; fallback `priorityDescription` |
| `tx` / `rx` | `rxFrequency` / `txFrequency` | Inverted; MHz → Hz |
| `colorcode` | `Channel.colourCode` | DMR 0–15 |
| `lat` / `lng` | `Channel.location` | When both finite |
| `description` / `statusText` | `Channel.comment` | Display metadata |
| — | `Channel.mode` | Always `dmr` for directory import |
| `id` | `meta.repeaterDirectory.remoteListingId` | Device id for verify/refresh |
| Static `talkgroup` + `slot` | `TalkGroup.number` + RX list `timeslot` | Dedupe TG by DMR id |
| `talkgroup/{id}.Name` | `TalkGroup.name` | Fetched per static TG |

## Identity / dedupe

| Entity | Match key |
| --- | --- |
| Repeater device | BrandMeister `device.id` (stored in provenance) |
| Talk group | DMR id (`TalkGroup.number`) — not wire name |
| Channel | `callsign` + frequency pair + stored device id |

## Related

- [repeater-directories feature hub](../../features/repeater-directories/README.md)
- [ukrepeater reference](../ukrepeater/README.md) — sibling directory pattern
