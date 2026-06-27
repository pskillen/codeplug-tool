# Help surface plan — inline help locations & long-form topics

Working draft for [#135](https://github.com/pskillen/codeplug-tool/issues/135). **Bullet-point inventory only** — actual copy will be drafted later from [`feature-reference.md`](feature-reference.md), [`glossary-dev.md`](glossary-dev.md), and the [`help-writing-styleguide.md`](help-writing-styleguide.md). Routes confirmed against `src/App.tsx` + `src/nav/`.

Two tiers per the ticket:
- **Inline / nearby** — short context at the point of use (field hints, info icons, expandable alerts, empty states).
- **Long-form** — deeper walkthroughs in a Help section/route.

Priority tags map to the ticket's phases: **P1** high-traffic surfaces, **P2** complex editors, **P3** help hub.

---

## A. Inline help locations (by route)

### Home `/` — **P1**
- What "Start fresh" vs "Import" does (new project either way here).
- LocalStorage privacy note: nothing uploaded; CSVs never leave the machine.
- That importing here always creates a *new* project (vs Import & export which merges).
- Format picker: you must choose the format; we don't auto-detect.

### New project `/codeplug/new` — **P1**
- Project vs codeplug (one project wraps one codeplug).
- `targetRadios` is indicative only — not a constraint, not the export profile.
- Not saved until you create it.

### Summary `/summary` + `/summary/edit` — **P1**
- What the dashboard shows; how to switch/active project.
- Metadata fields (description/notes/author) are operator-only, never exported.

### Import & export `/export` — **P1** (highest value)
- **Merge vs overwrite** — merge only touches entity types in the import; overwrite replaces them. Matching is by name (case-sensitive).
- This page **merges into the active project** (contrast with Home).
- Folder-drop expectations (multi-file formats like OpenGD77/DM32; single file for CHIRP/native YAML).
- **Format + variant picker**: variant sets radio caps/limits — pick it first.
- One project → multiple export formats.
- **Lossy boundary warning**: some formats can't store every field (e.g. DMR fields dropped on CHIRP; DTMF/APRS not modelled). Export notes/warnings panel explained.
- **Export name options** and **DM32 zone-derived export** master toggles (see export-options sub-list below).
- Unresolved zone members in the merge preview — what they mean.

### Export name settings (shared component + Settings `/settings`) — **P1/P2**
Inline hint per control, written to disambiguate (see `feature-reference.md` §6.2–6.3):
- **Shorten long channel names** — master switch; gates the others.
- **Target name length** — overrides the variant's default limit; empty = variant default (so pick a variant first).
- **Export name mode override** — global, export-only; differs from the per-channel "Export name mode".
- **Use channel / talk group abbreviations** — when names are tight.
- **Multi-talkgroup export name style** — only affects formats that fan out RGLs (DM32). Note it's hidden for OpenGD77.
- Optional: a one-line "what happens, in order" explainer (profile → compose → expand → shorten).

### Channels list `/channels` — **P1/P2**
- Map filters (`useLocation`, `hideFromMap`), co-located markers.
- **Find merge candidates** (#116) — what it detects and does.
- Add-from-ukrepeater (`/channels/add-from-ukrepeater`) and BrandMeister (`/channels/add-from-brandmeister`).

### Channel edit `/channels/:id/edit`, `/channels/new` — **P2**
- **Multi-mode** tabs: one logical channel, several modes (e.g. FM+DMR); which fields are mode-specific.
- Mode-specific field applicability (colour code/timeslot/DMR ID = DMR; tones/bandwidth = analogue).
- **TX contact** can be a talk group *or* a private contact.
- **RX group list** field + the promiscuous-RX concept (and that its export effect differs by radio).
- **Export name mode** (per-channel) vs the global override.
- "RX only" = forbid transmit; squelch/power `null` = radio default.
- Callsign drives the map label and name composition.

### Zones list/edit `/zones*` — **P2**
- Zones group channels for on-radio switching; member **order** matters.
- Map hull = grouping visual, **not** coverage.
- **Radio variance:** on OpenGD77 a zone *is* the scan list; on DM32 scanning is separate.
- **Shipped (#164):** per-member `includeInScanList`; zone `exportScanList`, `exportScratchChannel`, `scanCarrierFrequencyHz` (DM32 export only).
- **Zone from distance** (`/zones/from-distance`) — radius filter + create zone from selection.
- **Duplicate zone** on detail page (#179).

### Talk groups / Contacts `/talk-groups*`, `/contacts*` — **P2**
- Talk group = DMR group call; contact = private/DTMF.
- **Shared name namespace** — a talk group and contact can't share a name.
- `abbreviation` is used for export name shortening.
- **Find merge candidates** on Talk Groups list (#142) — collapse `TS1`/`TS2` duplicates.
- **Duplicate** on detail pages (#179).

### RX group lists `/rx-group-lists*` — **P2**
- What an RGL is (promiscuous receive); members are ordered.
- **Per-member timeslot** (#142) — slot lives on membership, not the talk group.
- Member-count caps are **export-only** (don't block editing).
- **Radio variance callout:** reference on OpenGD77 vs channel fan-out on DM32.
- BrandMeister verify/correction on detail (#167).

### Reference `/reference*` — **P1 (low effort)**
- One-liners: band plan and Maidenhead converter; available without a project.

### Settings `/settings` — **P2**
- Mapbox token stays in LocalStorage only; OSM default needs no key.
- Maidenhead grid overlay toggle.
- Google Drive connect (interchange only, not the live store).

### Empty states / errors (cross-cutting) — **P1**
- Empty channel/zone/TG lists → "import or create your first…".
- Quota-exceeded alert wording.
- Import errors vs skipped-file wording (e.g. DTMF/APRS/Scan skipped by design).

---

## B. Export-options inline copy (call-out list)

These deserve special inline treatment because the UI names are unclear and behaviour is invisible:
- Profile/variant must be chosen first (drives all limits).
- "Shorten names" gates the dependent controls.
- Global "name mode override" ≠ per-channel "export name mode".
- Multi-TG / TG-abbrev options only apply to fan-out formats (DM32).
- The same Export button structurally reshapes data differently per format (mode split vs RGL fan-out) — set expectations.
- Order of operations one-liner.

---

## C. Long-form help topics (Help hub) — **P3**

Spine = operator lifecycle (create → edit → export). Each is a candidate page/section:

1. **What this tool is (and isn't)** — designs a codeplug layout; exports for your CPS; doesn't flash the radio. Privacy/storage model.
2. **Getting started** — start fresh vs import; new project vs merge.
3. **Importing your codeplug** — supported formats; multi-file vs single-file; merge vs overwrite; what "skipped" files mean; re-importing is safe (idempotent).
4. **Editing channels** — single vs multi-mode; mode-specific fields; TX contact vs RX group list.
5. **Zones** — grouping, order, and how zones relate to scanning per radio.
6. **Talk groups, contacts & RX group lists** — the model vs the radio; promiscuous receive; shared namespace; per-member timeslots.
7. **Exporting for your radio** — formats & variants; the name-shortening options explained simply; what gets reshaped per radio (the RGL divergence, in plain language); lossy boundaries; one project → many radios.
8. **The map** — what it plots; hulls vs coverage; filters; tiles/Mapbox.
9. **Saving & syncing** — LocalStorage, native YAML interchange, Google Drive.
10. **Glossary** — user-facing, derived from `glossary-dev.md`; relate each app term to the radio concept the operator already knows.
11. **Reference tools** — band plan, Maidenhead; deep links.
12. **FAQ / troubleshooting** — "why does my export look different per radio?", "why were some rows split/duplicated?", "why did a field disappear?", quota errors, name collisions.

Cross-link strategy: inline hints link into the matching hub section; hub sections link out to in-app reference routes (`/reference/*`) and, for contributors only, to `docs/`.

---

## D. Suggested shared primitives (implementation hint, not prescriptive)
- `InfoTooltip` / `HelpPopover` for inline field hints.
- Expandable `Alert`/`Accordion` for "learn more" blocks on Import & export and editors.
- A small **content manifest** mapping route/field id → short hint + long-form slug, so copy lives in one place and stays consistent with the glossary.
- Mermaid renderer for the two operator-facing diagrams (merge-vs-new, RGL divergence).

---

## E. Boundaries reminder (applies to all copy)
- Keep general help **format-agnostic**; describe the model, then note radio variance explicitly and scope it.
- No wire tables / CSV column names in general help — link to `docs/reference/<format>/`.
- No contributor jargon (adapter, schema version, FK/UUID, route names) in default user strings.
- Per `documentation-boundaries.mdc` and `vendor-boundaries.mdc`.
