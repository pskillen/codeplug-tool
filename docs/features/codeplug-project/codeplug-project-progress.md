# Codeplug projects — progress

**Branch:** `60/paddy/summary-dashboard-metadata`  
**Tracking:** [#60](https://github.com/pskillen/codeplug-tool/issues/60), [#61](https://github.com/pskillen/codeplug-tool/issues/61), [#31](https://github.com/pskillen/codeplug-tool/issues/31) (partial rename via edit screen)

## In flight (#60 + #61)

- [x] Slice 1: `CodeplugProject` metadata fields (`description`, `notes`, `author`, `targetRadios`) + storage normalization
- [x] Slice 2: `updateProject` store action + project validation
- [x] Slice 3: `/summary/edit` route + `TargetRadiosEditor`
- [x] Slice 4: Summary dashboard with map + compact entity cards

## Shipped (prior)

- [x] Terminology locked — [README](README.md)
- [x] `CodeplugProject` model + `newProject` / `defaultProjectName`
- [x] Multi-project store (`useProjects`, active context via `useCodeplug`)
- [x] Home: project list, import → new project, delete with confirm
- [x] Active-project bar, switch to home
- [x] Shared `ImportDropzone` for home + map
