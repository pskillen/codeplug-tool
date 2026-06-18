# SPA migration — progress

**Tracking:** [opengd77-map#18](https://github.com/pskillen/opengd77-map/issues/18) (epic [#21](https://github.com/pskillen/opengd77-map/issues/21))
**Plan:** SPA migration foundation (Tickets A → B → C)

---

## Overall status

**Status:** Complete (pending merge)

**Branch:** `18/paddy/spa-scaffold`

---

## Ticket A — scaffold SPA, tooling, routing, deploy pipeline (#18)

**Status:** Complete (pending merge)
**PR:** https://github.com/pskillen/opengd77-map/pull/23

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

**Status:** Not started

**Prerequisite:** Ticket A merged to `main`

---

## Ticket C — port channel map; retire static tools (#20)

**Status:** Not started

**Prerequisite:** Ticket B merged to `main`

---

## Next

- Merge PR #23 (Ticket A)
- After merge, begin Ticket B (#19) on a new branch from `main`
- **Do not publish a GitHub release until Ticket C is merged**
