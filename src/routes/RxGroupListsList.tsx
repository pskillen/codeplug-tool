import EntityTable from '../components/report/EntityTable.tsx';
import ReportPage from '../components/report/ReportPage.tsx';
import { sortByName } from '../lib/reportLookup.ts';
import { useCodeplug } from '../state/codeplugStore.tsx';

export default function RxGroupListsList() {
  const { codeplug } = useCodeplug();
  const { rxGroupLists } = codeplug;
  const sorted = sortByName(rxGroupLists);

  return (
    <ReportPage title="RX Group Lists">
      <EntityTable
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
            render: (r) => r.sourceMemberNames.length,
          },
        ]}
      />
    </ReportPage>
  );
}
