import { NavLink, Stack, Text } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { hubTopics } from '../../../content/help/manifest.ts';
import { getHelpEntry } from '../../../content/help/manifest.ts';
import { navActive } from '../../../nav/navActive.ts';

export default function HelpSectionNav() {
  const location = useLocation();

  return (
    <Stack gap="xs">
      <NavLink
        component={Link}
        to="/help"
        label="All topics"
        active={location.pathname === '/help'}
      />
      {hubTopics.map((id) => {
        const entry = getHelpEntry(id);
        if (!entry) return null;
        return (
          <NavLink
            key={id}
            component={Link}
            to={`/help/${id}`}
            label={entry.title}
            active={navActive(location.pathname, `/help/${id}`)}
          />
        );
      })}
      <Text size="xs" c="dimmed" mt="sm">
        Short hints throughout the app link here for detail.
      </Text>
    </Stack>
  );
}
