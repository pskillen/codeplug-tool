# In-app operator help

Operator-facing help for the SPA: **inline hints** at the point of use and a **`/help` hub** for longer walkthroughs. Tracks [#135](https://github.com/pskillen/codeplug-tool/issues/135).

## Implementation status

| Area | Status | Notes |
| --- | --- | --- |
| Content manifest (`src/content/help/`) | In progress | Typed help IDs; all copy in topic files |
| Help UI primitives (`src/components/help/`) | In progress | HelpPopover, HelpAlert, FormatVarianceTable, HelpMarkdown |
| Inline help (P1/P2 surfaces) | In progress | Per [help-surface-plan](../../reference/writing-styleguide/help-surface-plan.md) |
| Help hub (`/help`) | In progress | Topic pages + glossary |
| Cross-links from inline → hub | In progress | `learnMoreSlug` on each entry |

## Documentation map

| Doc | Role |
| --- | --- |
| [help-writing-styleguide.md](../../reference/writing-styleguide/help-writing-styleguide.md) | Voice, tone, jargon rules |
| [glossary-dev.md](../../reference/writing-styleguide/glossary-dev.md) | Developer glossary → user glossary |
| [feature-reference.md](../../reference/writing-styleguide/feature-reference.md) | Exact behaviour + format variance |
| [help-surface-plan.md](../../reference/writing-styleguide/help-surface-plan.md) | Per-route inline inventory |
| [help-progress.md](help-progress.md) | Execution log |
| [help-outstanding.md](help-outstanding.md) | Discovered debt |

## Architecture

- **Content:** `src/content/help/manifest.ts` — single registry; routes reference `HelpTopicId` values, never hard-code prose.
- **Variance:** `src/content/help/radioVariance.ts` — OpenGD77 / DM32 / CHIRP comparison tables for export-sensitive features.
- **UI:** `HelpPopover` (field), `HelpAlert` (page), `FormatVarianceTable` (format divergence).
- **Hub:** `/help` index + `/help/:topicId` renders markdown bodies from the manifest.

## Adding help

1. Add entry to the appropriate `src/content/help/topics/*.ts` file.
2. Register in `manifest.ts` if using a new topic file.
3. Wire `helpId` on `HelpHint`, `HelpAlert`, or `getHelpShort()` for descriptions.
4. Add `body` markdown for hub long-form; set `learnMoreSlug` for popover links.
5. Follow [help-writing-styleguide.md](../../reference/writing-styleguide/help-writing-styleguide.md).

## Related

- [operator-lifecycle.md](../workflows/operator-lifecycle.md) — hub spine
- [import-export hub](../import-export/README.md) — contributor I/O docs
