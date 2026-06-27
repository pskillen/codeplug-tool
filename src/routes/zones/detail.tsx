import { Anchor, Button, Group, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft, IconPencil, IconTrash } from '@tabler/icons-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CodeplugMap from '../../components/CodeplugMap/CodeplugMap.tsx';
import ConfirmDeleteModal from '../../components/crud/ConfirmDeleteModal.tsx';
import { DataTable, Page, PageHeader } from '../../components/ui/index.ts';
import DetailSections from '../../components/report/DetailSections.tsx';
import NotFoundEntity from '../../components/report/NotFoundEntity.tsx';
import UseMyLocationButton from '../../components/UseMyLocationButton/UseMyLocationButton.tsx';
import { channelsForZone, findEntityById } from '../../lib/reportLookup.ts';
import { useCodeplug } from '../../state/codeplugStore.tsx';
import { useOperatorPosition } from '../../state/operatorPosition.tsx';
import { ICON_SIZE_NAV, ICON_STROKE } from '../../lib/iconSizes.ts';

import { formatFrequencyHz } from '../../lib/formatFrequency.ts';
import { modeLabel } from '../../lib/channelModes.ts';
import { memberIncludesInScanList } from '../../lib/zones.ts';
import { DEFAULT_SCAN_CARRIER_FREQUENCY_HZ } from '../../lib/zoneDerivedScanLists/index.ts';
export default function ZoneDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { codeplug, deleteZone } = useCodeplug();
  const { position, setPosition, clearPosition } = useOperatorPosition();
  const [deleteOpen, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const zone = id ? findEntityById(codeplug.zones, id) : null;

  if (!zone) {
    return (
      <Page>
        <PageHeader title="Zone" />
        <NotFoundEntity entityLabel="Zone" listPath="/zones" />
      </Page>
    );
  }

  const members = channelsForZone(zone, codeplug.channels);
  const memberByChannelId = new Map(zone.members.map((m) => [m.channelId, m]));

  const exportFields: { label: string; value: string }[] = [
    { label: 'Name', value: zone.name },
    { label: 'Member channels', value: String(members.length) },
  ];
  if (zone.exportScratchChannel) {
    exportFields.push({ label: 'Export scratch channel', value: 'Yes' });
  }
  if (zone.exportScanList) {
    const carrierHz = zone.scanCarrierFrequencyHz ?? DEFAULT_SCAN_CARRIER_FREQUENCY_HZ;
    exportFields.push({ label: 'Export scan list', value: 'Yes' });
    exportFields.push({
      label: 'Scan carrier',
      value: formatFrequencyHz(carrierHz).replace(' MHz', ' MHz'),
    });
  }

  const confirmDelete = () => {
    deleteZone(zone.id);
    closeDelete();
    navigate('/zones');
  };

  return (
    <Page>
      <PageHeader title={zone.name} />
      <Stack gap="lg">
        <Group justify="space-between">
          <Anchor component={Link} to="/zones" size="sm">
            <Group gap={4} wrap="nowrap">
              <IconArrowLeft size={ICON_SIZE_NAV} stroke={ICON_STROKE} />
              Zones
            </Group>
          </Anchor>
          <Group gap="sm">
            <Button
              component={Link}
              to={`/zones/${zone.id}/edit`}
              variant="light"
              size="sm"
              leftSection={<IconPencil size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
            >
              Edit
            </Button>
            <Button
              color="red"
              variant="light"
              size="sm"
              onClick={openDelete}
              leftSection={<IconTrash size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
            >
              Delete
            </Button>
          </Group>
        </Group>

        <DetailSections
          sections={[
            {
              title: 'Overview',
              fields: exportFields,
            },
          ]}
        />

        <Stack gap="sm">
          <Title order={3}>Member channels</Title>
          <DataTable
            variant="embedded"
            rows={members}
            rowKey={(ch) => ch.id}
            nameColumn={{
              getName: (ch) => ch.name,
              getPath: (ch) => `/channels/${ch.id}`,
            }}
            columns={[
              {
                key: 'mode',
                header: 'Mode',
                render: (ch) => modeLabel(ch.mode),
                sortValue: (ch) => modeLabel(ch.mode),
              },
              {
                key: 'rx',
                header: 'RX MHz',
                render: (ch) =>
                  ch.rxFrequency ? formatFrequencyHz(ch.rxFrequency).replace(' MHz', '') : '—',
                sortValue: (ch) => ch.rxFrequency,
              },
              {
                key: 'scan',
                header: 'In scan list',
                render: (ch) => {
                  const member = memberByChannelId.get(ch.id);
                  return member && !memberIncludesInScanList(member) ? 'No' : 'Yes';
                },
                sortValue: (ch) => {
                  const member = memberByChannelId.get(ch.id);
                  return member && !memberIncludesInScanList(member) ? 0 : 1;
                },
              },
            ]}
          />
        </Stack>

        <Stack gap="sm">
          <Title order={3}>Map</Title>
          {position ? (
            <Group gap="sm" align="center">
              {position.accuracyMeters != null && Number.isFinite(position.accuracyMeters) ? (
                <Text size="sm" c="dimmed">
                  My location accuracy ±{Math.round(position.accuracyMeters)} m
                </Text>
              ) : null}
              <Button variant="subtle" size="compact-sm" onClick={clearPosition}>
                Clear my location
              </Button>
            </Group>
          ) : (
            <UseMyLocationButton
              label="Show my location"
              onLocation={(lat, lon, accuracyMeters) =>
                setPosition({ lat, lon, accuracyMeters: accuracyMeters ?? null })
              }
            />
          )}
          <CodeplugMap
            channels={members}
            zones={[zone]}
            allChannels={codeplug.channels}
            talkGroups={codeplug.talkGroups}
            contacts={codeplug.contacts}
            rxGroupLists={codeplug.rxGroupLists}
            defaultShowZones
            operatorPosition={position}
          />
        </Stack>
      </Stack>

      <ConfirmDeleteModal
        opened={deleteOpen}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        title="Delete zone"
        entityName={zone.name}
      />
    </Page>
  );
}
