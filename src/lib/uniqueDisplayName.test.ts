import { describe, expect, it } from 'vitest';
import { emptyCodeplug } from '../models/codeplug.ts';
import { buildChannel, buildContact, buildTalkGroup } from '../test/builders/index.ts';
import {
  collectChannelNames,
  collectTalkGroupContactNames,
  uniqueDisplayName,
} from './uniqueDisplayName.ts';

describe('uniqueDisplayName', () => {
  it('returns base when unused', () => {
    expect(uniqueDisplayName('Scotland', new Set())).toBe('Scotland');
  });

  it('appends (copy) then numeric suffix', () => {
    const taken = new Set(['Scotland', 'Scotland (copy)']);
    expect(uniqueDisplayName('Scotland', taken)).toBe('Scotland (2)');
  });
});

describe('collectChannelNames', () => {
  it('collects channel display names', () => {
    const cp = {
      ...emptyCodeplug(),
      channels: [buildChannel({ id: 'a', name: 'A' }), buildChannel({ id: 'b', name: 'B' })],
    };
    expect(collectChannelNames(cp)).toEqual(new Set(['A', 'B']));
  });
});

describe('collectTalkGroupContactNames', () => {
  it('merges talk group and contact namespaces', () => {
    const cp = {
      ...emptyCodeplug(),
      talkGroups: [buildTalkGroup({ id: 'tg', name: 'TG' })],
      contacts: [buildContact({ id: 'c', name: 'Contact' })],
    };
    expect(collectTalkGroupContactNames(cp)).toEqual(new Set(['TG', 'Contact']));
  });
});
