# SPA migration — progress

**Tracking:** [opengd77-map#18](https://github.com/pskillen/opengd77-map/issues/18) (epic [#21](https://github.com/pskillen/opengd77-map/issues/21))
**Plan:** SPA migration foundation (Tickets A → B → C)

---

## Overall status

**Status:** In progress (Ticket B pending merge)

**Branch:** `19/paddy/mantine-app-shell`

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

**Status:** Complete (pending merge)

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

**Status:** Not started

**Prerequisite:** Ticket B merged to `main`

---

## Next

- Open PR for Ticket B (#19) from `19/paddy/mantine-app-shell`
- After merge, begin Ticket C (#20) on a new branch from `main`
- **Do not publish a GitHub release until Ticket C is merged**
