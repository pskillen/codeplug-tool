# Channel merge candidates — progress

**Tracking:** [codeplug-tool#116](https://github.com/pskillen/codeplug-tool/issues/116)  
**Plan:** `.cursor/plans/channel_merge_candidates_2ce56249.plan.md`

---

## Overall status

**Status:** Complete (pending merge)

**Branch:** `116/pskillen/channel-merge-candidates`

---

## Slice 1: Docs kickoff

**Status:** Complete

---

## Slice 2: Refactor merge primitives

**Status:** Complete

- `mergeChannelsToMultiMode`, `channelsAreMultiModeMergeCandidates`, fuzzy name helpers
- `ChannelModeProfile.opengd77Extras` for CRUD merge path

---

## Slice 3: Detection + preview lib

**Status:** Complete

- `src/lib/channelMergeCandidates.ts` — find, preview, apply
- Unit tests with GB7GL-style fixtures

---

## Slice 4: Mutations + store

**Status:** Complete

- `mergeChannelsIntoOne` with zone id rewire and `refreshAllZoneSourceNames`
- `APPLY_CHANNEL_MERGES` store action + `useCodeplug().applyChannelMerges`

---

## Slice 5: Review UI

**Status:** Complete

- `ChannelMergeCandidatesModal` + section nav entry button

---

## Slice 6: Final docs + PR

**Status:** Complete

---

## Verify

- `npm run format:check && npm run lint && npm run test && npm run build`
- `npm run dev` → `/#/channels` → **Find merge candidates** with split FM+DMR rows at same frequency
- Apply merge → single multi-mode row; zones show one survivor member id
- Export OpenGD77 → two rows from one logical multi-mode channel

---

## Next

- Merge PR; follow-ups in [channel-merge-candidates-outstanding.md](channel-merge-candidates-outstanding.md)
