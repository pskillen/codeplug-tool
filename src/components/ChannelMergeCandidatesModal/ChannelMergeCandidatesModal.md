# ChannelMergeCandidatesModal

Review and apply post-hoc multi-mode channel merges detected from the active codeplug.

**Entry:** Channels list section nav — **Find merge candidates**.

**Flow:** scan (`findChannelMergeCandidates`) → per-group checkbox and result name → **Apply N merges** (`applyChannelMerges` via store).

Ambiguous and unsupported multi-talkgroup groups are listed but not applied by default.
