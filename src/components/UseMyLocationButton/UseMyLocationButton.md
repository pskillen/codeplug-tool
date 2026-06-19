# UseMyLocationButton

## Purpose

Shared button that reads the operator’s **current device position** via the browser Geolocation API and passes WGS84 coordinates to the parent. Used on channel edit and the Maidenhead converter so operators can seed coordinates at their current QTH without manual entry.

Not to be confused with the converter’s channel **Use location** button, which copies coordinates from a selected codeplug channel.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `onLocation` | `(lat: number, lon: number) => void` | — | Called on successful geolocation; parent owns locator conversion and persistence |
| `disabled` | `boolean` | — | Disables the button (e.g. while form is read-only) |

## Usage

```tsx
import UseMyLocationButton from '../../components/UseMyLocationButton/UseMyLocationButton.tsx';

// Channel edit — sets lat/lon, locator, and useLocation via applyCoords
<UseMyLocationButton onLocation={(lat, lon) => applyCoords(lat, lon)} />

// Maidenhead converter — syncs lat/lon/locator at current precision
<UseMyLocationButton onLocation={(lat, lon) => applyCoords(lat, lon)} />
```

## Behaviour

- **User gesture only:** click triggers `navigator.geolocation.getCurrentPosition` (one-shot; no continuous tracking).
- **Loading:** Mantine button shows loading state while the request is pending.
- **Errors:** inline red text for permission denied, unavailable position, timeout, or insecure context; does not block the rest of the form.
- **Accuracy:** when the browser reports accuracy, shows dimmed helper text (e.g. `±12 m`).
- **Privacy:** position is not sent to any server; the component does not persist coordinates — parents save only when the user saves a channel or copies values manually.

## Related

- [`useGeolocation`](../../hooks/useGeolocation.ts) — React state wrapper
- [`geolocation.ts`](../../lib/geolocation.ts) — Geolocation API wrapper and typed errors
- [Maidenhead feature doc](../../../docs/features/maidenhead.md) — operator-facing behaviour and privacy
