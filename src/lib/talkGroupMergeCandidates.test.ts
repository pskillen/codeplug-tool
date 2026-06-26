import { describe, expect, it } from 'vitest';
import {
  buildChannel,
  buildCodeplug,
  buildRglMember,
  buildRxGroupList,
  buildTalkGroup,
} from '../test/builders/codeplug.ts';
import { mergeTalkGroupsIntoOne } from './codeplugMutations.ts';
import {
  applyTalkGroupMerges,
  findTalkGroupMergeCandidateGroups,
  previewTalkGroupMerges,
  type TalkGroupMergeSelection,
} from './talkGroupMergeCandidates.ts';

describe('talkGroupMergeCandidates', () => {
  it('findTalkGroupMergeCandidateGroups groups Scotland TS1/TS2 with same DMR ID', () => {
    const ts1 = buildTalkGroup({ id: 'tg-ts1', name: 'Scotland TS1', number: '2355' });
    const ts2 = buildTalkGroup({ id: 'tg-ts2', name: 'Scotland TS2', number: '2355' });
    const codeplug = buildCodeplug({ talkGroups: [ts1, ts2] });

    const groups = findTalkGroupMergeCandidateGroups(codeplug);
    expect(groups).toHaveLength(1);
    expect(groups[0].mergeKind).toBe('timeslotFamily');
    expect(groups[0].suggestedName).toBe('Scotland');
    expect(groups[0].sourceTalkGroupIds.sort()).toEqual(['tg-ts1', 'tg-ts2']);
  });

  it('findTalkGroupMergeCandidateGroups marks incompatible stems ambiguous', () => {
    const a = buildTalkGroup({ id: 'a', name: 'Scotland TS1', number: '2355' });
    const b = buildTalkGroup({ id: 'b', name: 'Wales TS1', number: '2355' });
    const groups = findTalkGroupMergeCandidateGroups(buildCodeplug({ talkGroups: [a, b] }));
    expect(groups).toHaveLength(1);
    expect(groups[0].mergeKind).toBe('ambiguous');
  });

  it('applyTalkGroupMerges merges talk groups and rewires RGL member slots', () => {
    const ts1 = buildTalkGroup({ id: 'tg-ts1', name: 'Scotland TS1', number: '2355' });
    const ts2 = buildTalkGroup({ id: 'tg-ts2', name: 'Scotland TS2', number: '2355' });
    const rgl = buildRxGroupList({
      id: 'rgl-1',
      name: 'Scotland',
      memberRefs: [
        buildRglMember({ kind: 'talkGroup', id: 'tg-ts1' }),
        buildRglMember({ kind: 'talkGroup', id: 'tg-ts2' }),
      ],
    });
    const ch = buildChannel({
      id: 'ch-1',
      name: 'Test',
      contactRef: { kind: 'talkGroup', id: 'tg-ts2' },
    });
    const codeplug = buildCodeplug({
      talkGroups: [ts1, ts2],
      rxGroupLists: [rgl],
      channels: [ch],
    });

    const groups = findTalkGroupMergeCandidateGroups(codeplug);
    const selection: TalkGroupMergeSelection = {
      groupId: groups[0].id,
      sourceTalkGroupIds: groups[0].sourceTalkGroupIds,
      resultName: 'Scotland',
      enabled: true,
    };

    const { codeplug: merged, report } = applyTalkGroupMerges(codeplug, [selection], groups);
    expect(report.mergedCount).toBe(1);
    expect(merged.talkGroups).toHaveLength(1);
    expect(merged.talkGroups[0].name).toBe('Scotland');
    expect(merged.rxGroupLists[0].memberRefs).toEqual([
      buildRglMember({ kind: 'talkGroup', id: merged.talkGroups[0].id }, 1),
      buildRglMember({ kind: 'talkGroup', id: merged.talkGroups[0].id }, 2),
    ]);
    expect(merged.channels[0].contactRef).toEqual({
      kind: 'talkGroup',
      id: merged.talkGroups[0].id,
    });
  });

  it('previewTalkGroupMerges reports RGL and channel impacts', () => {
    const ts1 = buildTalkGroup({ id: 'tg-ts1', name: 'Scotland TS1', number: '2355' });
    const ts2 = buildTalkGroup({ id: 'tg-ts2', name: 'Scotland TS2', number: '2355' });
    const rgl = buildRxGroupList({
      id: 'rgl-1',
      name: 'Hotspot',
      memberRefs: [buildRglMember({ kind: 'talkGroup', id: 'tg-ts1' })],
    });
    const codeplug = buildCodeplug({
      talkGroups: [ts1, ts2],
      rxGroupLists: [rgl],
      channels: [
        buildChannel({
          id: 'ch-1',
          name: 'GB7SM',
          contactRef: { kind: 'talkGroup', id: 'tg-ts1' },
        }),
      ],
    });
    const groups = findTalkGroupMergeCandidateGroups(codeplug);
    const selection: TalkGroupMergeSelection = {
      groupId: groups[0].id,
      sourceTalkGroupIds: groups[0].sourceTalkGroupIds,
      resultName: 'Scotland',
      enabled: true,
    };
    const [preview] = previewTalkGroupMerges(codeplug, [selection], groups);
    expect(preview.rglImpacts).toHaveLength(1);
    expect(preview.channelImpacts).toHaveLength(1);
    expect(preview.validationIssues.filter((i) => i.severity === 'error')).toHaveLength(0);
  });

  it('mergeTalkGroupsIntoOne keeps survivor id stable', () => {
    const ts1 = buildTalkGroup({ id: 'survivor', name: 'Scotland TS1', number: '2355' });
    const ts2 = buildTalkGroup({ id: 'absorbed', name: 'Scotland TS2', number: '2355' });
    const codeplug = buildCodeplug({ talkGroups: [ts1, ts2] });
    const merged = mergeTalkGroupsIntoOne(codeplug, 'survivor', ['absorbed'], {
      ...ts1,
      name: 'Scotland',
    });
    expect(merged.talkGroups).toHaveLength(1);
    expect(merged.talkGroups[0].id).toBe('survivor');
    expect(merged.talkGroups[0].name).toBe('Scotland');
  });
});
