# SPA migration — progress

**Tracking:** [opengd77-map#18](https://github.com/pskillen/opengd77-map/issues/18) (epic [#21](https://github.com/pskillen/opengd77-map/issues/21))
**Plan:** SPA migration foundation (Tickets A → B → C)

---

## Overall status

**Status:** Complete (Ticket C pending merge)

**Branch:** `20/paddy/channel-map-port`

---

## Ticket A — scaffold SPA, tooling, routing, deploy pipeline (#18)

**Status:** Complete
**PR:** https://github.com/pskillen/opengd77-map/pull/23 (merged)

**Delivered**

- `chore(spa): scaffold Vite + React + TypeScript app` — `188809d`
- `feat(spa): add HashRouter with home and placeholder map routes` — `083f467`
- `chore(spa): add ESLint, Prettier, and Vitest with smoke test` — `4c73508`
- `feat(spa): migrate build-info to Vite define and add footer` — `d3b491b`
- `ci(spa): build and publish Vite dist on release` — `ea76cc3`
- `docs(spa): update agent guidance for Vite SPA build` — `ef10a61`

**Verify**

- `npm install && npm run build` — produces `dist/` with `base: /opengd77-map/`
- `npm run dev` — `/#/` shows home hub; `/#/map` shows placeholder
- `npm run lint && npm run format:check && npm run test` — all pass
- `BUILD_ENV=prod BUILD_VERSION=v1.2.3 npm run build` — footer shows `prod · 1.2.3`
- `site/` and `tools/` remain untouched

---

## Ticket B — Mantine design system (#19)

**Status:** Complete
**PR:** https://github.com/pskillen/opengd77-map/pull/24 (merged)

**Delivered**

- `feat(spa): add Mantine provider, dark theme, and PostCSS config` — `583cf63`
- `feat(spa): add responsive AppShell with collapsible navbar` — `1b851bb`
- `feat(spa): restyle home, map placeholder, and build footer with Mantine` — `53096a5`

**Verify**

- `npm install && npm run build` — Mantine styles bundled in `dist/`
- `npm run lint && npm run format:check && npm run test` — all pass
- `npm run dev` — dark theme; navbar persistent at desktop; burger toggles navbar on mobile
- `BUILD_ENV=prod BUILD_VERSION=v1.2.3 npm run build` — footer shows `prod · 1.2.3`
- `site/` and `tools/` remain untouched

---

## Ticket C — port channel map; retire static tools (#20)

**Status:** Complete (pending merge)
**PR:** _(open after push)_

**Delivered**

- `chore(channel-map): add leaflet and react-leaflet dependencies` — `aa4fb13`
- `feat(channel-map): port typed CSV parsing helpers with tests` — `fbc5040`
- `feat(channel-map): port geometry and filter helpers with tests` — `a7062e4`
- `feat(channel-map): port channel map to react-leaflet component` — `514324f`
- `feat(channel-map): wire channel map into /map route` — `de6ff96`
- `feat(channel-map): retire legacy static tools and update docs` — `79d5822`

**Verify**

- `npm run lint && npm run format:check && npm run test && npm run build` — all pass
- `npm run dev` — `/#/map` loads channel map with sidebar and Leaflet map
- Load sample `Channels.csv` / `Zones.csv` from `sample-exports/` — markers, hulls, filters, stats
- Mapbox token save/clear persists in `localStorage`
- `site/` and `tools/` deleted; README and feature docs point at SPA routes
- **Safe to publish a GitHub release after merge** — production will include the ported map

---

## Next

- Open PR for Ticket C (#20), merge to `main`
- Publish a full GitHub release to deploy GitHub Pages with the channel map
