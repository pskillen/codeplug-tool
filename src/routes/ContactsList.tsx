import { useMemo } from 'react';
import { DataTable, EmptyState, ListPage } from '../components/ui/index.ts';
import { getHelpShort } from '../content/help/manifest.ts';
import { filterRowsByName, useListNameQuery } from '../hooks/useListNameQuery.ts';
import { usePersistedEntityListSort } from '../hooks/usePersistedEntityListSort.ts';
import { DATATABLE_NAME_SORT_KEY } from '../lib/dataTable/sort.ts';
import {
  channelsReferencingContactId,
  formatReferenceCount,
  rxGroupListsContainingMemberRef,
} from '../lib/reportLookup.ts';
import { useCodeplug } from '../state/codeplugStore.tsx';

export default function ContactsList() {
  const { codeplug } = useCodeplug();
  const { channels, contacts, rxGroupLists } = codeplug;
  const { nameFilter, nameFilterInput, nameFilterPending, setNameFilter } =
    useListNameQuery('contacts');
  const [sort, setSort] = usePersistedEntityListSort('contacts', {
    columnKey: DATATABLE_NAME_SORT_KEY,
    direction: 'asc',
  });
  const filtered = useMemo(() => {
    return filterRowsByName(contacts, nameFilter, (c) => c.name);
  }, [contacts, nameFilter]);

  return (
    <ListPage title="Contacts">
      <DataTable
        variant="list"
        rows={filtered}
        totalRowCount={contacts.length}
        search={nameFilterInput}
        searchPending={nameFilterPending}
        onSearchChange={setNameFilter}
        searchPlaceholder="Filter name…"
        sort={sort}
        onSortChange={setSort}
        rowKey={(c) => c.id}
        emptyState={<EmptyState message={getHelpShort('empty.contacts')} />}
        nameColumn={{
          getName: (c) => c.name,
          getPath: (c) => `/contacts/${c.id}`,
        }}
        columns={[
          {
            key: 'identifier',
            header: 'ID',
            render: (c) => c.identifier || '—',
            sortValue: (c) => c.identifier || '',
          },
          {
            key: 'ts',
            header: 'Timeslot',
            render: (c) => c.timeslotOverride ?? '—',
            sortValue: (c) => c.timeslotOverride ?? '',
          },
          {
            key: 'channels',
            header: 'Channels using',
            render: (c) =>
              formatReferenceCount(channelsReferencingContactId(c.id, channels).length),
            sortValue: (c) => channelsReferencingContactId(c.id, channels).length,
          },
          {
            key: 'rgl',
            header: 'RX groups using',
            render: (c) =>
              formatReferenceCount(
                rxGroupListsContainingMemberRef({ kind: 'contact', id: c.id }, rxGroupLists).length,
              ),
            sortValue: (c) =>
              rxGroupListsContainingMemberRef({ kind: 'contact', id: c.id }, rxGroupLists).length,
          },
        ]}
      />
    </ListPage>
  );
}
