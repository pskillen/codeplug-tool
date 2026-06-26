import {
  Badge,
  Button,
  Checkbox,
  Group,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { entityRefKey } from '../../lib/entityRefs.ts';
import type { EntityRef } from '../../lib/entityRefs.ts';
import { ICON_SIZE_NAV, ICON_STROKE } from '../../lib/iconSizes.ts';
import { sortByName } from '../../lib/reportLookup.ts';
import type { ChannelTimeslot } from '../../lib/channelFields/index.ts';
import type { Contact, RxGroupListMember, TalkGroup } from '../../models/codeplug.ts';

export interface RxGroupListMemberPickerProps {
  talkGroups: TalkGroup[];
  contacts: Contact[];
  selectedRefs: RxGroupListMember[];
  onChange: (refs: RxGroupListMember[]) => void;
}

interface MemberOption {
  ref: EntityRef;
  name: string;
  key: string;
}

function memberKey(member: RxGroupListMember): string {
  const slot = member.timeslot ?? '';
  return `${entityRefKey(member.ref)}:${slot}`;
}

function moveSelectedBlock(
  members: RxGroupListMember[],
  selected: Set<string>,
  direction: 'up' | 'down',
): RxGroupListMember[] {
  const next = [...members];
  const indices = next
    .map((member, index) => ({ key: memberKey(member), index }))
    .filter(({ key }) => selected.has(key))
    .map(({ index }) => index);

  if (direction === 'up') {
    for (const index of indices.sort((a, b) => a - b)) {
      if (index === 0) continue;
      const above = index - 1;
      if (selected.has(memberKey(next[above]))) continue;
      [next[above], next[index]] = [next[index], next[above]];
    }
  } else {
    for (const index of indices.sort((a, b) => b - a)) {
      if (index >= next.length - 1) continue;
      const below = index + 1;
      if (selected.has(memberKey(next[below]))) continue;
      [next[below], next[index]] = [next[index], next[below]];
    }
  }

  return next;
}

function memberOptions(talkGroups: TalkGroup[], contacts: Contact[]): MemberOption[] {
  const tg = sortByName(talkGroups).map((t) => ({
    ref: { kind: 'talkGroup' as const, id: t.id },
    name: t.name,
    key: entityRefKey({ kind: 'talkGroup', id: t.id }),
  }));
  const ct = sortByName(contacts).map((c) => ({
    ref: { kind: 'contact' as const, id: c.id },
    name: c.name,
    key: entityRefKey({ kind: 'contact', id: c.id }),
  }));
  return [...tg, ...ct];
}

const TIMESLOT_OPTIONS = [
  { value: '', label: '—' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
];

function parseTimeslotValue(value: string | null): ChannelTimeslot | null {
  if (value === '1') return 1;
  if (value === '2') return 2;
  return null;
}

function timeslotToValue(timeslot: ChannelTimeslot | null | undefined): string {
  if (timeslot === 1) return '1';
  if (timeslot === 2) return '2';
  return '';
}

function MemberList({
  items,
  checked,
  onToggle,
  emptyLabel,
}: {
  items: MemberOption[];
  checked: Set<string>;
  onToggle: (key: string) => void;
  emptyLabel: string;
}) {
  if (!items.length) {
    return (
      <Text size="sm" c="dimmed" p="xs">
        {emptyLabel}
      </Text>
    );
  }

  return (
    <Stack gap={4} p="xs">
      {items.map((item) => (
        <Group key={item.key} gap="xs" wrap="nowrap">
          <Checkbox
            label={item.name}
            checked={checked.has(item.key)}
            onChange={() => onToggle(item.key)}
            style={{ flex: 1 }}
          />
          {item.ref.kind === 'talkGroup' ? (
            <Badge size="sm">Talk group</Badge>
          ) : (
            <Badge size="sm" color="grape">
              Private
            </Badge>
          )}
        </Group>
      ))}
    </Stack>
  );
}

export default function RxGroupListMemberPicker({
  talkGroups,
  contacts,
  selectedRefs,
  onChange,
}: RxGroupListMemberPickerProps) {
  const [availableFilter, setAvailableFilter] = useState('');
  const [inListFilter, setInListFilter] = useState('');
  const [availableSelected, setAvailableSelected] = useState<string[]>([]);
  const [inListSelected, setInListSelected] = useState<string[]>([]);

  const selectedRefKeys = useMemo(
    () => new Set(selectedRefs.map((member) => entityRefKey(member.ref))),
    [selectedRefs],
  );
  const allOptions = useMemo(() => memberOptions(talkGroups, contacts), [talkGroups, contacts]);
  const optionByKey = useMemo(() => new Map(allOptions.map((o) => [o.key, o])), [allOptions]);

  const availableFilterLower = availableFilter.trim().toLowerCase();
  const inListFilterLower = inListFilter.trim().toLowerCase();

  const availableMembers = useMemo(
    () =>
      allOptions.filter(
        (o) =>
          !selectedRefKeys.has(o.key) &&
          (!availableFilterLower || o.name.toLowerCase().includes(availableFilterLower)),
      ),
    [allOptions, selectedRefKeys, availableFilterLower],
  );

  const inListMembers = useMemo(
    () =>
      selectedRefs
        .map((member) => {
          const key = entityRefKey(member.ref);
          const option = optionByKey.get(key);
          return {
            member,
            name: option?.name ?? key,
            key: memberKey(member),
            refKey: key,
          };
        })
        .filter((o) => !inListFilterLower || o.name.toLowerCase().includes(inListFilterLower)),
    [selectedRefs, optionByKey, inListFilterLower],
  );

  const toggleAvailable = (key: string) => {
    setAvailableSelected((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    );
  };

  const toggleInList = (key: string) => {
    setInListSelected((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    );
  };

  const addSelected = () => {
    const toAdd = availableSelected
      .map((key) => optionByKey.get(key)?.ref)
      .filter((ref): ref is EntityRef => ref != null && !selectedRefKeys.has(entityRefKey(ref)))
      .map((ref) => ({ ref }));
    if (!toAdd.length) return;
    onChange([...selectedRefs, ...toAdd]);
    setAvailableSelected([]);
  };

  const removeSelected = () => {
    if (!inListSelected.length) return;
    const remove = new Set(inListSelected);
    onChange(selectedRefs.filter((member) => !remove.has(memberKey(member))));
    setInListSelected([]);
  };

  const moveSelected = (direction: 'up' | 'down') => {
    if (!inListSelected.length) return;
    onChange(moveSelectedBlock(selectedRefs, new Set(inListSelected), direction));
  };

  const setMemberTimeslot = (memberKeyValue: string, value: string | null) => {
    const timeslot = parseTimeslotValue(value);
    onChange(
      selectedRefs.map((member) => {
        if (memberKey(member) !== memberKeyValue) return member;
        return timeslot == null ? { ref: member.ref } : { ref: member.ref, timeslot };
      }),
    );
  };

  const canMoveUp = inListSelected.some((key) => {
    const index = selectedRefs.findIndex((member) => memberKey(member) === key);
    return index > 0;
  });
  const canMoveDown = inListSelected.some((key) => {
    const index = selectedRefs.findIndex((member) => memberKey(member) === key);
    return index >= 0 && index < selectedRefs.length - 1;
  });

  return (
    <Stack gap="sm">
      <Text size="sm" c="dimmed">
        {selectedRefs.length} member{selectedRefs.length === 1 ? '' : 's'}
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Stack gap="xs">
          <TextInput
            label="Filter available"
            placeholder="Search by name…"
            value={availableFilter}
            onChange={(e) => setAvailableFilter(e.currentTarget.value)}
          />
          <Text size="sm" fw={500}>
            Available
          </Text>
          <ScrollArea
            h={240}
            type="auto"
            offsetScrollbars
            style={{
              border: '1px solid var(--mantine-color-default-border)',
              borderRadius: 'var(--mantine-radius-sm)',
            }}
          >
            <MemberList
              items={availableMembers}
              checked={new Set(availableSelected)}
              onToggle={toggleAvailable}
              emptyLabel="No talk groups or contacts available"
            />
          </ScrollArea>
        </Stack>

        <Stack gap="xs" justify="center">
          <Button
            type="button"
            variant="light"
            onClick={addSelected}
            disabled={!availableSelected.length}
            rightSection={<IconArrowRight size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="light"
            onClick={removeSelected}
            disabled={!inListSelected.length}
            leftSection={<IconArrowLeft size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
          >
            Remove
          </Button>
        </Stack>

        <Stack gap="xs">
          <TextInput
            label="Filter in list"
            placeholder="Search by name…"
            value={inListFilter}
            onChange={(e) => setInListFilter(e.currentTarget.value)}
          />
          <Text size="sm" fw={500}>
            In list (export order)
          </Text>
          <ScrollArea
            h={240}
            type="auto"
            offsetScrollbars
            style={{
              border: '1px solid var(--mantine-color-default-border)',
              borderRadius: 'var(--mantine-radius-sm)',
            }}
          >
            {inListMembers.length === 0 ? (
              <Text size="sm" c="dimmed" p="xs">
                No members in list
              </Text>
            ) : (
              <Stack gap={4} p="xs">
                {inListMembers.map((item) => (
                  <Group key={item.key} gap="xs" wrap="nowrap" align="flex-end">
                    <Checkbox
                      label={item.name}
                      checked={inListSelected.includes(item.key)}
                      onChange={() => toggleInList(item.key)}
                      style={{ flex: 1 }}
                    />
                    {item.member.ref.kind === 'talkGroup' ? (
                      <Select
                        aria-label={`Timeslot for ${item.name}`}
                        data={TIMESLOT_OPTIONS}
                        value={timeslotToValue(item.member.timeslot)}
                        onChange={(value) => setMemberTimeslot(item.key, value)}
                        w={100}
                        size="xs"
                      />
                    ) : null}
                  </Group>
                ))}
              </Stack>
            )}
          </ScrollArea>
          <Group gap="xs">
            <Button
              type="button"
              variant="default"
              size="compact-sm"
              onClick={() => moveSelected('up')}
              disabled={!canMoveUp}
            >
              Move up
            </Button>
            <Button
              type="button"
              variant="default"
              size="compact-sm"
              onClick={() => moveSelected('down')}
              disabled={!canMoveDown}
            >
              Move down
            </Button>
          </Group>
        </Stack>
      </SimpleGrid>
    </Stack>
  );
}
