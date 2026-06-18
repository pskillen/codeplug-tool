# Codeplug projects — progress

**Branch:** `9/paddy/localstorage-persistence`  
**Tracking:** [#9](https://github.com/pskillen/codeplug-tool/issues/9) (partial), [#31](https://github.com/pskillen/codeplug-tool/issues/31) (UI polish remains open)

## Shipped (nascent #31 slice)

- [x] Terminology locked — [README](README.md)
- [x] `CodeplugProject` model + `newProject` / `defaultProjectName`
- [x] Multi-project store (`useProjects`, active context via `useCodeplug`)
- [x] Home: project list, import → new project, delete with confirm
- [x] Map: active-project bar, switch to home
- [x] Shared `ImportDropzone` for home + map

## Verify

- Import two codeplugs from home; switch between them on map; delete one; hard refresh restores state.

## Next

- [#31](https://github.com/pskillen/codeplug-tool/issues/31): new empty project, rename, duplicate, refined UI
