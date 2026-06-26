import type { Codeplug, RxGroupList } from '../../../models/codeplug.ts';
import type { BrandMeisterStaticTalkgroup } from './types.ts';
import { staticTalkgroupSlots } from './mapTalkGroups.ts';
import { entityRefDisplayName } from '../../entityRefs.ts';
import type { EntityDiffRow } from './entityDiff.ts';

export function findBrandMeisterDeviceIdForRxList(
  rgl: RxGroupList,
  codeplug: Codeplug,
): number | null {
  const channel = codeplug.channels.find(
    (ch) =>
      ch.rxGroupListId === rgl.id &&
      ch.meta?.repeaterDirectory?.sourceId === 'brandmeister' &&
      ch.meta.repeaterDirectory.remoteListingId != null,
  );
  return channel?.meta?.repeaterDirectory?.remoteListingId ?? null;
}

export function diffRxGroupListFromBrandMeister(
  rgl: RxGroupList,
  staticTalkgroups: BrandMeisterStaticTalkgroup[],
  codeplug: Codeplug,
): EntityDiffRow[] {
  const remoteSlots = staticTalkgroupSlots(staticTalkgroups);
  const localMembers = rgl.memberRefs
    .filter((m) => m.ref.kind === 'talkGroup')
    .map((m) => {
      const tg = codeplug.talkGroups.find((t) => t.id === m.ref.id);
      return {
        number: tg?.number.trim() ?? '?',
        timeslot: m.timeslot ?? null,
        name: entityRefDisplayName(m.ref, codeplug.talkGroups, codeplug.contacts),
      };
    });

  const remoteLabel = remoteSlots
    .map((s) => `TG ${s.number}${s.timeslot ? ` TS${s.timeslot}` : ''}`)
    .join(', ');
  const localLabel =
    localMembers.map((m) => `${m.name} (${m.number})${m.timeslot ? ` TS${m.timeslot}` : ''}`).join(', ') ||
    '—';

  const remoteSet = new Set(
    remoteSlots.map((s) => `${s.number}:${s.timeslot ?? ''}`),
  );
  const localSet = new Set(
    localMembers.map((m) => `${m.number}:${m.timeslot ?? ''}`),
  );

  const changed =
    remoteSet.size !== localSet.size ||
    [...remoteSet].some((k) => !localSet.has(k)) ||
    [...localSet].some((k) => !remoteSet.has(k));

  return [
    {
      field: 'members',
      label: 'Members',
      local: localLabel,
      remote: remoteLabel || '—',
      changed,
    },
  ];
}
