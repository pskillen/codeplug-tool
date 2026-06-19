import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { IconDownload, IconPackage } from '@tabler/icons-react';
import ImportIntoActivePanel from '../components/ImportIntoActivePanel/ImportIntoActivePanel.tsx';
import { opengd77ExportAdapter, type OpenGd77ExportFileName } from '../lib/export/index.ts';
import { ICON_SIZE_NAV, ICON_STROKE } from '../lib/iconSizes.ts';
import { useCodeplug } from '../state/codeplugStore.tsx';

const INDIVIDUAL_FILES: OpenGd77ExportFileName[] = [
  'Channels.csv',
  'Zones.csv',
  'Contacts.csv',
  'TG_Lists.csv',
];

const PLACEHOLDER_FORMATS = [
  { label: 'qDMR YAML', issue: '#37' },
  { label: 'Native YAML', issue: '#10' },
] as const;

export default function Export() {
  const { codeplug } = useCodeplug();
  const hasData = codeplug.channels.length > 0;

  return (
    <Container size="sm" py="md">
      <Stack gap="lg">
        <Stack gap="xs">
          <Title order={1}>Export codeplug</Title>
          <Text c="dimmed">
            Download the active codeplug as vendor CPS files. OpenGD77 is supported today; other
            formats are planned.
          </Text>
        </Stack>

        {!hasData ? (
          <Text c="dimmed">Import a codeplug first — there are no channels to export yet.</Text>
        ) : null}

        <Stack gap="sm">
          <Title order={3}>Import into active codeplug</Title>
          <Text size="sm" c="dimmed">
            Add or refresh CSV data in the open codeplug without creating a new project.
          </Text>
          <ImportIntoActivePanel />
        </Stack>

        <Stack gap="sm">
          <Title order={3}>OpenGD77 CPS CSV</Title>
          <Stack gap="xs">
            {INDIVIDUAL_FILES.map((fileName) => (
              <Button
                key={fileName}
                variant="default"
                disabled={!hasData}
                leftSection={<IconDownload size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
                onClick={() => opengd77ExportAdapter.downloadFile(codeplug, fileName)}
              >
                Download {fileName}
              </Button>
            ))}
            <Button
              disabled={!hasData}
              leftSection={<IconPackage size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
              onClick={() => opengd77ExportAdapter.downloadZip(codeplug)}
            >
              Download all (.zip)
            </Button>
          </Stack>
          <Text size="sm" c="dimmed">
            The ZIP also includes header-only <code>DTMF.csv</code> and <code>APRS.csv</code> so the
            bundle matches a full OpenGD77 export folder.
          </Text>
        </Stack>

        <Stack gap="sm">
          <Title order={3}>Other formats</Title>
          {PLACEHOLDER_FORMATS.map(({ label, issue }) => (
            <Button key={label} variant="default" disabled>
              {label} ({issue}) — coming soon
            </Button>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
