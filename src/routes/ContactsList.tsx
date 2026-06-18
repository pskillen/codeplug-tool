import EntityTable from '../components/report/EntityTable.tsx';
import ReportPage from '../components/report/ReportPage.tsx';
import { channelsWithContactName, sortByName } from '../lib/reportLookup.ts';
import { useCodeplug } from '../state/codeplugStore.tsx';

export default function ContactsList() {
  const { codeplug } = useCodeplug();
  const { channels, contacts } = codeplug;
  const sorted = sortByName(contacts);

  return (
    <ReportPage title="Contacts">
      <EntityTable
        rows={sorted}
        rowKey={(c) => c.id}
        nameColumn={{
          getName: (c) => c.name,
          getPath: (c) => `/contacts/${c.id}`,
        }}
        columns={[
          { key: 'number', header: 'DMR ID', render: (c) => c.number || '—' },
          { key: 'ts', header: 'Timeslot', render: (c) => c.timeslotOverride || '—' },
          {
            key: 'channels',
            header: 'Channels using',
            render: (c) => channelsWithContactName(c.name, channels).length,
          },
        ]}
      />
    </ReportPage>
  );
}
