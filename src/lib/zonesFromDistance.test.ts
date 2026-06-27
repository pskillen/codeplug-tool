import { describe, expect, it } from 'vitest';
import { emptyCodeplug } from '../models/codeplug.ts';
import { buildChannel } from '../test/builders/index.ts';
import { channelsInRange, defaultZoneFromDistanceName } from './zonesFromDistance.ts';

describe('zonesFromDistance', () => {
  const centre = { lat: 53.8, lon: -1.55, label: 'Leeds' };

  it('returns channels sorted nearest-first within radius', () => {
    const near = buildChannel({
      id: 'near',
      name: 'Near',
      useLocation: true,
      location: { lat: 53.81, lon: -1.54 },
    });
    const far = buildChannel({
      id: 'far',
      name: 'Far',
      useLocation: true,
      location: { lat: 54.5, lon: -1.0 },
    });
    const unlocated = buildChannel({ id: 'x', name: 'X', useLocation: false });

    const cp = { ...emptyCodeplug(), channels: [far, unlocated, near] };
    const inRange = channelsInRange(cp.channels, centre, 50);

    expect(inRange.map((r) => r.channel.id)).toEqual(['near']);
    expect(inRange[0].distanceM).toBeGreaterThan(0);
  });

  it('builds a default zone name from centre label', () => {
    expect(defaultZoneFromDistanceName(25, centre)).toBe('Within 25 km of Leeds');
  });
});
