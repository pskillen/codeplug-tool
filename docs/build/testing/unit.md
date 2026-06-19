# Unit tests

**Purpose:** Fast, colocated tests for pure functions and single-responsibility modules. See [format-fidelity.md](format-fidelity.md) for adapter integration and round-trip scenarios.

## Convention

- File name: `<module>.test.ts` or `<module>.test.tsx` beside the source file.
- Runner: Vitest (`npm test` runs all `src/**/*.test.ts(x)`).
- Environment: `jsdom` via [`vite.config.ts`](../../../vite.config.ts).
- Setup: [`src/test/setup.ts`](../../../src/test/setup.ts) — `@testing-library/jest-dom`, `matchMedia` mock, `localStorage` mock, `ResizeObserver` mock.

## Coverage expectation

**Every exported function in `src/lib/` should have unit test coverage** unless it is a thin re-export. Route and component tests are additive, not a substitute for lib coverage.

| Area | Example tests |
| --- | --- |
| Import/export | `parse.test.ts`, `index.test.ts`, `csvWrite.test.ts`, `importMerge.test.ts` |
| Codeplug helpers | `codeplug.test.ts`, `codeplugMutations.test.ts`, `channelLookup.test.ts` |
| Validation | `validation.test.ts` |
| Geo / map math | `geo.test.ts`, `geoDistance.test.ts`, `maidenhead.test.ts`, `mapView.test.ts` |
| CSV utilities | `csv.test.ts` |
| Store / persistence | `codeplugStorage.test.ts`, `codeplugStore.test.tsx` |

Adapter **integration** (import → export → re-import) belongs in `roundtrip.test.ts`, not duplicated across many unit files.

## Unit vs format-fidelity integration

| Unit | Format-fidelity integration |
| --- | --- |
| One CSV row → one channel object | Full bundle → model → serialise → re-import |
| `detectKind` by filename/headers | `importFiles` multi-file batch |
| Single serialiser column formatting | `stripIds` semantic equality |
| `previewImportMerge` counts for one entity | `runActiveImportWorkflow` end-to-end |

**Rule:** If the test needs more than one adapter call or crosses import+export boundary, prefer `roundtrip.test.ts` or [system tests](system.md).

## Deterministic ids

Parser and store assign `crypto.randomUUID()` in production. Tests that assert stable ids or snapshots should stub the generator:

```ts
import { resetIdGenerator, setIdGenerator } from '../../models/codeplug.ts';

beforeEach(() => {
  let n = 0;
  setIdGenerator(() => `id-${++n}`);
});

afterEach(() => {
  resetIdGenerator();
});
```

See [`roundtrip.test.ts`](../../../src/lib/export/opengd77/roundtrip.test.ts) and [`ImportIntoActivePanel.test.tsx`](../../../src/components/ImportIntoActivePanel/ImportIntoActivePanel.test.tsx).

## Mocking

- **localStorage:** global mock in `setup.ts`; call `localStorage.clear()` in `beforeEach` when tests mutate storage.
- **Geolocation / fetch:** `vi.stubGlobal` or `vi.spyOn` in the test file (`geolocation.test.ts`, `geocode.test.ts`).
- **crypto.randomUUID:** stub when ui tests need predictable project/entity ids.

## What does not belong here

- Multi-step import → merge → persist → reload ( [system.md](system.md) )
- File picker or download behaviour ( [e2e.md](e2e.md) )
- Full route navigation with real HashRouter URLs (component tests — [component.md](component.md) )

## Related

- [Testing hub](README.md)
- [Format fidelity](format-fidelity.md)
- [Fixtures](fixtures.md)
