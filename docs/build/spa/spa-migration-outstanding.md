# SPA migration — outstanding

Items **skipped**, **incomplete**, or **discovered during execution** — not the plan's future phases.

**Tracking:** [opengd77-map#18](https://github.com/pskillen/opengd77-map/issues/18) (epic [#21](https://github.com/pskillen/opengd77-map/issues/21))

---

## Deploy safety

- [ ] **Do not cut a `v*` release until Ticket C is merged** — `pages.yml` now builds the SPA; production would lose the channel map until the port lands.

## Legacy static tools

- [ ] `site/` and `tools/` still present — delete in Ticket C (#20)
- [ ] `site/build-info.js` `sed` approach retired for SPA only; legacy file remains until cutover

## Follow-up tickets

- [ ] Ticket B (#19) — Mantine theme and responsive AppShell
- [ ] Ticket C (#20) — port channel map to `react-leaflet`, delete legacy static tools

## Documentation

- [ ] Update [git-workflow skill](../../.cursor/skills/git-workflow/SKILL.md) pre-commit checks for `npm run lint/test` (deferred — skill still references static HTML smoke tests)
