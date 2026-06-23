import { useMemo } from 'react';
import { DataTable, ListPage } from '../components/ui/index.ts';
import { getMemberWireNames } from '../lib/entityProvenance.ts';
import { filterRowsByName, useListNameQuery } from '../hooks/useListNameQuery.ts';
import {
  channelsWithRxGroupListId,
  formatReferenceCount,
  sortByName,
} from '../lib/reportLookup.ts';
import { useCodeplug } from '../state/codeplugStore.tsx';

export default function RxGroupListsList() {
  const { codeplug } = useCodeplug();
  const { channels, rxGroupLists } = codeplug;
  const { nameFilter } = useListNameQuery();
  const sorted = useMemo(() => {
    return filterRowsByName(sortByName(rxGroupLists), nameFilter, (r) => r.name);
  }, [rxGroupLists, nameFilter]);

  return (
    <ListPage title="RX Group Lists">
      <DataTable
        rows={sorted}
        rowKey={(r) => r.id}
        nameColumn={{
          getName: (r) => r.name,
          getPath: (r) => `/rx-group-lists/${r.id}`,
        }}
        columns={[
          {
            key: 'members',
            header: 'Members',
            render: (r) => formatReferenceCount(getMemberWireNames(r).length),
          },
          {
            key: 'channels',
            header: 'Channels using',
            render: (r) => formatReferenceCount(channelsWithRxGroupListId(r.id, channels).length),
          },
        ]}
      />
    </ListPage>
  );
}
