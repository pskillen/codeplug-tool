# Codeplug projects

Contributor reference for the **codeplug project** wrapper — the named, persistent, switchable container that holds one codeplug and is the unit users work with across tools.

**Tracking:** [codeplug-tool#9](https://github.com/pskillen/codeplug-tool/issues/9) (persistence + nascent CRUD), [codeplug-tool#31](https://github.com/pskillen/codeplug-tool/issues/31) (UI polish)

## Problem

Operators often maintain several CPS layouts side by side — e.g. home repeaters, contest weekend, travel — and need to switch between them without re-importing each time. The **codeplug** (channels, zones, contacts, etc.) is the radio configuration *content*; the **codeplug project** is the app-level wrapper that gives that content a name, identity, and persistence boundary.

## Terminology (locked)

The word "codeplug" describes the radio configuration content. We deliberately avoid using a bare `codeplug` path or type name for the switchable wrapper so docs and code do not conflate "how a codeplug is assembled" with "which codeplug you are editing".

| Term | Meaning | In code | In docs | Shown to user |
| --- | --- | --- | --- | --- |
| **Codeplug** | Radio configuration *content*: channels, zones, talk groups, TG/RX-group lists, contacts. | `Codeplug` — [`src/models/codeplug.ts`](../../../src/models/codeplug.ts) | [data-model/](../data-model/) | "codeplug" (the contents) |
| **Codeplug project** | Named, persistent, switchable *container* holding exactly one codeplug plus identity (`id`, `name`, `createdAt`, `updatedAt`). | `CodeplugProject` — [`src/models/codeplugProject.ts`](../../../src/models/codeplugProject.ts) | this folder (`codeplug-project/`) | usually just "codeplug" |
| **Active project** | The currently selected codeplug project. All tools operate on its codeplug. | `activeProjectId` in the store | [persistence/](../persistence/) + this doc | n/a |

**User-facing copy:** the `-project` suffix is an internal disambiguation device. The UI says "codeplug" (e.g. "Your codeplugs", "Import codeplug", "Switch codeplug") unless the switching action needs the word "project" for clarity.

## Why identity lives on the wrapper

`Codeplug` stays vendor-neutral and describes CPS *contents* only. Project metadata (`id`, `name`, timestamps) belongs on `CodeplugProject` so:

- The data model doc ([data-model/](../data-model/)) stays focused on channels/zones/relationships.
- Persistence stores a **set of projects + active id** without overloading `CodeplugMeta`.
- Future tools (report, export, CRUD) share one active-project context.

## Implementation status

| Area | Status | Notes |
| --- | --- | --- |
| `CodeplugProject` model | In progress | `src/models/codeplugProject.ts` |
| Multi-project store | In progress | `src/state/codeplugStore.tsx` |
| LocalStorage persistence | In progress | [persistence/](../persistence/) |
| Landing: list / import / delete | In progress | `src/routes/Home.tsx` |
| Map: active-project bar | In progress | `src/components/ActiveProjectBar/` |
| New empty project | Deferred | [#31](https://github.com/pskillen/codeplug-tool/issues/31) |
| Rename / duplicate | Deferred | [#31](https://github.com/pskillen/codeplug-tool/issues/31) |
| Refined switcher / import-export UI | Deferred | [#31](https://github.com/pskillen/codeplug-tool/issues/31) |

## Related

- [Internal data model](../data-model/) — `Codeplug` contents
- [Persistence](../persistence/) — LocalStorage envelope and limits
- [Import](../import/) — CPS CSV → codeplug at the store boundary
