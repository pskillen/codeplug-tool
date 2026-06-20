# TargetRadiosEditor

## Purpose

Controlled bullet-list editor for indicative target-radio labels on a codeplug project. Operator annotations only — values are **not** used for import, export, or validation profiles.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string[]` | — | Current list of radio labels |
| `onChange` | `(items: string[]) => void` | — | Called when list changes (local form state until parent saves) |
| `label` | `string` | `'Target radios'` | Field label |
| `description` | `string` | notes-only helper text | Shown under label |

## Usage

```tsx
import TargetRadiosEditor from '../components/TargetRadiosEditor/TargetRadiosEditor.tsx';

<TargetRadiosEditor
  value={values.targetRadios}
  onChange={(targetRadios) => setValues((prev) => ({ ...prev, targetRadios }))}
/>
```

## Behaviour

- Existing items render as bullets with edit/delete actions; clicking the label opens inline edit.
- Inline edit commits on blur or Enter; Escape cancels; empty value removes the item.
- Trailing empty input adds a new item on blur or Enter when non-empty.
- Duplicate labels (case-insensitive) show an inline error and are not added.

## Related

- [`src/routes/project/edit.tsx`](../../routes/project/edit.tsx) — project metadata form
- [`docs/features/codeplug-project/README.md`](../../../docs/features/codeplug-project/README.md)
