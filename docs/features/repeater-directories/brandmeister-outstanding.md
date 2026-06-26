# BrandMeister directory — outstanding

Items skipped, incomplete, or discovered during execution — not the plan's future phases.

**Tracking:** [codeplug-tool#167](https://github.com/pskillen/codeplug-tool/issues/167)

---

## Discovered during spike (Slice 0)

- [ ] `GET /device/{id}/action/getRepeater` requires dashboard authentication — mapper uses `GET /device/{id}` instead (frequencies + colour code present on device record)
- [ ] Rate limit header `X-RateLimit-Limit: 60` — monitor if bulk TG name lookups hit limits
- [ ] Dynamic talk group subscriptions not available from static `/talkgroup` endpoint — Flow B uses static TGs only

## Deferred (by design)

- [ ] Import into shared reference library ([#30](https://github.com/pskillen/codeplug-tool/issues/30))
- [ ] Phoenix / other DMR networks as sibling directories
- [ ] Mutating BrandMeister network (POST/DELETE static TGs on devices)
