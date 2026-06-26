# BrandMeister directory — outstanding

Items skipped, incomplete, or discovered during execution — not the plan's future phases.

**Tracking:** [codeplug-tool#167](https://github.com/pskillen/codeplug-tool/issues/167)

---

## API / mapping

- [ ] `GET /device/{id}/action/getRepeater` requires dashboard authentication — mapper uses `GET /device/{id}` instead (frequencies + colour code present on device record)
- [ ] Dynamic talk group subscriptions not available from static `/talkgroup` endpoint — Flow B uses static TGs only

## Deferred (by design)

- [ ] Import into shared reference library ([#30](https://github.com/pskillen/codeplug-tool/issues/30))
- [ ] Phoenix / other DMR networks as sibling directories
- [ ] Mutating BrandMeister network (POST/DELETE static TGs on devices)

## Closed during execution

- [x] Bulk catalogue name fetch on TG create — removed; new TGs default to `TG {id}`; DMR ID is the identity key ([#174](https://github.com/pskillen/codeplug-tool/pull/174))
- [x] Rate limit risk from per-static-TG `GET /talkgroup/{id}` on bundle create — no longer fetched on create; talk group detail verify still fetches one catalogue name on demand
