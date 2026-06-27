import { Button, Stack } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { sortByName } from '../../../lib/reportLookup.ts';
import { ICON_SIZE_NAV, ICON_STROKE } from '../../../lib/iconSizes.ts';
import { useCodeplug } from '../../../state/codeplugStore.tsx';
import { filterRowsByName, useListNameQuery } from '../../../hooks/useListNameQuery.ts';
import type { SectionNavProps } from '../../../nav/sectionNavTypes.ts';
import EntityListSectionNav, { EntityZoneLinks } from './EntityListSectionNav.tsx';

export default function ZonesSectionNav({ variant }: SectionNavProps) {
  const { codeplug } = useCodeplug();
  const { nameFilter } = useListNameQuery('zones');
  const zones = useMemo(() => {
    const sorted = sortByName(codeplug.zones);
    return filterRowsByName(sorted, nameFilter, (z) => z.name);
  }, [codeplug.zones, nameFilter]);

  return (
    <Stack gap="sm">
      <EntityListSectionNav variant={variant} newPath="/zones/new" newLabel="New zone" />
      <Button
        component={Link}
        to="/zones/from-distance"
        variant="light"
        leftSection={<IconMapPin size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
        fullWidth={variant === 'sidebar'}
      >
        Zone from distance…
      </Button>
      <EntityZoneLinks zones={zones} variant={variant} />
    </Stack>
  );
}
