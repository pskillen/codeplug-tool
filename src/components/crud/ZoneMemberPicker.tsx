import { Checkbox, ScrollArea, Stack, Text } from '@mantine/core';
import { sortByName } from '../../lib/reportLookup.ts';
import type { Channel } from '../../models/codeplug.ts';
import { OPENGD77_MAX_ZONE_MEMBERS } from '../../lib/codeplugMutations.ts';

export interface ZoneMemberPickerProps {
  channels: Channel[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function ZoneMemberPicker({
  channels,
  selectedIds,
  onChange,
}: ZoneMemberPickerProps) {
  const sorted = sortByName(channels);
  const atCap = selectedIds.length >= OPENGD77_MAX_ZONE_MEMBERS;

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else if (!atCap) {
      onChange([...selectedIds, id]);
    }
  };

  const moveUp = (id: string) => {
    const idx = selectedIds.indexOf(id);
    if (idx <= 0) return;
    const next = [...selectedIds];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  };

  const moveDown = (id: string) => {
    const idx = selectedIds.indexOf(id);
    if (idx < 0 || idx >= selectedIds.length - 1) return;
    const next = [...selectedIds];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  };

  const selectedSet = new Set(selectedIds);
  const selectedChannels = selectedIds
    .map((id) => channels.find((ch) => ch.id === id))
    .filter((ch): ch is Channel => ch != null);

  return (
    <Stack gap="sm">
      <Text size="sm" c="dimmed">
        {selectedIds.length} / {OPENGD77_MAX_ZONE_MEMBERS} members
      </Text>

      <Text size="sm" fw={500}>
        Selected (export order)
      </Text>
      {selectedChannels.length === 0 ? (
        <Text size="sm" c="dimmed">
          No channels selected
        </Text>
      ) : (
        <Stack gap={4}>
          {selectedChannels.map((ch) => (
            <Stack key={ch.id} gap={2}>
              <Checkbox
                label={ch.name}
                checked
                onChange={() => toggle(ch.id)}
              />
              <Text size="xs" c="dimmed" ml="lg">
                <button type="button" onClick={() => moveUp(ch.id)} disabled={selectedIds[0] === ch.id}>
                  ↑
                </button>{' '}
                <button type="button" onClick={() => moveDown(ch.id)} disabled={selectedIds[selectedIds.length - 1] === ch.id}>
                  ↓
                </button>
              </Text>
            </Stack>
          ))}
        </Stack>
      )}

      <Text size="sm" fw={500} mt="sm">
        Available channels
      </Text>
      <ScrollArea h={200}>
        <Stack gap={4}>
          {sorted
            .filter((ch) => !selectedSet.has(ch.id))
            .map((ch) => (
              <Checkbox
                key={ch.id}
                label={ch.name}
                checked={false}
                disabled={atCap}
                onChange={() => toggle(ch.id)}
              />
            ))}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}
