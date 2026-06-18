import { Container, Stack, Text, Title } from '@mantine/core';

export default function Map() {
  return (
    <Container size="sm" py="md">
      <Stack gap="md">
        <Title order={1}>Channel map</Title>
        <Text c="dimmed">Coming soon — the channel map will be ported in a follow-up ticket.</Text>
      </Stack>
    </Container>
  );
}
