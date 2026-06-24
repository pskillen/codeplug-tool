import type { ChannelMode } from './channelModes.ts';
import { isDigitalMode } from './channelModes.ts';
import type { Channel, Codeplug, Contact, RxGroupList, TalkGroup } from '../models/codeplug.ts';

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
): { memberRefs: EntityRef[]; unresolved: string[] } {
  const memberRefs: EntityRef[] = [];
  const unresolved: string[] = [];
  const seen = new Set<string>();

  for (const rawName of names) {
    const wire = normaliseWireName(rawName);
    if (!wire) continue;
    if (seen.has(wire)) continue;
    seen.add(wire);

    const ref = resolveContactRefByWireName(wire, talkGroups, contacts);
    if (ref) {
      const key = entityRefKey(ref);
      if (!memberRefs.some((r) => entityRefKey(r) === key)) {
        memberRefs.push(ref);
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
  memberRefs: EntityRef[],
  talkGroups: TalkGroup[],
  contacts: Contact[],
): string[] {
  const names: string[] = [];
  for (const ref of memberRefs) {
    const name = entityRefDisplayName(ref, talkGroups, contacts);
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
    if (
      rgl.memberRefs.length === memberRefs.length &&
      rgl.memberRefs.every((ref, i) => entityRefsEqual(ref, memberRefs[i]))
    ) {
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
