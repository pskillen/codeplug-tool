import { Container, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import ImportDropzone from '../components/ImportDropzone/ImportDropzone.tsx';
import ProjectList from '../components/ProjectList/ProjectList.tsx';
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
            Your codeplugs are stored in this browser. Import an OpenGD77 CPS export to get started,
            or open an existing codeplug below.
          </Text>
        </Stack>

        {projects.length > 0 ? (
          <Stack gap="sm">
            <Title order={3}>Your codeplugs</Title>
            <ProjectList />
          </Stack>
        ) : null}

        <Stack gap="sm">
          <Title order={3}>{projects.length ? 'Import another codeplug' : 'Import codeplug'}</Title>
          {projects.length === 0 ? (
            <Text size="sm" c="dimmed">
              Drop <code>Channels.csv</code> and <code>Zones.csv</code> from an OpenGD77 export, or
              choose a folder. CSV files stay on your machine.
            </Text>
          ) : null}
          <ImportDropzone
            onResult={(result) => {
              importNewProject(result);
              navigate('/map');
            }}
            persistenceError={persistenceError}
            onDismissPersistenceError={clearPersistenceError}
            hint={
              projects.length
                ? 'Import creates a new codeplug and opens the channel map.'
                : 'Drop OpenGD77 CSV files or a whole export folder. Channels.csv and Zones.csv are recognised; other files are skipped.'
            }
          />
        </Stack>
      </Stack>
    </Container>
  );
}
