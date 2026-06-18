# Maidenhead grid overlay

Maidenhead locator grid lines and cell labels on `CodeplugMap` embeds — controlled from `/settings`.

**Tracking:** [codeplug-tool#50](https://github.com/pskillen/codeplug-tool/issues/50)

## Purpose

Gives geographic context when working with Maidenhead locators (channel CRUD display, [#47](../maidenhead.md) converter). Grid math matches [`src/lib/maidenhead.ts`](../../../src/lib/maidenhead.ts).

## Code anchors

| Path | Role |
| --- | --- |
| `src/lib/maidenheadGrid.ts` | `computeGridLines`, `computeGridLabels` for viewport bounds |
| `src/components/CodeplugMap/MaidenheadGridLayer.tsx` | Leaflet polylines + permanent cell labels |
| `src/hooks/useMapSettings.ts` | `maidenheadGrid` mode + `localStorage` persistence |
| `src/routes/Settings.tsx` | Grid overlay select control |

## Settings

| Option | Mode | Lines | Labels |
| --- | --- | --- | --- |
| Off | `off` | none | none |
| 4-character grid | `4` | ~2° × 1° | 4-char (e.g. `IO85`) at cell centre |
| 6-character grid | `6` | ~2° × 1° + finer ~5 km | 6-char (e.g. `IO85mm`) on fine cells only |

**Storage key:** `mm9pdy-codeplug-tool.channel-map.maidenheadGrid` (browser `localStorage` only).

## Behaviour

- Viewport-scoped: lines and labels recompute on pan/zoom (`moveend` / `zoomend`).
- **6-character detail** (fine lines and labels) only renders at Leaflet zoom **9+**; below that, mode `6` still shows coarse 4-char grid lines so wide views stay responsive.
- Rendered below zone hulls and channel markers.
- Subtle stroke/label styling so markers remain primary.
- Applies to all `CodeplugMap` embeds and the Maidenhead converter `MapLocationPicker`.

## Manual verify

1. `/settings` → **4-character grid** → open `/#/channels` with geolocated channels.
2. Confirm ~2° × 1° lines and 4-char labels (e.g. `IO85` over Glasgow).
3. Switch to **6-character grid** → zoom in to level 9+ for fine lines and 6-char labels; coarse lines visible when zoomed out.
4. Pan/zoom → grid updates; setting persists after reload.
5. **Off** → no grid overlay.

## Related

- [Map tool README](README.md) · [Maidenhead conversion](../maidenhead.md)
