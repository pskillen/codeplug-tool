# ChannelModeProfilesEditor

Per-mode field editor for multi-mode channels ([#46](https://github.com/pskillen/codeplug-tool/issues/46)).

## Purpose

Tabbed form for `ChannelModeProfile` entries when `Channel.multiMode` is enabled on the channel edit page.

## Props

| Prop       | Type                      | Description                |
| ---------- | ------------------------- | -------------------------- |
| `profiles` | `ModeProfileFormValues[]` | Editable profile rows      |
| `codeplug` | `Codeplug`                | Contact/RGL option sources |
| `onChange` | `(profiles) => void`      | Profile list update        |

## Related

- [Channel edit route](../../routes/channels/edit.tsx)
- [Data model — multi-mode](../../../docs/features/data-model/README.md)
