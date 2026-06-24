# Export name shortening — outstanding

Debt discovered during execution — not scheduled plan work.

## TalkGroupEdit abbreviation clear

Clearing `TalkGroup.abbreviation` in the edit form does not remove an existing value on save (`TalkGroupEdit` omits the field from the patch when blank). Channel edit explicitly clears via `abbreviation: undefined`. Consider fixing talk-group edit in a follow-up.

## Legacy `append` multi-TG name mode

`multiTalkGroupExportNameMode: 'append'` retains pre-#153 behaviour (append member label, then shorten). It remains in the UI for explicit opt-in but is not recommended when shorten names is on — TG-first modes are the default. Remove `append` once operators no longer need the escape hatch ([#153](https://github.com/pskillen/codeplug-tool/issues/153) follow-up).
