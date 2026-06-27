import { describe, expect, it } from 'vitest';
import { buildNameToChannelId, resolveZoneMembers } from './codeplug.ts';
import { zoneMemberChannelIds } from './zones.ts';
import { buildGeolocatedChannel } from '../test/builders/index.ts';

describe('buildNameToChannelId', () => {
  it('is case-sensitive and first-wins', () => {
    const map = buildNameToChannelId([
      buildGeolocatedChannel({ id: 'a', name: 'Foo' }),
      buildGeolocatedChannel({ id: 'b', name: 'foo' }),
      buildGeolocatedChannel({ id: 'c', name: 'Foo' }),
    ]);
    expect(map.get('Foo')).toBe('a');
    expect(map.get('foo')).toBe('b');
    expect(map.size).toBe(2);
  });
});

describe('resolveZoneMembers', () => {
  it('resolves ids and reports unresolved names', () => {
    const nameToId = buildNameToChannelId([
      buildGeolocatedChannel({ id: 'id-a', name: 'A' }),
      buildGeolocatedChannel({ id: 'id-b', name: 'B' }),
    ]);
    const { members, unresolved } = resolveZoneMembers(['A', 'B', 'Missing', 'A'], nameToId);
    expect(zoneMemberChannelIds({ id: '', name: '', members })).toEqual(['id-a', 'id-b']);
    expect(unresolved).toEqual(['Missing']);
  });
});
