import { Anchor, Container, List, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Container size="sm" py="md">
      <Stack gap="md">
        <Title order={1}>MM9PDY Codeplug Tool</Title>
        <Text c="dimmed">
          Browser tools for visualising OpenGD77 codeplug geography. CSV files stay on your machine.
        </Text>
        <List>
          <List.Item>
            <Anchor component={Link} to="/map">
              Channel map
            </Anchor>{' '}
            — plot <code>Channels.csv</code> and zone hulls from <code>Zones.csv</code>
          </List.Item>
        </List>
      </Stack>
    </Container>
  );
}
