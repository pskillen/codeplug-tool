# Export name shortening — outstanding

Debt discovered during execution — not scheduled plan work.

## TalkGroupEdit abbreviation clear

Clearing `TalkGroup.abbreviation` in the edit form does not remove an existing value on save (`TalkGroupEdit` omits the field from the patch when blank). Channel edit explicitly clears via `abbreviation: undefined`. Consider fixing talk-group edit in a follow-up.
