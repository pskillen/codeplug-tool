import type { ChannelTimeslot } from '../../channelFields/index.ts';
import type { Codeplug, RxGroupListMember, TalkGroup } from '../../../models/codeplug.ts';
import { resolveMemberRefsByWireNames } from '../../entityRefs.ts';

const SLOT_SUFFIX = /\s+(?:T|TS)([12])$/i;

export interface ParsedTalkGroupWireName {
  stem: string;
  slot: ChannelTimeslot | null;
}

export function parseTalkGroupSlotWireName(name: string): ParsedTalkGroupWireName {
  const trimmed = name.trim();
  const match = SLOT_SUFFIX.exec(trimmed);
  if (match) {
    const slot = Number(match[1]) as ChannelTimeslot;
    return { stem: trimmed.slice(0, -match[0].length).trim(), slot };
  }
  return { stem: trimmed, slot: null };
}

/** Normalize slot-suffixed talk-group wire names for CPS round-trip compare (`T1` vs `TS1`). */
export function canonicalOpenGd77TalkGroupWireForCompare(wire: string): string {
  const trimmed = wire.trim();
  if (!trimmed || trimmed === 'None') return trimmed;
  const { stem, slot } = parseTalkGroupSlotWireName(trimmed);
  if (slot != null && stem) return `${stem}::${slot}`;
  return trimmed;
}

interface AbsorbEntry {
  survivorId: string;
  slot: ChannelTimeslot | null;
}

function groupKey(tg: TalkGroup): string | null {
  const number = tg.number.trim();
  return number.length > 0 ? number : null;
}

function buildAbsorbMap(talkGroups: TalkGroup[]): Map<string, AbsorbEntry> {
  const absorb = new Map<string, AbsorbEntry>();
  const byNumber = new Map<string, TalkGroup[]>();

  for (const tg of talkGroups) {
    const key = groupKey(tg);
    if (!key) continue;
    const list = byNumber.get(key) ?? [];
    list.push(tg);
    byNumber.set(key, list);
  }

  for (const group of byNumber.values()) {
    if (group.length === 1) {
      const only = group[0];
      const parsed = parseTalkGroupSlotWireName(only.name);
      if (parsed.slot != null && parsed.stem) {
        absorb.set(only.id, { survivorId: only.id, slot: parsed.slot });
      }
      continue;
    }

    const stems = group.map((tg) => parseTalkGroupSlotWireName(tg.name).stem);
    const uniqueStems = [...new Set(stems.filter((s) => s.length > 0))];
    if (uniqueStems.length !== 1) continue;

    const stem = uniqueStems[0];
    const survivor =
      group.find((tg) => tg.name.trim() === stem) ??
      group.find((tg) => !SLOT_SUFFIX.test(tg.name)) ??
      group[0];

    for (const tg of group) {
      const parsed = parseTalkGroupSlotWireName(tg.name);
      absorb.set(tg.id, {
        survivorId: survivor.id,
        slot: tg.id === survivor.id ? null : parsed.slot,
      });
    }
  }

  return absorb;
}

function rewireMemberRefs(
  memberRefs: RxGroupListMember[],
  absorb: Map<string, AbsorbEntry>,
  wireNames: string[] | undefined,
  talkGroups: TalkGroup[],
  contacts: Codeplug['contacts'],
): RxGroupListMember[] {
  if (wireNames?.length) {
    const { memberRefs: resolved } = resolveMemberRefsByWireNames(wireNames, talkGroups, contacts);
    return resolved.map((member, i) => {
      const wire = wireNames[i] ?? '';
      const parsed = parseTalkGroupSlotWireName(wire);
      if (member.ref.kind !== 'talkGroup') return member;
      const mapping = absorb.get(member.ref.id);
      const survivorId = mapping?.survivorId ?? member.ref.id;
      const slot = parsed.slot ?? mapping?.slot ?? member.timeslot ?? null;
      return slot != null ? { ref: { kind: 'talkGroup', id: survivorId }, timeslot: slot } : { ref: { kind: 'talkGroup', id: survivorId } };
    });
  }

  return memberRefs.map((member) => {
    if (member.ref.kind !== 'talkGroup') return member;
    const mapping = absorb.get(member.ref.id);
    if (!mapping) return member;
    const slot = mapping.slot ?? member.timeslot ?? null;
    return slot != null
      ? { ref: { kind: 'talkGroup', id: mapping.survivorId }, timeslot: slot }
      : { ref: { kind: 'talkGroup', id: mapping.survivorId } };
  });
}

/**
 * Best-effort collapse of per-slot talk group wire contacts into logical talk groups.
 * Rewires RGL membership slots and channel TX contact refs.
 */
export function collapseTalkGroupTimeslotDuplicates(codeplug: Codeplug): Codeplug {
  const absorb = buildAbsorbMap(codeplug.talkGroups);
  if (absorb.size === 0) return codeplug;

  const absorbedIds = new Set(
    [...absorb.entries()]
      .filter(([id, entry]) => id !== entry.survivorId)
      .map(([id]) => id),
  );

  const talkGroups = codeplug.talkGroups
    .filter((tg) => !absorbedIds.has(tg.id))
    .map((tg) => {
      const parsed = parseTalkGroupSlotWireName(tg.name);
      if (parsed.slot != null && parsed.stem && parsed.stem !== tg.name) {
        return { ...tg, name: parsed.stem };
      }
      const entry = absorb.get(tg.id);
      if (entry && entry.survivorId === tg.id && SLOT_SUFFIX.test(tg.name)) {
        return { ...tg, name: parsed.stem || tg.name };
      }
      return tg;
    });

  const rewireTalkGroupRef = (ref: { kind: 'talkGroup'; id: string } | { kind: 'contact'; id: string } | null) => {
    if (!ref || ref.kind !== 'talkGroup') return ref;
    const mapping = absorb.get(ref.id);
    if (!mapping) return ref;
    return { kind: 'talkGroup' as const, id: mapping.survivorId };
  };

  const channels = codeplug.channels.map((ch) => {
    const contactRef = rewireTalkGroupRef(ch.contactRef);
    const modeProfiles =
      ch.modeProfiles.length > 0
        ? ch.modeProfiles.map((profile) => ({
            ...profile,
            contactRef: rewireTalkGroupRef(profile.contactRef),
          }))
        : ch.modeProfiles;
    if (contactRef === ch.contactRef && modeProfiles === ch.modeProfiles) return ch;
    return { ...ch, contactRef, modeProfiles };
  });

  const rxGroupLists = codeplug.rxGroupLists.map((rgl) => ({
    ...rgl,
    memberRefs: rewireMemberRefs(
      rgl.memberRefs,
      absorb,
      rgl.meta?.imported?.memberWireNames,
      talkGroups,
      codeplug.contacts,
    ),
  }));

  return { ...codeplug, talkGroups, channels, rxGroupLists };
}
