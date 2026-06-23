import { describe, expect, it } from 'vitest';
import { buildNameToChannelId } from '../codeplug.ts';
import {
  buildChannel,
  buildCodeplug,
  buildRxGroupList,
  buildTalkGroup,
  buildZone,
} from '../../test/builders/codeplug.ts';
import { expandAllChannelsForExport, expandZoneMemberWireNames } from './index.ts';

describe('multiTalkgroupExport integration', () => {
  it('expandAllChannelsForExport produces m×n rows for multi-mode digital with RGL', () => {
    const tg1 = buildTalkGroup({ id: 'tg1', name: 'Scotland TS1' });
    const tg2 = buildTalkGroup({ id: 'tg2', name: 'Local 9' });
    const rgl = buildRxGroupList({
      id: 'rgl1',
      name: 'GB7GL',
      memberRefs: [
        { kind: 'talkGroup', id: 'tg1' },
        { kind: 'talkGroup', id: 'tg2' },
      ],
    });
    const codeplug = buildCodeplug({
      channels: [
        buildChannel({
          id: 'c1',
          name: 'GB7GL',
          mode: 'fm',
          multiMode: true,
          modeProfiles: [
            { mode: 'fm', bandwidthKHz: null, colourCode: null, timeslot: null, dmrId: null, rxTone: 'none', txTone: 'none', squelch: null, contactRef: null, rxGroupListId: null },
            { mode: 'dmr', bandwidthKHz: null, colourCode: 7, timeslot: 2, dmrId: null, rxTone: 'none', txTone: 'none', squelch: null, contactRef: null, rxGroupListId: 'rgl1' },
          ],
        }),
      ],
      talkGroups: [tg1, tg2],
      rxGroupLists: [rgl],
    });

    const rows = expandAllChannelsForExport(codeplug.channels, {
      expandTalkGroups: true,
      codeplug,
    });

    expect(rows).toHaveLength(3);
    expect(rows.filter((r) => r.mode === 'dmr')).toHaveLength(2);
    expect(rows.filter((r) => r.mode === 'fm')).toHaveLength(1);
  });

  it('buildNameToChannelId registers TG-expanded aliases for zone import', () => {
    const tg1 = buildTalkGroup({ id: 'tg1', name: 'Scotland TS1' });
    const rgl = buildRxGroupList({
      id: 'rgl1',
      name: 'GB7GL',
      memberRefs: [{ kind: 'talkGroup', id: 'tg1' }],
    });
    const ch = buildChannel({
      id: 'c1',
      name: 'GB7GL',
      mode: 'dmr',
      rxGroupListId: 'rgl1',
    });
    const codeplug = buildCodeplug({
      channels: [ch],
      talkGroups: [tg1],
      rxGroupLists: [rgl],
    });

    const map = buildNameToChannelId(codeplug.channels, {
      codeplug,
      expandTalkGroups: true,
    });

    expect(map.get('GB7GL Scotland TS1')).toBe('c1');
  });

  it('expandZoneMemberWireNames warns when fan-out exceeds cap', () => {
    const tg1 = buildTalkGroup({ id: 'tg1', name: 'TG1' });
    const tg2 = buildTalkGroup({ id: 'tg2', name: 'TG2' });
    const rgl = buildRxGroupList({
      id: 'rgl1',
      name: 'List',
      memberRefs: [
        { kind: 'talkGroup', id: 'tg1' },
        { kind: 'talkGroup', id: 'tg2' },
      ],
    });
    const ch = buildChannel({
      id: 'c1',
      name: 'Site',
      mode: 'dmr',
      rxGroupListId: 'rgl1',
    });
    const codeplug = buildCodeplug({
      channels: [ch],
      talkGroups: [tg1, tg2],
      rxGroupLists: [rgl],
    });
    const zone = buildZone({ id: 'z1', name: 'Z', memberChannelIds: ['c1'] });

    const { names, warnings } = expandZoneMemberWireNames(zone, codeplug.channels, {
      expandTalkGroups: true,
      codeplug,
      maxMembers: 1,
    });

    expect(names).toHaveLength(1);
    expect(warnings.some((w) => w.includes('exceeds'))).toBe(true);
  });
});
