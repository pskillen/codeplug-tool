import { Text } from '@mantine/core';
import { Page, PageHeader } from '../../components/ui/index.ts';

export default function ReferenceIndex() {
  return (
    <Page>
      <PageHeader
        title="Reference"
        description="Lookup tables and conventions used across the codeplug tool."
      />
      <Text c="dimmed" size="sm">
        Choose a reference tool from the sidebar.
      </Text>
    </Page>
  );
}
