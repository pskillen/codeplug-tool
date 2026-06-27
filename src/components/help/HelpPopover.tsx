import { ActionIcon, Group, Popover, Stack, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { getHelpEntry } from '../../content/help/manifest.ts';
import type { HelpTopicId } from '../../content/help/types.ts';
import { ICON_SIZE_ACTION, ICON_STROKE } from '../../lib/iconSizes.ts';

export interface HelpPopoverProps {
  helpId: HelpTopicId;
  /** Popover width on desktop */
  width?: number;
}

export default function HelpPopover({ helpId, width = 280 }: HelpPopoverProps) {
  const entry = getHelpEntry(helpId);
  if (!entry) return null;

  return (
    <Popover width={width} position="top-start" withArrow shadow="md">
      <Popover.Target>
        <ActionIcon variant="subtle" color="gray" size="sm" aria-label={`Help: ${entry.title}`}>
          <IconInfoCircle size={ICON_SIZE_ACTION} stroke={ICON_STROKE} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            {entry.title}
          </Text>
          <Text size="sm">{entry.short}</Text>
          {entry.learnMoreSlug ? (
            <Text size="sm">
              <Link to={`/help/${entry.learnMoreSlug}`}>Learn more</Link>
            </Text>
          ) : null}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export function HelpLabel({ label, helpId }: { label: string; helpId: HelpTopicId }) {
  return (
    <Group gap={4} wrap="nowrap" display="inline-flex" align="center">
      <span>{label}</span>
      <HelpPopover helpId={helpId} />
    </Group>
  );
}
