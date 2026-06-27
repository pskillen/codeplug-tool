import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import { useGoogleDriveConnection } from '../../hooks/useGoogleDriveConnection.ts';
import { getHelpShort } from '../../content/help/manifest.ts';
import { PageSection } from '../ui/index.ts';

export default function GoogleDriveSettingsSection() {
  const { configured, connected, busy, error, connect, disconnect } = useGoogleDriveConnection();

  if (!configured) {
    return (
      <PageSection
        title="Google Drive"
        description="Cloud open/save for YAML and CPS files. Requires a build-time OAuth client ID."
      >
        <Alert color="gray">
          Google Drive is not configured for this build. For local dev, set{' '}
          <code>GOOGLE_OAUTH_CLIENT_ID</code> in <code>.env.local</code>. For GitHub Pages, add the
          repository secret before publishing a release.
        </Alert>
      </PageSection>
    );
  }

  return (
    <PageSection title="Google Drive" description={getHelpShort('settings.googleDrive')}>
      <Stack gap="sm">
        <Text size="sm">Status: {connected ? 'Connected' : 'Not connected'}</Text>
        {error ? <Alert color="red">{error}</Alert> : null}
        <Group>
          {connected ? (
            <Button variant="default" onClick={disconnect}>
              Disconnect Google Drive
            </Button>
          ) : (
            <Button variant="default" loading={busy} onClick={() => void connect()}>
              Connect Google Drive
            </Button>
          )}
        </Group>
      </Stack>
    </PageSection>
  );
}
