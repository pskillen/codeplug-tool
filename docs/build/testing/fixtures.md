# Test fixtures

**Purpose:** Where CPS test data lives, how to load it, and how to normalise before comparing import/export output.

## Committed vs local

| Location | Committed | Use |
| --- | --- | --- |
| `src/test/opengd77/` | Yes | Synthetic bundles for system and component tests |
| `src/test/chirp/` | Yes | Minimal CHIRP CSV bundles for parse/round-trip |
| `sample-exports/` | Mixed | Operator/manual testing — personal codeplugs stay gitignored; reference subsets (e.g. CHIRP samples from #101) may be committed for local realism |
| `e2e/fixtures/` (future) | Yes when [#40](https://github.com/pskillen/codeplug-tool/issues/40) lands | Minimal bundle for Playwright import → export |

**Privacy:** Committed fixtures must be **synthetic and minimal**. If real OpenGD77 exports are needed for realism, copy a **sanitised subset** into `src/test/opengd77/` — strip operator identifiers, reduce row count, verify no secrets.

## Layout

```
src/test/opengd77/
  bundles.ts       # CSV string maps keyed by filename
  loadFixture.ts   # loadFixture(bundle) → File[]
```

```
src/test/chirp/
  bundles.ts       # CHIRP CSV string maps (minimal, TSQL)
```

Per-vendor layout as adapters grow:

```
src/test/<vendor>/
  bundles.ts
  loadFixture.ts
```

## Bundle conventions

- Use real column headers from [`columns.ts`](../../../src/lib/import/opengd77/columns.ts) — keeps fixtures aligned with reference docs.
- Include **cross-file FKs** where the scenario needs them (channel names in zones, contacts in TG lists).
- Name bundles by scenario: `minimalBundle`, `channelsOnlyBundle`, `modifiedChannelBundle`, etc.
- Export named bundles from `bundles.ts`; load via `loadFixture()` or `filesFromBundle()`.

```ts
import { minimalBundle, loadFixture } from '../../test/opengd77/loadFixture.ts';

const files = loadFixture(minimalBundle);
await runActiveImportWorkflow({ codeplug, files, mode: 'merge' });
```

## Inline CSV vs shared bundle

| Prefer inline | Prefer committed bundle |
| --- | --- |
| Single-row parser edge case in `parse.test.ts` | Multi-step system scenario |
| One column variant | Incremental import (channels → zones → contacts) |
| Quick regression for a conversion fn | RTL test dropping same files as system suite |

Shared bundles keep system and component tests aligned on the same data.

## Normalisation for compares

Use consistently across round-trip, system, and e2e file diffs. Detail in [format-fidelity.md](format-fidelity.md).

### Semantic model compare (Vitest)

Strip runtime-only fields before `toEqual`:

- `id` on all entities
- `memberChannelIds` on zones (derive from `sourceMemberNames` / names)
- Optionally `meta.importedAt`, `meta.sourceFiles` if not under test

Pattern: `stripIds()` in [`roundtrip.test.ts`](../../../src/lib/export/opengd77/roundtrip.test.ts).

### App-only fields

Fields not present in vendor CSV (e.g. `hideFromMap`) are **excluded** from vendor round-trip assertions but must be preserved through merge — assert in system tests.

### File-level diff (e2e, planned)

Before comparing exported CSV to fixture:

1. Normalise line endings (`\r\n` → `\n`)
2. Trim trailing whitespace per line
3. Ensure single trailing newline (or document CPS convention)
4. Compare substantive files: `Channels.csv`, `Zones.csv`, `Contacts.csv`, `TG_Lists.csv`
5. DTMF/APRS: expect header-only if asserted

Parse by **header name** when semantic comparison is required; raw text diff is acceptable when round-trip should be byte-stable.

## Related

- [Format fidelity](format-fidelity.md)
- [System tests](system.md)
- [OpenGD77 reference](../../reference/opengd77/README.md)
