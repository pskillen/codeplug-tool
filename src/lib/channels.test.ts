import { describe, expect, it } from 'vitest';
import { channelFieldDefaults, type Channel } from '../models/codeplug.ts';
import {
  applyFilters,
  buildChannelById,
  dominantMode,
  groupByCoords,
  markerColor,
  markerLabel,
  zoneGeolocatedPoints,
} from './channels.ts';
import type { Zone } from '../models/codeplug.ts';

function ch(overrides: Partial<Channel> & Pick<Channel, 'id' | 'name'>): Channel {
  return {
    callsign: overrides.name.split(/\s+/)[0],
    mode: 'digital',
    ...channelFieldDefaults(),
    number: '1',
    location: { lat: 56.5, lon: -4.0 },
    useLocation: true,
    ...overrides,
  };
}

describe('markerColor', () => {
  it('maps analogue and digital modes', () => {
    expect(markerColor('analogue')).toBe('#f0c419');
    expect(markerColor('digital')).toBe('#e03131');
    expect(markerColor('other')).toBe('#9c36b5');
  });
});

describe('applyFilters', () => {
  const channels = [
    ch({ id: '1', name: 'A', location: null }),
    ch({ id: '2', name: 'B', location: { lat: 0, lon: 0 } }),
    ch({ id: '3', name: 'C', useLocation: false }),
    ch({ id: '4', name: 'D' }),
  ];

  it('skips missing coords, 0,0, and Use Location=No', () => {
    const { plotted, skipped } = applyFilters(channels, {
      requireUseLocation: true,
      skipZero: true,
    });
    expect(plotted).toHaveLength(1);
    expect(plotted[0].name).toBe('D');
    expect(skipped).toHaveLength(3);
    expect(skipped.map((s) => s.reason)).toContain('missing coordinates');
    expect(skipped.map((s) => s.reason)).toContain('0,0 coordinates');
    expect(skipped.map((s) => s.reason)).toContain('Use Location = No');
  });
});

describe('groupByCoords', () => {
  const list = [
    ch({ id: '1', name: 'A', location: { lat: 56.5, lon: -4.0 } }),
    ch({ id: '2', name: 'B', location: { lat: 56.5, lon: -4.0 } }),
    ch({ id: '3', name: 'C', location: { lat: 57.0, lon: -3.5 } }),
  ];

  it('merges co-located channels when merge is true', () => {
    expect(groupByCoords(list, true)).toHaveLength(2);
    expect(groupByCoords(list, true)[0]).toHaveLength(2);
  });

  it('returns one group per channel when merge is false', () => {
    expect(groupByCoords(list, false)).toHaveLength(3);
  });
});

describe('dominantMode', () => {
  it('returns digital when majority are digital', () => {
    const group = [
      ch({ id: '1', name: 'A', mode: 'digital' }),
      ch({ id: '2', name: 'B', mode: 'analogue' }),
    ];
    expect(dominantMode(group)).toBe('digital');
  });

  it('returns analogue when digital is minority', () => {
    const group = [
      ch({ id: '1', name: 'A', mode: 'digital' }),
      ch({ id: '2', name: 'B', mode: 'analogue' }),
      ch({ id: '3', name: 'C', mode: 'analogue' }),
    ];
    expect(dominantMode(group)).toBe('analogue');
  });
});

describe('markerLabel', () => {
  it('uses callsign by default and full name when requested', () => {
    const group = [ch({ id: '1', name: 'GB3DA DMR' })];
    expect(markerLabel(group, false)).toBe('GB3DA');
    expect(markerLabel(group, true)).toBe('GB3DA DMR');
  });

  it('appends +N for merged groups', () => {
    const group = [
      ch({ id: '1', name: 'GB3DA DMR' }),
      ch({ id: '2', name: 'GB3DA FM' }),
    ];
    expect(markerLabel(group, false)).toBe('GB3DA +1');
  });
});

describe('zoneGeolocatedPoints', () => {
  const allChannels = [
    ch({ id: 'id-a', name: 'A', location: { lat: 56.5, lon: -4.0 } }),
    ch({ id: 'id-b', name: 'B', location: { lat: 56.5, lon: -4.0 } }),
  ];
  const zone: Zone = {
    id: 'z1',
    name: 'North',
    memberChannelIds: ['id-a', 'id-b'],
    sourceMemberNames: ['A', 'B', 'Missing'],
  };
  const plottedById = buildChannelById(allChannels);

  it('resolves plotted members and reports missing', () => {
    const { points, missing } = zoneGeolocatedPoints(zone, plottedById, allChannels, {
      requireUseLocation: true,
      skipZero: true,
    });
    expect(points).toHaveLength(1);
    expect(missing.some((m) => m.reason === 'not in Channels.csv')).toBe(true);
  });
});
