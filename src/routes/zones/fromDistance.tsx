import { Anchor, Button, Group, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { FormPage } from '../../components/ui/index.ts';
import { ICON_SIZE_NAV, ICON_STROKE } from '../../lib/iconSizes.ts';

/** Zone-from-distance workflow — full UI in follow-up commit. */
export default function ZoneFromDistance() {
  return (
    <FormPage title="Zone from distance">
      <Stack gap="lg">
        <Anchor component={Link} to="/zones" size="sm">
          <Group gap={4} wrap="nowrap">
            <IconArrowLeft size={ICON_SIZE_NAV} stroke={ICON_STROKE} />
            Zones
          </Group>
        </Anchor>
        <Title order={3}>Coming soon</Title>
        <Text size="sm" c="dimmed">
          Pick a centre point and distance to build a zone from in-range channels.
        </Text>
        <Button component={Link} to="/zones" variant="light">
          Back to zones
        </Button>
      </Stack>
    </FormPage>
  );
}
