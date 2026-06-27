import { Text } from '@mantine/core';
import { Page, PageHeader } from '../../components/ui/index.ts';
import { getHelpShort } from '../../content/help/manifest.ts';

export default function ReferenceIndex() {
  return (
    <Page>
      <PageHeader title="Reference" description={getHelpShort('reference.overview')} />
      <Text c="dimmed" size="sm">
        Choose a reference tool from the sidebar.
      </Text>
    </Page>
  );
}
