# TalkGroupMergeCandidatesModal

Review and apply post-hoc talk group merges for per-slot duplicate families (same DMR ID, compatible name stem).

**Entry:** Talk groups list section nav — **Find merge candidates**.

**Flow:** scan at open → per-group **Merge** (editable result name) → card greys out; modal stays open.

Ambiguous groups (same DMR ID, incompatible stems) are listed without a merge action.

Mantine modals use `MODAL_ABOVE_MAP_Z_INDEX` from `theme.ts` so they render above Leaflet map controls.
