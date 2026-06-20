# SummaryDashboard

## Purpose

Project dashboard for `/summary`: project metadata header, embedded channel map, and compact entity summary cards.

## Props

| Prop       | Type              | Notes                                          |
| ---------- | ----------------- | ---------------------------------------------- |
| `project`  | `CodeplugProject` | Active project wrapper (name, metadata fields) |
| `codeplug` | `Codeplug`        | Active codeplug content for counts and map     |

## Usage

```tsx
import SummaryDashboard from '../components/SummaryDashboard/SummaryDashboard.tsx';
import { useCodeplug, useProjects } from '../state/codeplugStore.tsx';

const { activeProject } = useProjects();
const { codeplug } = useCodeplug();

if (activeProject) {
  return <SummaryDashboard project={activeProject} codeplug={codeplug} />;
}
```

## Behaviour

- Page title is the project name; description, author, target radios, and notes render when set.
- Map shows geolocated channels via `CodeplugMap`; empty state links to `/channels` when none.
- Entity cards use compact [`SummaryCard`](../report/SummaryCard.tsx) in a responsive grid.
- **Edit project** navigates to `/summary/edit`.

## Related

- [`src/routes/Summary.tsx`](../../routes/Summary.tsx)
- [`docs/features/report/README.md`](../../../docs/features/report/README.md)
- [`docs/features/map/README.md`](../../../docs/features/map/README.md)
