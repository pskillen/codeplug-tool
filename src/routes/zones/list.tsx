import { Button, Group, Stack } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import CodeplugMap from '../../components/CodeplugMap/CodeplugMap.tsx';
import EntityTable from '../../components/report/EntityTable.tsx';
import ReportPage from '../../components/report/ReportPage.tsx';
import { ICON_SIZE_NAV, ICON_STROKE } from '../../lib/iconSizes.ts';
import { sortByName } from '../../lib/reportLookup.ts';
import { useCodeplug } from '../../state/codeplugStore.tsx';

export default function ZonesList() {
  const { codeplug } = useCodeplug();
  const { channels, zones } = codeplug;
  const sorted = sortByName(zones);

  return (
    <ReportPage title="Zones">
      <Stack gap="lg">
        <Group justify="flex-end">
          <Button
            component={Link}
            to="/zones/new"
            leftSection={<IconPlus size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
          >
            New zone
          </Button>
        </Group>

        <EntityTable
          rows={sorted}
          rowKey={(z) => z.id}
          nameColumn={{
            getName: (z) => z.name,
            getPath: (z) => `/zones/${z.id}`,
          }}
          columns={[
            {
              key: 'members',
              header: 'Members',
              render: (z) => z.memberChannelIds.length,
            },
          ]}
        />

        <CodeplugMap channels={channels} zones={zones} allChannels={channels} />
      </Stack>
    </ReportPage>
  );
}
