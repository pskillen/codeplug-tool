# BrandMeisterSearch

## Purpose

Search the BrandMeister network (Halligan API v2) and add DMR repeater devices as channels to the active codeplug.

## Usage

```tsx
// Route: /channels/add-from-brandmeister
import BrandMeisterSearch from '../components/BrandMeisterSearch/BrandMeisterSearch.tsx';
```

## Behaviour

- Search by callsign or numeric BrandMeister device id.
- Maps device `tx`/`rx` (repeater-side MHz) to channel `rxFrequency`/`txFrequency` (Hz) with inversion.
- Stamps `meta.repeaterDirectory` with `sourceId: 'brandmeister'` for later verify.
- Skips devices without frequency data; warns on name collisions.

## Related

- [brandmeister.md](../../../docs/features/repeater-directories/brandmeister.md) — contributor guide
- [BrandMeister reference](../../../docs/reference/brandmeister/README.md)
- [repeater-directories feature](../../../docs/features/repeater-directories/README.md)
