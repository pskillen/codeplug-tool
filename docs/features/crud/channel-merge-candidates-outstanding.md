# Channel merge candidates — outstanding

Items **skipped**, **incomplete**, or **discovered during execution** — not the plan's future phases.

**Tracking:** [codeplug-tool#116](https://github.com/pskillen/codeplug-tool/issues/116)

---

## Deferred scope

- [ ] Multi-talkgroup merge apply ([#36](https://github.com/pskillen/codeplug-tool/issues/36)) — detection stub only in v1
- [ ] Full-page review route ([#113](https://github.com/pskillen/codeplug-tool/issues/113)) — modal v1 ships first
- [ ] Automatic detection on load — button-initiated only

## Known debt

- [ ] Import `mergeImportChannelsBestEffort` still stamps `meta.imported.multiModeProfileWire` (wire-stash round-trip violation per [no-wire-stash-roundtrip](../../../.cursor/rules/no-wire-stash-roundtrip.mdc)) — CRUD path uses profile `opengd77Extras` instead; import path remediation follow-up
- [ ] `OPENGD77_MAX_ZONE_MEMBERS` in `codeplugMutations.ts` — pre-existing vendor leakage; not extended by this work
