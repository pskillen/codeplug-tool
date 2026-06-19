# ImportIntoActivePanel

## Purpose

Import OpenGD77 CSV files into the **active** codeplug from the Export page. Supports **Merge** (idempotent name-based delta) and **Overwrite** (replace per entity type) with a confirm modal before apply.

## Props

None — reads `codeplug` from `useCodeplug()` and applies via `useProjects().applyImportToActive`.

## Usage

```tsx
import ImportIntoActivePanel from '../components/ImportIntoActivePanel/ImportIntoActivePanel.tsx';

<ImportIntoActivePanel />
```

## Behaviour

1. Operator selects Merge or Overwrite.
2. `ImportDropzone` parses files; `previewImportMerge` runs before apply.
3. Confirm modal shows file summary, entity stats, overwrite warnings, unresolved zone members.
4. Confirm calls `applyImportToActive(result, mode)`; inline summary shown after apply.

## Related

- [import README](../../../docs/features/import/README.md)
- [`ImportDropzone`](../ImportDropzone/ImportDropzone.tsx)
- [`importMerge.ts`](../../lib/importMerge.ts)
