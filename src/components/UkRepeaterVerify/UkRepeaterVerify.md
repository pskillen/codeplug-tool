# UkRepeaterVerify

## Purpose

On channel detail, query ukrepeater.net by callsign (or stored listing id), show a field diff, and apply selected updates.

## Props

| Prop      | Type      | Notes                  |
| --------- | --------- | ---------------------- |
| `channel` | `Channel` | Channel being verified |

## Behaviour

- No zone-membership warning on rename — UUID zone FKs are unaffected.
- Blocks apply when proposed name collides with another channel.
- Refreshes `meta.repeaterDirectory` snapshot on apply.

## Related

- [UkRepeaterSearch](../UkRepeaterSearch/UkRepeaterSearch.md)
- [repeater-directories docs](../../../docs/features/repeater-directories/README.md)
