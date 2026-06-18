# Report — progress

**Issue:** [#6](https://github.com/pskillen/codeplug-tool/issues/6)  
**Branch:** `6/paddy/cps-report`

## Shipped

- [x] `CodeplugMap` inset component extracted from full-page channel map
- [x] `useMapSettings` hook + `/settings` route for tile provider / Mapbox token
- [x] Nav: Summary, Channels, Zones, Talk groups, Contacts, RX Group Lists, Export, Settings
- [x] Summary page with entity cards
- [x] List pages with `EntityTable` (+ map on channels/zones)
- [x] Detail pages for all five entity types
- [x] `reportLookup` helpers and unit tests
- [x] `/map` → `/channels` redirect
- [x] Post-import/open lands on `/summary`

## Verify

1. Import an OpenGD77 export (Channels, Zones, Contacts, TG_Lists).
2. Confirm landing on Summary with correct counts.
3. Open Channels list — table + inset map; toggle “Draw zones” and full-name labels.
4. Click a channel name → detail with zones, map, external links.
5. Open Settings from nav or map cog — save Mapbox token, confirm tiles on map.
6. Repeat spot-check for zones, talk groups, contacts, RX group lists.

## Next

- Open PR linking #6
