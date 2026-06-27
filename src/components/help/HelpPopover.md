# HelpPopover

## Purpose

Inline help icon that shows a short explanation in a popover and links to the matching `/help/:topic` page.

## Props

| Prop     | Type          | Notes                                    |
| -------- | ------------- | ---------------------------------------- |
| `helpId` | `HelpTopicId` | Lookup in `src/content/help/manifest.ts` |

## Usage

```tsx
import { HelpPopover } from '../help/index.ts';

<HelpPopover helpId="channel.rxGroupList" />;
```

## Related

- [help feature docs](../../../docs/features/help/README.md)
- [HelpMarkdown](./HelpMarkdown.md)
