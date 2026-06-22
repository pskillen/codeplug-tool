import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { IconFilePlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import ImportNewProjectPanel from '../components/ImportNewProjectPanel/ImportNewProjectPanel.tsx';
import ProjectList from '../components/ProjectList/ProjectList.tsx';
import { ICON_SIZE_NAV, ICON_STROKE } from '../lib/iconSizes.ts';
import { useProjects } from '../state/codeplugStore.tsx';

export default function Home() {
  const navigate = useNavigate();
  const { projects, importNewProject, persistenceError, clearPersistenceError } = useProjects();

  return (
    <Container size="sm" py="md">
      <Stack gap="lg">
        <Stack gap="xs">
          <Title order={1}>MM9PDY Codeplug Tool</Title>
          <Text c="dimmed">
            Your codeplugs are stored in this browser. Import a CPS export, start a blank codeplug,
            or open an existing one below.
          </Text>
        </Stack>

        {projects.length > 0 ? (
          <Stack gap="sm">
            <Title order={3}>Your codeplugs</Title>
            <ProjectList />
          </Stack>
        ) : null}

        <Stack gap="sm">
          <Title order={3}>{projects.length ? 'Start another codeplug' : 'Start fresh'}</Title>
          <Text size="sm" c="dimmed">
            Build a new layout from scratch — channels, zones, and contacts added after you save.
          </Text>
          <Button
            variant="light"
            leftSection={<IconFilePlus size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
            onClick={() => navigate('/codeplug/new')}
            style={{ alignSelf: 'flex-start' }}
          >
            Start fresh
          </Button>
        </Stack>

        <Stack gap="sm">
          <Title order={3}>{projects.length ? 'Import another codeplug' : 'Import codeplug'}</Title>
          <ImportNewProjectPanel
            onImported={(result) => {
              importNewProject(result);
              navigate('/summary');
            }}
            persistenceError={persistenceError}
            onDismissPersistenceError={clearPersistenceError}
            introText={
              projects.length === 0
                ? 'Choose a vendor format, then drop CPS export files or a folder. Files stay on your machine.'
                : 'Import creates a new codeplug and opens the summary.'
            }
          />
        </Stack>
      </Stack>
    </Container>
  );
}
