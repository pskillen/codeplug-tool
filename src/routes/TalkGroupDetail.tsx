import { Anchor, Group, Stack, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link, useParams } from 'react-router-dom';
import EntityTable from '../components/report/EntityTable.tsx';
import DetailSections from '../components/report/DetailSections.tsx';
import NotFoundEntity from '../components/report/NotFoundEntity.tsx';
import ReportPage from '../components/report/ReportPage.tsx';
import { channelsWithTalkGroupName, findEntityById } from '../lib/reportLookup.ts';
import { useCodeplug } from '../state/codeplugStore.tsx';
import { ICON_SIZE_NAV, ICON_STROKE } from '../lib/iconSizes.ts';

import { modeLabel } from '../lib/channelModes.ts';
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
          <Group gap={4} wrap="nowrap">
            <IconArrowLeft size={ICON_SIZE_NAV} stroke={ICON_STROKE} />
            Talk groups
          </Group>
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
