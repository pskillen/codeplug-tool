import { Anchor, Card, Group, Stack, Text, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ICON_SIZE_NAV, ICON_STROKE } from '../../lib/iconSizes.ts';

export interface SummaryCardProps {
  title: string;
  count: number;
  previewNames: string[];
  listPath: string;
  icon?: ReactNode;
  /** Smaller title/count and fewer preview lines (Summary dashboard). */
  compact?: boolean;
}

export default function SummaryCard({
  title,
  count,
  previewNames,
  listPath,
  icon,
  compact = false,
}: SummaryCardProps) {
  const displayNames = compact ? previewNames.slice(0, 3) : previewNames;
  const titleOrder = compact ? 4 : 3;
  const countSize = compact ? 'lg' : 'xl';

  return (
    <Card withBorder padding={compact ? 'sm' : 'md'} radius="md">
      <Stack gap={compact ? 'xs' : 'sm'}>
        <Group justify="space-between" align="flex-start">
          <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            {icon}
            <Title order={titleOrder}>{title}</Title>
          </Group>
          <Text fw={600} size={countSize}>
            {count}
          </Text>
        </Group>
        {displayNames.length > 0 ? (
          <Stack gap={2}>
            {displayNames.map((name) => (
              <Text key={name} size="sm" c="dimmed" truncate>
                {name}
              </Text>
            ))}
          </Stack>
        ) : (
          <Text size="sm" c="dimmed">
            None
          </Text>
        )}
        <Anchor component={Link} to={listPath} size="sm">
          <Group gap={4} wrap="nowrap">
            View all
            <IconArrowRight size={ICON_SIZE_NAV} stroke={ICON_STROKE} />
          </Group>
        </Anchor>
      </Stack>
    </Card>
  );
}
