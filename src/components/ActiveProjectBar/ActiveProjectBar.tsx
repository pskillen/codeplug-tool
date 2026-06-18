import { Button, Group, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../state/codeplugStore.tsx';

export default function ActiveProjectBar() {
  const navigate = useNavigate();
  const { activeProject } = useProjects();

  return (
    <Stack gap="xs">
      <Group justify="space-between" align="center" wrap="nowrap">
        <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            Active codeplug
          </Text>
          <Text fw={600} truncate>
            {activeProject?.name ?? 'No codeplug selected'}
          </Text>
        </Stack>
        <Button size="compact-sm" variant="default" onClick={() => navigate('/')}>
          Switch
        </Button>
      </Group>
      {!activeProject ? (
        <Text size="sm" c="dimmed">
          Import or open a codeplug from the home page to start.
        </Text>
      ) : null}
    </Stack>
  );
}
