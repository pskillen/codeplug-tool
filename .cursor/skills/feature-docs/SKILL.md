---
name: feature-docs
description: >-
  How opengd77-map documents tools and features under docs/features/. Use when
  adding or updating feature docs, reverse-engineering behaviour for a ticket, or
  creating progress/outstanding logs for an initiative.
---

# opengd77-map feature documentation

Canonical feature docs live under **`docs/features/<topic>/`**. User-facing tool overview stays in each HTML page and [`README.md`](../../../README.md); feature docs target contributors and agents.

Read [progress-tracking](../progress-tracking/SKILL.md) when an initiative needs execution handoff files.

---

## Folder layout

| Pattern | When to use | Examples |
| --- | --- | --- |
| **`<topic>/README.md`** | Every tool or feature area — hub page | `channel-map/README.md` |
| **Sibling deep dives** | One concern per file; README is the map | `csv-columns.md`, `map-layers.md` |
| **`*-progress.md` / `*-outstanding.md`** | Multi-step plans or tickets spanning PRs | `channel-map-progress.md` |

**Slug:** kebab-case matching the product concept (`channel-map`), not necessarily the HTML filename.

**Do not** put the full plan backlog in `*-outstanding.md` — only debt discovered during execution.

---

## README hub template

Every feature README should open with **what problem the tool solves** (1–2 paragraphs), then:

1. **Implementation status** — table: area | status | notes (shipped / in progress / deferred).
2. **Documentation map** — table linking sibling docs.
3. **Concepts** — OpenGD77/CPS terms the reader needs (zones, channel names as foreign keys, `Use Location`, etc.).
4. **Optional diagram** — mermaid when data flow is non-obvious (CSV → parse → map layers).
5. **Cross-links** — tracking GitHub issue, live GitHub Pages URL, related tools in this repo.

Stay within the tool boundary: channel-map docs cover geography visualisation, not general CPS editing advice.

---

## Deep-dive page template

Use for CSV formats, rendering behaviour, UI interaction, etc.

| Section | Contents |
| --- | --- |
| **Purpose** | What this slice covers vs the hub README |
| **Code anchors** | HTML file, main functions or sections (by name or line region) |
| **Inputs** | CSV files and columns (matched by header name, not index) |
| **Behaviour** | Filters, defaults, edge cases (e.g. skip `0,0`, case-sensitive channel names) |
| **Browser storage** | `localStorage` keys (e.g. Mapbox token) — never commit values |
| **Manual verify** | Steps with `sample-exports/` CSVs |
| **Known gaps** | Deferred features, CPS quirks not yet handled |
| **Related** | Other feature docs, issues |

Prefer **tables** for CSV columns and UI controls. Use small **JSON or CSV snippets** when shape matters.

---

## Progress and outstanding pair

Create both at **plan kickoff** if missing. Update per [progress-tracking](../progress-tracking/SKILL.md).

| File | Role |
| --- | --- |
| `*-progress.md` | Shipped slices, PR links, branch, verify steps, **Next** |
| `*-outstanding.md` | Checkboxes for discovered debt — not future plan phases |

Link both from the tracking GitHub issue and the Cursor plan **Progress tracking** section.

---

## Style conventions

- **British English** in prose is fine; code identifiers stay as in repo.
- Link GitHub issues/PRs with full URLs: `[opengd77-map#1](https://github.com/pskillen/opengd77-map/issues/1)`.
- Use relative links between docs: `[csv-columns.md](csv-columns.md)`.
- Cite **concrete defaults** (e.g. Leaflet tile source, hull opacity) where behaviour depends on them.
- When behaviour changes, update the **feature doc** and any affected comments in the HTML tool.
- **Reverse-engineering ticket:** document *current* behaviour first before implementing changes.
- **Timeless vs point in time**
  - Feature docs describe how the tool works today.
  - Progress and outstanding files are point-in-time execution logs.

---

## Index maintenance

When adding a new feature folder:

1. Add a row to [docs/features/README.md](../../../docs/features/README.md).
2. Optionally add a one-line link from [`AGENTS.md`](../../../AGENTS.md) repository layout table if a new top-level tool file ships.

---

## Anti-patterns

- Duplicating the entire README or AGENTS.md into feature docs.
- One giant README with no map (split when > ~150 lines or multiple audiences).
- Outstanding file copied from the Cursor plan todo list.
- Documenting aspirational behaviour as shipped — use **Implementation status** and **Known gaps**.
