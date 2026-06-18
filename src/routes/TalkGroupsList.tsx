import EntityTable from '../components/report/EntityTable.tsx';
import ReportPage from '../components/report/ReportPage.tsx';
import { channelsWithTalkGroupName, sortByName } from '../lib/reportLookup.ts';
import { useCodeplug } from '../state/codeplugStore.tsx';

export default function TalkGroupsList() {
  const { codeplug } = useCodeplug();
  const { channels, talkGroups } = codeplug;
  const sorted = sortByName(talkGroups);

  return (
    <ReportPage title="Talk groups">
      <EntityTable
        rows={sorted}
        rowKey={(tg) => tg.id}
        nameColumn={{
          getName: (tg) => tg.name,
          getPath: (tg) => `/talk-groups/${tg.id}`,
        }}
        columns={[
          { key: 'number', header: 'DMR ID', render: (tg) => tg.number || '—' },
          { key: 'ts', header: 'Timeslot', render: (tg) => tg.timeslotOverride || '—' },
          {
            key: 'channels',
            header: 'Channels using',
            render: (tg) => channelsWithTalkGroupName(tg.name, channels).length,
          },
        ]}
      />
    </ReportPage>
  );
}
