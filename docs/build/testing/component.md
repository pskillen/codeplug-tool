# Component tests

**Purpose:** React Testing Library (RTL) tests for UI wiring — user interactions, modal flows, provider context — without asserting CSV byte equality (that belongs in [format-fidelity](format-fidelity.md) and [system](system.md) layers).

## Stack

- **Vitest** + **jsdom** — same runner as unit tests (`npm test`).
- **@testing-library/react** — render, screen queries, `fireEvent` / `userEvent`.
- **@testing-library/jest-dom** — matchers (`toBeInTheDocument`, etc.) via [`src/test/setup.ts`](../../../src/test/setup.ts).

Import workflow UI also runs under `npm run test:system` when colocated with `ImportIntoActivePanel`.

## Provider wrapping

Components that read codeplug state need the same provider tree as production:

```tsx
<MantineProvider theme={theme} defaultColorScheme="dark">
  <MemoryRouter>
    <OperatorPositionProvider>
      <CodeplugProvider>
        <YourComponent />
      </CodeplugProvider>
    </OperatorPositionProvider>
  </MemoryRouter>
</MantineProvider>
```

Seed `localStorage` with `serializeProjects` when the test needs an active project — see [`ImportIntoActivePanel.test.tsx`](../../../src/components/ImportIntoActivePanel/ImportIntoActivePanel.test.tsx).

| Provider | When required |
| --- | --- |
| `CodeplugProvider` | Any codeplug / project / import apply |
| `OperatorPositionProvider` | Map location, maidenhead routes |
| `MantineProvider` | All Mantine components |
| `MemoryRouter` | Routes, `Link`, `useNavigate` |

## Examples

| Test file | Covers |
| --- | --- |
| [`App.test.tsx`](../../../src/App.test.tsx) | App shell, routing smoke |
| [`maidenhead.test.tsx`](../../../src/routes/reference/maidenhead.test.tsx) | Reference route render |
| [`ImportIntoActivePanel.test.tsx`](../../../src/components/ImportIntoActivePanel/ImportIntoActivePanel.test.tsx) | Mode select, drop files, modal preview, confirm/cancel |

### Import panel workflow (pattern)

1. Seed active project in `localStorage`.
2. Stub `crypto.randomUUID` for deterministic ids.
3. Render panel with `vendorFormat` prop.
4. Select merge/overwrite mode.
5. Fire `change` on hidden file input with [`loadFixture`](../../../src/test/opengd77/loadFixture.ts) `File[]`.
6. Assert modal shows expected added/updated/unchanged/removed copy.
7. Confirm → assert store updated; Cancel → assert unchanged.

## jsdom quirks

Handled globally in [`setup.ts`](../../../src/test/setup.ts):

- `window.matchMedia` — Mantine breakpoints
- `ResizeObserver` — layout components
- `localStorage` — in-memory mock

Map/Leaflet components may need additional mocks if tested in isolation; prefer route-level smoke tests or defer to e2e for map interaction.

## Scope boundaries

| Assert in component tests | Defer to other layers |
| --- | --- |
| Button enabled/disabled, modal open/close | Parser column mapping |
| Summary copy ("3 channels added") | Round-trip CSV equality |
| Mode selector state | localStorage corruption edge cases (system) |
| Navigation after confirm | ZIP file bytes (e2e) |

## Related

- [Testing hub](README.md)
- [System tests](system.md) — harness behind import confirm
- [E2e](e2e.md) — browser-only behaviour
