# Channel modes

Canonical reference for channel mode labels, categories, UI pill colours, and form-field applicability. Implementation in `src/lib/channelModes.ts` must match this table.

## Categories

| Category | Meaning |
| --- | --- |
| `analog` | Analog voice modes — show RX/TX tone fields in the edit form |
| `digital` | Digital voice modes — hide tone fields; DMR-only fields apply only to `dmr` |
| `other` | Unknown or unclassified |

## Colour design

**One colour per mode.** Analog modes share a warm yellow family; digital modes use distinct hues so DMR, YSF, D-STAR, M17, and Tetra are distinguishable at a glance.

## Mode table

| ID | Label | Category | Hex | Mantine | OpenGD77 import | OpenGD77 export |
| --- | --- | --- | --- | --- | --- | --- |
| `fm` | FM | analog | `#f0c419` | `yellow.5` | `Analogue`, `Analog` | `Analogue` |
| `am` | AM | analog | `#fab005` | `yellow.6` | (manual) | `Analogue` |
| `ssb-usb` | SSB USB | analog | `#fd7e14` | `orange.6` | (manual) | `Analogue` |
| `ssb-lsb` | SSB LSB | analog | `#e8590c` | `orange.7` | (manual) | `Analogue` |
| `dmr` | DMR | digital | `#e03131` | `red.7` | `Digital` | `Digital` |
| `ysf` | YSF | digital | `#339af0` | `blue.5` | (manual) | `Digital` |
| `dstar` | D-STAR | digital | `#7950f2` | `violet.6` | (manual) | `Digital` |
| `m17` | M17 | digital | `#12b886` | `teal.6` | (manual) | `Digital` |
| `tetra` | Tetra | digital | `#868e96` | `gray.6` | (manual) | `Digital` |
| `other` | Other | other | `#9c36b5` | `grape.6` | unknown types | passthrough |

## Legacy migration (schema v2 → v3)

| Legacy value | New value |
| --- | --- |
| `analogue` | `fm` |
| `digital` | `dmr` |
| `other` | `other` |

## Form field applicability

| Field group | Applies when |
| --- | --- |
| RX/TX tone | `isAnalogMode(mode)` — `fm`, `am`, `ssb-usb`, `ssb-lsb` |
| Colour code, timeslot, DMR ID, contact, RX group list | `isDmrMode(mode)` — `dmr` only |
| (hidden) tones | `isDigitalMode(mode)` — all digital modes |

YSF, D-STAR, M17, and Tetra are digital but have no DMR-specific CPS columns in OpenGD77 today.

## Related

- [Display conventions](./display-conventions.md)
- [Data model](../features/data-model/README.md)
- [CRUD feature](../features/crud/README.md)
