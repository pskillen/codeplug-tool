import type { ChannelTimeslot } from './channelFields/index.ts';
import type { ChannelMode } from './channelModes.ts';
import { isDigitalMode } from './channelModes.ts';
import { parseTalkGroupSlotWireName } from './import/opengd77/collapseTalkGroupTimeslotDuplicates.ts';
import type {
  Channel,
  Codeplug,
  Contact,
  RxGroupList,
  RxGroupListMember,
  TalkGroup,
} from '../models/codeplug.ts';

export type EntityRefKind = 'talkGroup' | 'contact';

export interface EntityRef {
  kind: EntityRefKind;
  id: string;
}

/** Normalise absent OpenGD77 wire values to empty string. */
export function normaliseWireName(name: string | undefined | null): string {
  const trimmed = (name ?? '').trim();
  if (!trimmed || trimmed === 'None') return '';
  return trimmed;
}

export function entityRefKey(ref: EntityRef): string {
  return `${ref.kind}:${ref.id}`;
}

export function parseEntityRefKey(key: string): EntityRef | null {
  const match = /^(talkGroup|contact):(.+)$/.exec(key);
  if (!match) return null;
  return { kind: match[1] as EntityRefKind, id: match[2] };
}

export function entityRefsEqual(a: EntityRef | null, b: EntityRef | null): boolean {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  return a.kind === b.kind && a.id === b.id;
}

function parseMemberTimeslot(value: unknown): ChannelTimeslot | null {
  if (value === 1 || value === 2) return value;
  return null;
}

/** Build an RX group list member entry. */
export function rglMember(
  ref: EntityRef,
  timeslot: ChannelTimeslot | null = null,
): RxGroupListMember {
  return timeslot == null ? { ref } : { ref, timeslot };
}

/** Extract the entity ref from an RGL membership entry (or pass through legacy EntityRef). */
export function memberRefOnly(member: RxGroupListMember | EntityRef): EntityRef {
  if ('ref' in member && member.ref) return member.ref;
  return member as EntityRef;
}

/** Normalise persisted or legacy membership rows to RxGroupListMember. */
export function normalizeRxGroupListMember(raw: unknown): RxGroupListMember | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  if (obj.ref && typeof obj.ref === 'object') {
    const ref = obj.ref as EntityRef;
    if (ref.kind && ref.id) {
      const timeslot = parseMemberTimeslot(obj.timeslot);
      return timeslot == null ? { ref } : { ref, timeslot };
    }
  }
  if (obj.kind && obj.id) {
    return { ref: { kind: obj.kind as EntityRefKind, id: String(obj.id) } };
  }
  return null;
}

export function normalizeRxGroupListMembers(raw: unknown): RxGroupListMember[] {
  if (!Array.isArray(raw)) return [];
  const members: RxGroupListMember[] = [];
  for (const item of raw) {
    const member = normalizeRxGroupListMember(item);
    if (member) members.push(member);
  }
  return members;
}

export function rxGroupListMembersEqual(
  a: RxGroupListMember[],
  b: RxGroupListMember[],
): boolean {
  if (a.length !== b.length) return false;
  return a.every((member, i) => {
    const other = b[i];
    if (!other) return false;
    if (!entityRefsEqual(member.ref, other.ref)) return false;
    return (member.timeslot ?? null) === (other.timeslot ?? null);
  });
}

export function resolveContactRefByWireName(
  name: string,
  talkGroups: TalkGroup[],
  contacts: Contact[],
): EntityRef | null {
  const wire = normaliseWireName(name);
  if (!wire) return null;

  const tg = talkGroups.find((t) => t.name === wire);
  if (tg) return { kind: 'talkGroup', id: tg.id };

  const contact = contacts.find((c) => c.name === wire);
  if (contact) return { kind: 'contact', id: contact.id };

  const parsed = parseTalkGroupSlotWireName(wire);
  if (parsed.stem && parsed.stem !== wire) {
    const byStem = resolveContactRefByWireName(parsed.stem, talkGroups, contacts);
    if (byStem) return byStem;
  }

  const stemMatches = talkGroups.filter(
    (t) => parseTalkGroupSlotWireName(t.name).stem === wire,
  );
  if (stemMatches.length === 1) {
    return { kind: 'talkGroup', id: stemMatches[0].id };
  }

  return null;
}

export function resolveRxGroupListIdByName(
  name: string,
  rxGroupLists: RxGroupList[],
): string | null {
  const wire = normaliseWireName(name);
  if (!wire) return null;
  const list = rxGroupLists.find((r) => r.name === wire);
  return list?.id ?? null;
}

