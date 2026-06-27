import { Anchor, Card, SimpleGrid, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Page, PageHeader } from '../../components/ui/index.ts';
import { hubTopics, getHelpEntry } from '../../content/help/manifest.ts';

export default function HelpIndex() {
  return (
    <Page>
      <PageHeader title="Help" description="Guides for designing and exporting your codeplug." />
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {hubTopics.map((id) => {
          const entry = getHelpEntry(id);
          if (!entry) return null;
          return (
            <Card key={id} component={Link} to={`/help/${id}`} withBorder padding="md">
              <Title order={4} mb="xs">
                {entry.title}
              </Title>
              <Text size="sm" c="dimmed">
                {entry.short}
              </Text>
            </Card>
          );
        })}
      </SimpleGrid>
      <Text size="sm" c="dimmed" mt="lg">
        Also see{' '}
        <Anchor component={Link} to="/reference">
          Reference
        </Anchor>{' '}
        tools.
      </Text>
    </Page>
  );
}
