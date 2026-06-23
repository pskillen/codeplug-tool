import { Stack } from '@mantine/core';
import { useMemo } from 'react';
import CodeplugMap from '../../components/CodeplugMap/CodeplugMap.tsx';
import { DataTable, ListPage } from '../../components/ui/index.ts';
import { filterRowsByName, useListNameQuery } from '../../hooks/useListNameQuery.ts';
import { sortByName } from '../../lib/reportLookup.ts';
import { useCodeplug } from '../../state/codeplugStore.tsx';

export default function ZonesList() {
  const { codeplug } = useCodeplug();
  const { channels, zones } = codeplug;
  const { nameFilter } = useListNameQuery();
  const sorted = useMemo(() => {
    return filterRowsByName(sortByName(zones), nameFilter, (z) => z.name);
  }, [zones, nameFilter]);

  return (
    <ListPage title="Zones">
      <Stack gap="lg">
        <DataTable
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

        <CodeplugMap
          channels={channels}
          zones={zones}
          allChannels={channels}
          talkGroups={codeplug.talkGroups}
          contacts={codeplug.contacts}
          rxGroupLists={codeplug.rxGroupLists}
        />
      </Stack>
    </ListPage>
  );
}
