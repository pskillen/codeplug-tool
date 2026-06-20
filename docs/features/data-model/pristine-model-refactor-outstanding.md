# Pristine internal data model refactor — outstanding

Items **skipped**, **incomplete**, or **discovered during execution** — not the epic's future phases (those live in the [epic plan](../../../.cursor/plans/vendor-neutral_data_model_epic_941d5a01.plan.md) and per-phase subplans).

**Tracking:** [codeplug-tool#93](https://github.com/pskillen/codeplug-tool/issues/93)
**Progress:** [pristine-model-refactor-progress.md](pristine-model-refactor-progress.md)

---

## Audit findings to land or ticket

- [ ] Silent zone-member truncation on OpenGD77 export (no warning) — move to the new OpenGD77 export-issues ticket. (review doc finding A)
- [ ] `OPENGD77_MAX_ZONE_MEMBERS` enforced in mutations/validation/UI — move the cap to export only. (review doc §6; export-issues ticket)
- [x] `rxOnly` stored as `Yes`/`No` string — scheduled for Phase 2 boolean conversion. (review doc finding B)
- [ ] Persistence README says `CODEPLUG_SCHEMA_VERSION = 1` (actual 3) — fix in Phase 0. (review doc finding C)

## Discovered during execution

- _(none yet — add bugs, doc drift, or CPS quirks found while executing phases, with file paths)_

## Deferred (out of scope for this epic)

- [ ] APRS/DTMF entity modelling — `aprsConfigName` stays a string FK.
- [ ] OpenGD77 radio-variant picker at export ([#72](https://github.com/pskillen/codeplug-tool/issues/72)).
- [ ] Second-format adapters (DM32, qDMR, CHIRP) — model made ready, not implemented.
