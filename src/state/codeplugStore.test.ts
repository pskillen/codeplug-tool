import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { emptyCodeplug, setIdGenerator, resetIdGenerator } from '../models/codeplug.ts';
import type { ImportResult } from '../lib/import/types.ts';
import { deserializeCodeplug, serializeCodeplug } from './codeplugStore.tsx';

function channelsCsvResult(): ImportResult {
  return {
    channels: [
      {
        id: 'ch-1',
        name: 'A',
        callsign: 'A',
        mode: 'digital',
        rxFrequency: '',
        txFrequency: '',
        contactName: '',
        rxGroupListName: '',
        location: { lat: 56.5, lon: -4.0 },
        useLocation: true,
        number: '1',
      },
      {
        id: 'ch-2',
        name: 'B',
        callsign: 'B',
        mode: 'digital',
        rxFrequency: '',
        txFrequency: '',
        contactName: '',
        rxGroupListName: '',
        location: { lat: 57.0, lon: -3.5 },
        useLocation: true,
        number: '2',
      },
    ],
    recognised: ['Channels.csv'],
    skipped: [],
    errors: [],
  };
}

// Test reducer logic directly by importing applyImport pattern
import { buildNameToChannelId, resolveZoneMembers } from '../lib/codeplug.ts';
import { newId } from '../models/codeplug.ts';

function applyImportLike(state: ReturnType<typeof emptyCodeplug>, result: ImportResult) {
  const channels = result.channels ?? state.channels;
  const nameToId = buildNameToChannelId(channels);

  let zones;
  if (result.zones) {
    zones = result.zones.map((parsed) => {
      const { memberChannelIds } = resolveZoneMembers(parsed.memberNames, nameToId);
      return {
        id: newId(),
        name: parsed.name,
        sourceMemberNames: parsed.memberNames,
        memberChannelIds,
      };
    });
  } else {
    zones = state.zones.map((zone) => {
      const { memberChannelIds } = resolveZoneMembers(zone.sourceMemberNames, nameToId);
      return { ...zone, memberChannelIds };
    });
  }

  return { ...state, channels, zones };
}

describe('codeplug import merge semantics', () => {
  beforeEach(() => {
    let n = 0;
    setIdGenerator(() => `zone-${++n}`);
  });

  afterEach(() => {
    resetIdGenerator();
  });

  it('resolves zone member names to channel ids', () => {
    let state = emptyCodeplug();
    state = applyImportLike(state, channelsCsvResult());
    state = applyImportLike(state, {
      zones: [{ name: 'North', memberNames: ['A', 'B'] }],
      recognised: ['Zones.csv'],
      skipped: [],
      errors: [],
    });
    expect(state.zones).toHaveLength(1);
    expect(state.zones[0].memberChannelIds).toEqual(['ch-1', 'ch-2']);
    expect(state.zones[0].sourceMemberNames).toEqual(['A', 'B']);
  });

  it('re-resolves existing zones on channels-only re-import', () => {
    let state = emptyCodeplug();
    state = applyImportLike(state, channelsCsvResult());
    state = applyImportLike(state, {
      zones: [{ name: 'North', memberNames: ['A', 'B'] }],
      recognised: ['Zones.csv'],
      skipped: [],
      errors: [],
    });
    const zoneId = state.zones[0].id;

    state = applyImportLike(state, {
      channels: [
        {
          id: 'ch-new-a',
          name: 'A',
          callsign: 'A',
          mode: 'digital',
          rxFrequency: '',
          txFrequency: '',
          contactName: '',
          rxGroupListName: '',
          location: { lat: 56.5, lon: -4.0 },
          useLocation: true,
          number: '1',
        },
      ],
      recognised: ['Channels.csv'],
      skipped: [],
      errors: [],
    });

    expect(state.zones[0].id).toBe(zoneId);
    expect(state.zones[0].memberChannelIds).toEqual(['ch-new-a']);
  });
});

describe('serializeCodeplug / deserializeCodeplug', () => {
  it('round-trips a codeplug', () => {
    const cp = emptyCodeplug();
    const json = serializeCodeplug(cp);
    expect(deserializeCodeplug(json)).toEqual(cp);
  });

  it('rejects unknown schema versions', () => {
    const cp = emptyCodeplug();
    cp.meta.schemaVersion = 999;
    expect(deserializeCodeplug(serializeCodeplug(cp))).toBeNull();
  });
});
