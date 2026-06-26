# BrandMeisterVerify

## Purpose

On channel, talk group, or RX group list detail, query BrandMeister and compare against local entities with selective apply.

## Usage

```tsx
import BrandMeisterVerify from '../BrandMeisterVerify/BrandMeisterVerify.tsx';
import BrandMeisterTalkGroupVerify from '../BrandMeisterVerify/BrandMeisterTalkGroupVerify.tsx';
import BrandMeisterRxListVerify from '../BrandMeisterVerify/BrandMeisterRxListVerify.tsx';
```

## Behaviour

- **Channel:** fetch by stored device id or callsign; diff frequencies, colour code, location, comment.
- **Talk group:** fetch `/talkgroup/{id}` catalogue name vs local name.
- **RX list:** requires a linked BrandMeister channel; compares static talk group membership.

## Related

- [BrandMeisterSearch](../BrandMeisterSearch/BrandMeisterSearch.md)
- [BrandMeister reference](../../../docs/reference/brandmeister/README.md)
