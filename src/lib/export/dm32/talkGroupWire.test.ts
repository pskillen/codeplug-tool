import { describe, expect, it } from 'vitest';
import { buildTalkGroup } from '../../../test/builders/codeplug.ts';
import {
  buildDm32TalkGroupWireNameMap,
  talkGroupWireNameForDm32Export,
} from './talkGroupWire.ts';
import { DEFAULT_DM32_PROFILE_ID } from '../../dm32/profiles.ts';

describe('export/dm32/talkGroupWire', () => {
  it('keeps short names unchanged', () => {
    const reserved = new Set<string>();
    const tg = buildTalkGroup({ id: 'tg-1', name: 'Local', number: '9' });
    expect(talkGroupWireNameForDm32Export(tg, 16, reserved)).toBe('Local');
  });

  it('uses abbreviation when name exceeds profile limit', () => {
    const reserved = new Set<string>();
    const tg = buildTalkGroup({
      id: 'tg-1',
      name: 'Scotland West Region',
      abbreviation: 'Scot West',
      number: '23559',
    });
    expect(talkGroupWireNameForDm32Export(tg, 16, reserved)).toBe('Scot West');
  });

  it('shortens when abbreviation is still too long', () => {
    const reserved = new Set<string>();
    const tg = buildTalkGroup({
      id: 'tg-1',
      name: 'International Emergency Network',
      abbreviation: 'International Emer',
      number: '1',
    });
    const wire = talkGroupWireNameForDm32Export(tg, 16, reserved);
    expect(wire.length).toBeLessThanOrEqual(16);
    expect(wire).not.toBe('International Emer');
  });

  it('builds a shared map used for channel and list FK columns', () => {
    const tg = buildTalkGroup({
      id: 'tg-1',
      name: 'Very Long Talk Group Name',
      abbreviation: 'VL TGN',
      number: '1',
    });
    const map = buildDm32TalkGroupWireNameMap([tg], { profileId: DEFAULT_DM32_PROFILE_ID });
    expect(map.get('tg-1')).toBe('VL TGN');
  });
});
