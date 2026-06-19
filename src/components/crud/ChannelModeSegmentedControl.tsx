import { Select, Stack, Text } from '@mantine/core';
import { CHANNEL_MODES, type ChannelMode } from '../../lib/channelModes.ts';

export interface ChannelModeSelectProps {
  value: ChannelMode;
  onChange: (mode: ChannelMode) => void;
}

export default function ChannelModeSelect({ value, onChange }: ChannelModeSelectProps) {
  return (
    <Stack gap={4}>
      <Text size="sm" fw={500}>
        Mode
      </Text>
      <Select
        data={CHANNEL_MODES.map((m) => ({ value: m.id, label: m.label }))}
        value={value}
        onChange={(v) => {
          if (v) onChange(v as ChannelMode);
        }}
        searchable
      />
    </Stack>
  );
}
