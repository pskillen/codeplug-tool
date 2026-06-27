import {
  Button,
  Checkbox,
  Group,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { channelDisplayLabel } from '../../lib/channelNaming.ts';
import { ICON_SIZE_NAV, ICON_STROKE } from '../../lib/iconSizes.ts';
import { memberIncludesInScanList } from '../../lib/zones.ts';
import { sortByName } from '../../lib/reportLookup.ts';
import type { Channel } from '../../models/codeplug.ts';
import type { ZoneMemberEntry } from '../../models/codeplug.ts';

function channelMatchesFilter(channel: Channel, filterLower: string): boolean {
  if (!filterLower) return true;
  if (channel.name.toLowerCase().includes(filterLower)) return true;
  if (channel.callsign.toLowerCase().includes(filterLower)) return true;
  return channelDisplayLabel(channel, true).toLowerCase().includes(filterLower);
}

function ChannelCheckboxLabel({ channel }: { channel: Channel }) {
  const callsign = channel.callsign.trim();
  const name = channel.name.trim();
  if (callsign && name) {
    return (
      <Group gap={4} wrap="nowrap">
        <Text size="sm" component="span">
          {callsign}
        </Text>
        <Text size="sm" c="dimmed" component="span">
          — {name}
        </Text>
      </Group>
    );
  }
  return <Text size="sm">{callsign || name || '—'}</Text>;
}

export interface ZoneMemberPickerProps {
  channels: Channel[];
  members: ZoneMemberEntry[];
  onChange: (members: ZoneMemberEntry[]) => void;
  /** Show per-member scan list inclusion (DM32-style export). */
  showScanInclusion?: boolean;
}

function memberChannelIds(members: ZoneMemberEntry[]): string[] {
  return members.map((m) => m.channelId);
}

function moveSelectedBlock(
  ids: string[],
  selected: Set<string>,
  direction: 'up' | 'down',
): string[] {
  const next = [...ids];
  const indices = next
    .map((id, index) => ({ id, index }))
    .filter(({ id }) => selected.has(id))
    .map(({ index }) => index);

  if (direction === 'up') {
    for (const index of indices.sort((a, b) => a - b)) {
      if (index === 0) continue;
      const above = index - 1;
      if (selected.has(next[above])) continue;
      [next[above], next[index]] = [next[index], next[above]];
    }
  } else {
    for (const index of indices.sort((a, b) => b - a)) {
      if (index >= next.length - 1) continue;
      const below = index + 1;
      if (selected.has(next[below])) continue;
      [next[below], next[index]] = [next[index], next[below]];
    }
  }

  return next;
}

function reorderMembers(members: ZoneMemberEntry[], orderedIds: string[]): ZoneMemberEntry[] {
  const byId = new Map(members.map((m) => [m.channelId, m]));
  return orderedIds.map((id) => byId.get(id)!).filter(Boolean);
}

function ChannelList({
  items,
  checked,
  onToggle,
  emptyLabel,
  members,
  onScanInclusionChange,
  showScanInclusion,
}: {
  items: Channel[];
  checked: Set<string>;
  onToggle: (id: string) => void;
  emptyLabel: string;
  members?: ZoneMemberEntry[];
  onScanInclusionChange?: (channelId: string, include: boolean) => void;
  showScanInclusion?: boolean;
}) {
  if (!items.length) {
    return (
      <Text size="sm" c="dimmed" p="xs">
        {emptyLabel}
      </Text>
    );
  }

  const memberById = new Map(members?.map((m) => [m.channelId, m]) ?? []);

  return (
    <Stack gap={4} p="xs">
      {items.map((ch) => (
        <Stack key={ch.id} gap={2}>
          <Checkbox
            label={<ChannelCheckboxLabel channel={ch} />}
            checked={checked.has(ch.id)}
            onChange={() => onToggle(ch.id)}
          />
          {showScanInclusion && members && onScanInclusionChange ? (
            <Checkbox
              ml="lg"
              size="xs"
              label="Include in scan list"
              checked={memberIncludesInScanList(memberById.get(ch.id) ?? { channelId: ch.id })}
              onChange={(e) => onScanInclusionChange(ch.id, e.currentTarget.checked)}
            />
          ) : null}
        </Stack>
      ))}
    </Stack>
  );
}

export default function ZoneMemberPicker({
  channels,
  members,
  onChange,
  showScanInclusion = false,
}: ZoneMemberPickerProps) {
  const selectedIds = memberChannelIds(members);
  const [availableFilter, setAvailableFilter] = useState('');
  const [inZoneFilter, setInZoneFilter] = useState('');
  const [availableSelected, setAvailableSelected] = useState<string[]>([]);
  const [inZoneSelected, setInZoneSelected] = useState<string[]>([]);

  const selectedSet = new Set(selectedIds);
  const availableFilterLower = availableFilter.trim().toLowerCase();
  const inZoneFilterLower = inZoneFilter.trim().toLowerCase();

  const availableChannels = useMemo(
    () =>
      sortByName(channels).filter(
        (ch) =>
          !selectedSet.has(ch.id) &&
          channelMatchesFilter(ch, availableFilterLower),
      ),
    [channels, selectedIds, availableFilterLower],
  );

  const inZoneChannels = useMemo(
    () =>
      selectedIds
        .map((id) => channels.find((ch) => ch.id === id))
        .filter((ch): ch is Channel => ch != null)
        .filter((ch) => channelMatchesFilter(ch, inZoneFilterLower)),
    [channels, selectedIds, inZoneFilterLower],
  );

  const toggleAvailable = (id: string) => {
    setAvailableSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleInZone = (id: string) => {
    setInZoneSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const addSelected = () => {
    const toAdd = availableSelected.filter((id) => !selectedSet.has(id));
    if (!toAdd.length) return;
    onChange([...members, ...toAdd.map((channelId) => ({ channelId }))]);
    setAvailableSelected([]);
  };

  const removeSelected = () => {
    if (!inZoneSelected.length) return;
    const remove = new Set(inZoneSelected);
    onChange(members.filter((m) => !remove.has(m.channelId)));
    setInZoneSelected([]);
  };

  const moveSelected = (direction: 'up' | 'down') => {
    if (!inZoneSelected.length) return;
    const nextIds = moveSelectedBlock(selectedIds, new Set(inZoneSelected), direction);
    onChange(reorderMembers(members, nextIds));
  };

  const setScanInclusion = (channelId: string, include: boolean) => {
    onChange(
      members.map((m) =>
        m.channelId === channelId ? { ...m, includeInScanList: include ? undefined : false } : m,
      ),
    );
  };

  const canMoveUp = inZoneSelected.some((id) => selectedIds.indexOf(id) > 0);
  const canMoveDown = inZoneSelected.some((id) => {
    const index = selectedIds.indexOf(id);
    return index >= 0 && index < selectedIds.length - 1;
  });

  return (
    <Stack gap="sm">
      <Text size="sm" c="dimmed">
        {selectedIds.length} member{selectedIds.length === 1 ? '' : 's'}
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Stack gap="xs">
          <TextInput
            label="Filter available"
            placeholder="Search by callsign or name…"
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
            <ChannelList
              items={availableChannels}
              checked={new Set(availableSelected)}
              onToggle={toggleAvailable}
              emptyLabel="No channels available"
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
            disabled={!inZoneSelected.length}
            leftSection={<IconArrowLeft size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
          >
            Remove
          </Button>
        </Stack>

        <Stack gap="xs">
          <TextInput
            label="Filter in zone"
            placeholder="Search by callsign or name…"
            value={inZoneFilter}
            onChange={(e) => setInZoneFilter(e.currentTarget.value)}
          />
          <Text size="sm" fw={500}>
            In zone (export order)
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
            <ChannelList
              items={inZoneChannels}
              checked={new Set(inZoneSelected)}
              onToggle={toggleInZone}
              emptyLabel="No channels in zone"
              members={members}
              showScanInclusion={showScanInclusion}
              onScanInclusionChange={setScanInclusion}
            />
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