export function resolveMemberRefsByWireNames(
  names: string[],
  talkGroups: TalkGroup[],
  contacts: Contact[],
): { memberRefs: RxGroupListMember[]; unresolved: string[] } {
  const memberRefs: RxGroupListMember[] = [];
  const unresolved: string[] = [];
  const seen = new Set<string>();

  const memberKey = (member: RxGroupListMember) =>
    member.timeslot != null
      ? `${entityRefKey(member.ref)}:${member.timeslot}`
      : entityRefKey(member.ref);

  for (const rawName of names) {
    const wire = normaliseWireName(rawName);
    if (!wire) continue;
    if (seen.has(wire)) continue;
    seen.add(wire);

    const parsed = parseTalkGroupSlotWireName(wire);
    let ref = resolveContactRefByWireName(wire, talkGroups, contacts);
    if (!ref && parsed.stem) {
      ref = resolveContactRefByWireName(parsed.stem, talkGroups, contacts);
    }
    if (ref) {
      const member =
        parsed.slot != null && ref.kind === 'talkGroup'
          ? rglMember(ref, parsed.slot)
          : { ref };
      const key = memberKey(member);
      if (!memberRefs.some((m) => memberKey(m) === key)) {
        memberRefs.push(member);
      }
    } else {
      unresolved.push(wire);
    }
  }

  return { memberRefs, unresolved };
}

export function findTalkGroupById(id: string, talkGroups: TalkGroup[]): TalkGroup | null {
  return talkGroups.find((tg) => tg.id === id) ?? null;
}

export function findContactById(id: string, contacts: Contact[]): Contact | null {
  return contacts.find((c) => c.id === id) ?? null;
}

export function entityRefDisplayName(
  ref: EntityRef | null,
  talkGroups: TalkGroup[],
  contacts: Contact[],
): string | null {
  if (!ref) return null;
  if (ref.kind === 'talkGroup') {
    return findTalkGroupById(ref.id, talkGroups)?.name ?? null;
  }
  return findContactById(ref.id, contacts)?.name ?? null;
}

export interface EntityRefExportLabelOptions {
  /** Use `TalkGroup.abbreviation` for talk-group refs at export. */
  useAbbreviation?: boolean;
}

/** Export wire label for an entity ref — may use talk-group abbreviation. */
export function entityRefExportLabel(
  ref: EntityRef | null,
  talkGroups: TalkGroup[],
  contacts: Contact[],
  options: EntityRefExportLabelOptions = {},
): string | null {
  if (!ref) return null;
  if (ref.kind === 'talkGroup') {
    const tg = findTalkGroupById(ref.id, talkGroups);
    if (!tg) return null;
    const abbrev = tg.abbreviation?.trim();
    if (options.useAbbreviation && abbrev) return abbrev;
    return tg.name;
  }
  return findContactById(ref.id, contacts)?.name ?? null;
}

export function memberRefsToWireNames(
  memberRefs: RxGroupListMember[],
  talkGroups: TalkGroup[],
  contacts: Contact[],
): string[] {
  const names: string[] = [];
  for (const member of memberRefs) {
    const name = entityRefDisplayName(member.ref, talkGroups, contacts);
    if (name) names.push(name);
  }
  return names;
}

export function resolveRxGroupListMemberRefs(
  rxGroupLists: RxGroupList[],
  talkGroups: TalkGroup[],
  contacts: Contact[],
): RxGroupList[] {
  return rxGroupLists.map((rgl) => {
    const wireNames = rgl.meta?.imported?.memberWireNames;
    if (wireNames === undefined) return rgl;
    const { memberRefs } = resolveMemberRefsByWireNames(wireNames, talkGroups, contacts);
    if (rxGroupListMembersEqual(rgl.memberRefs, memberRefs)) {
      return rgl;
    }
    return { ...rgl, memberRefs };
  });
}
export function resolveChannelRxGroupListIds(
  channels: Channel[],
  rxGroupLists: RxGroupList[],
): Channel[] {
  return channels.map((ch) => {
    const wireName = ch.meta?.imported?.rxGroupListWireName;
    if (wireName === undefined) return ch;
    const rxGroupListId = resolveRxGroupListIdByName(wireName, rxGroupLists);
    if (ch.rxGroupListId === rxGroupListId) return ch;
    return { ...ch, rxGroupListId };
  });
}

export function resolveChannelContactRefs(
  channels: Channel[],
  talkGroups: TalkGroup[],
  contacts: Contact[],
): Channel[] {
  return channels.map((ch) => {
    const wireName = ch.meta?.imported?.contactWireName;
    if (wireName === undefined) return ch;
    const contactRef = resolveContactRefByWireName(wireName, talkGroups, contacts);
    if (entityRefsEqual(ch.contactRef, contactRef)) return ch;
    return { ...ch, contactRef };
  });
}

export interface ChannelContactExportSource {
  mode: ChannelMode;
  contactRef: EntityRef | null;
}

export interface ChannelRxListExportSource {
  mode: ChannelMode;
  rxGroupListId: string | null;
}

export function contactRefWireNameForExport(
  channel: ChannelContactExportSource,
  codeplug: Codeplug,
): string {
  const name = entityRefDisplayName(channel.contactRef, codeplug.talkGroups, codeplug.contacts);
  if (name) return name;
  if (isDigitalMode(channel.mode)) return 'None';
  return '';
}

export function rxGroupListWireNameForExport(
  channel: ChannelRxListExportSource,
  codeplug: Codeplug,
): string {
  if (!channel.rxGroupListId) {
    return isDigitalMode(channel.mode) ? 'None' : '';
  }
  const list = codeplug.rxGroupLists.find((r) => r.id === channel.rxGroupListId);
  return list?.name ?? '';
}
