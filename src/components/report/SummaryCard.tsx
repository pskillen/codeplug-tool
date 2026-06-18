import { Anchor, Card, Group, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

export interface SummaryCardProps {
  title: string;
  count: number;
  previewNames: string[];
  listPath: string;
}

export default function SummaryCard({ title, count, previewNames, listPath }: SummaryCardProps) {
  return (
    <Card withBorder padding="md" radius="md">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Title order={3}>{title}</Title>
          <Text fw={600} size="xl">
            {count}
          </Text>
        </Group>
        {previewNames.length > 0 ? (
          <Stack gap={2}>
            {previewNames.map((name) => (
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
          View all →
        </Anchor>
      </Stack>
    </Card>
  );
}
