import { Anchor, Stack, Title } from '@mantine/core';
import { Link, useParams } from 'react-router-dom';
import EntityTable from '../components/report/EntityTable.tsx';
import DetailSections from '../components/report/DetailSections.tsx';
import NotFoundEntity from '../components/report/NotFoundEntity.tsx';
import ReportPage from '../components/report/ReportPage.tsx';
import { channelsWithTalkGroupName, findEntityById } from '../lib/reportLookup.ts';
import type { Channel } from '../models/codeplug.ts';
import { useCodeplug } from '../state/codeplugStore.tsx';

function modeLabel(mode: Channel['mode']): string {
  if (mode === 'digital') return 'Digital';
  if (mode === 'analogue') return 'Analogue';
  return 'Other';
}

export default function TalkGroupDetail() {
  const { id } = useParams<{ id: string }>();
  const { codeplug } = useCodeplug();
  const talkGroup = id ? findEntityById(codeplug.talkGroups, id) : null;

  if (!talkGroup) {
    return (
      <ReportPage title="Talk group">
        <NotFoundEntity entityLabel="Talk group" listPath="/talk-groups" />
      </ReportPage>
    );
  }

  const usingChannels = channelsWithTalkGroupName(talkGroup.name, codeplug.channels);

  return (
    <ReportPage title={talkGroup.name}>
      <Stack gap="lg">
        <Anchor component={Link} to="/talk-groups" size="sm">
          ← Talk groups
        </Anchor>

        <DetailSections
          sections={[
            {
              title: 'Details',
              fields: [
                { label: 'Name', value: talkGroup.name },
                { label: 'DMR ID', value: talkGroup.number },
                { label: 'Timeslot override', value: talkGroup.timeslotOverride },
              ],
            },
          ]}
        />

        <Stack gap="sm">
          <Title order={3}>Channels using this talk group (TX contact)</Title>
          <EntityTable
            rows={usingChannels}
            rowKey={(ch) => ch.id}
            nameColumn={{
              getName: (ch) => ch.name,
              getPath: (ch) => `/channels/${ch.id}`,
            }}
            columns={[
              { key: 'mode', header: 'Mode', render: (ch) => modeLabel(ch.mode) },
              { key: 'rx', header: 'RX MHz', render: (ch) => ch.rxFrequency || '—' },
            ]}
          />
        </Stack>
      </Stack>
    </ReportPage>
  );
}
