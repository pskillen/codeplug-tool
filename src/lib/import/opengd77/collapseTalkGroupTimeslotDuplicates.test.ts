import { describe, expect, it } from 'vitest';
import {
  buildCodeplug,
  buildImportedRxGroupList,
  buildRglMember,
  buildTalkGroup,
} from '../../../test/builders/codeplug.ts';
import { collapseTalkGroupTimeslotDuplicates } from './collapseTalkGroupTimeslotDuplicates.ts';

describe('collapseTalkGroupTimeslotDuplicates', () => {
  it('rewires RGL members to survivor with per-slot timeslots from wire names', () => {
    const ts1 = buildTalkGroup({ id: 'tg-ts1', name: 'Scotland TS1', number: '2355' });
    const ts2 = buildTalkGroup({ id: 'tg-ts2', name: 'Scotland TS2', number: '2355' });
    const rgl = buildImportedRxGroupList(
      { id: 'rgl-1', name: 'Scotland' },
      ['Scotland TS1', 'Scotland TS2'],
    );
    const codeplug = buildCodeplug({ talkGroups: [ts1, ts2], rxGroupLists: [rgl] });

    const collapsed = collapseTalkGroupTimeslotDuplicates(codeplug);

    expect(collapsed.talkGroups).toHaveLength(1);
    expect(collapsed.talkGroups[0].name).toBe('Scotland');
    expect(collapsed.rxGroupLists[0].memberRefs).toEqual([
      buildRglMember({ kind: 'talkGroup', id: collapsed.talkGroups[0].id }, 1),
      buildRglMember({ kind: 'talkGroup', id: collapsed.talkGroups[0].id }, 2),
    ]);
  });

  it('rewires RGL members resolved to ids before collapse', () => {
    const ts1 = buildTalkGroup({ id: 'tg-ts1', name: 'Scotland TS1', number: '2355' });
    const ts2 = buildTalkGroup({ id: 'tg-ts2', name: 'Scotland TS2', number: '2355' });
    const rgl = buildImportedRxGroupList(
      { id: 'rgl-1', name: 'Scotland' },
      ['Scotland TS1', 'Scotland TS2'],
    );
    rgl.memberRefs = [
      buildRglMember({ kind: 'talkGroup', id: 'tg-ts1' }),
      buildRglMember({ kind: 'talkGroup', id: 'tg-ts2' }),
    ];
    const codeplug = buildCodeplug({ talkGroups: [ts1, ts2], rxGroupLists: [rgl] });

    const collapsed = collapseTalkGroupTimeslotDuplicates(codeplug);

    expect(collapsed.rxGroupLists[0].memberRefs).toEqual([
      buildRglMember({ kind: 'talkGroup', id: collapsed.talkGroups[0].id }, 1),
      buildRglMember({ kind: 'talkGroup', id: collapsed.talkGroups[0].id }, 2),
    ]);
  });
});
