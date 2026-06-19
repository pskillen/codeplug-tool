import { Anchor, Group, Stack, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link, useParams } from 'react-router-dom';
import EntityTable from '../components/report/EntityTable.tsx';
import DetailSections from '../components/report/DetailSections.tsx';
import NotFoundEntity from '../components/report/NotFoundEntity.tsx';
import ReportPage from '../components/report/ReportPage.tsx';
import { channelsWithContactName, findEntityById } from '../lib/reportLookup.ts';
import { useCodeplug } from '../state/codeplugStore.tsx';
import { ICON_SIZE_NAV, ICON_STROKE } from '../lib/iconSizes.ts';

import { modeLabel } from '../lib/channelModes.ts';
export default function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const { codeplug } = useCodeplug();
  const contact = id ? findEntityById(codeplug.contacts, id) : null;

  if (!contact) {
    return (
      <ReportPage title="Contact">
        <NotFoundEntity entityLabel="Contact" listPath="/contacts" />
      </ReportPage>
    );
  }

  const usingChannels = channelsWithContactName(contact.name, codeplug.channels);

  return (
    <ReportPage title={contact.name}>
      <Stack gap="lg">
        <Anchor component={Link} to="/contacts" size="sm">
          <Group gap={4} wrap="nowrap">
            <IconArrowLeft size={ICON_SIZE_NAV} stroke={ICON_STROKE} />
            Contacts
          </Group>
        </Anchor>

        <DetailSections
          sections={[
            {
              title: 'Details',
              fields: [
                { label: 'Name', value: contact.name },
                { label: 'DMR ID', value: contact.number },
                { label: 'Timeslot override', value: contact.timeslotOverride },
              ],
            },
          ]}
        />

        <Stack gap="sm">
          <Title order={3}>Channels using this contact (TX contact)</Title>
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
