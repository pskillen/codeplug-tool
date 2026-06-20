# SummaryCard

## Purpose

Overview card on the Summary page (`/summary`): entity type title, total count, a short preview of names, and a link to the full list route.

## Props

| Prop           | Type        | Notes                                                               |
| -------------- | ----------- | ------------------------------------------------------------------- |
| `title`        | `string`    | Card heading (e.g. `"Channels"`, `"Talk groups"`)                   |
| `count`        | `number`    | Total entities                                                      |
| `previewNames` | `string[]`  | Up to ~5 names; caller slices/sorts before passing                  |
| `listPath`     | `string`    | Hash route for “View all” link                                      |
| `icon`         | `ReactNode` | Optional Tabler icon beside the title (matches navbar entity icons) |
| `compact`      | `boolean`   | Smaller card with up to 3 preview names (Summary dashboard)         |

## Usage

```tsx
import SummaryCard from '../components/report/SummaryCard.tsx';
import { sortByName } from '../lib/reportLookup.ts';

const preview = sortByName(channels)
  .slice(0, 5)
  .map((c) => c.name);

<SummaryCard
  title="Channels"
  count={channels.length}
  previewNames={preview}
  listPath="/channels"
  icon={<IconAntenna size={16} stroke={1.5} />}
/>;
```

## Behaviour

- Shows “None” when `previewNames` is empty.
- Preview names truncate with ellipsis on overflow.
- Laid out in a responsive `SimpleGrid` on [`SummaryDashboard`](../SummaryDashboard/SummaryDashboard.tsx) (compact mode).

## Related

- [`src/components/SummaryDashboard/SummaryDashboard.tsx`](../SummaryDashboard/SummaryDashboard.tsx)
