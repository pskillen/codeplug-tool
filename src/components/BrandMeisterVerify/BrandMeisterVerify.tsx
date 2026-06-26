import { Alert, Button, Checkbox, Group, Modal, Radio, Stack, Table, Text } from '@mantine/core';
import { useMemo, useState } from 'react';
import {
  BrandMeisterDirectoryError,
  fetchDevicesByCallsign,
  fetchDeviceById,
} from '../../lib/repeaterDirectories/registry.ts';
import type { BrandMeisterDevice } from '../../lib/repeaterDirectories/registry.ts';
import { matchDeviceForChannel } from '../../lib/repeaterDirectories/brandmeister/matchDevice.ts';
import {
  buildPatchFromDeviceDiff,
  brandMeisterProvenancePatch,
  diffChannelFromDevice,
  diffHasChanges,
} from '../../lib/repeaterDirectories/brandmeister/channelDiff.ts';
import type { ChannelDiffField, ChannelDiffRow } from '../../lib/repeaterDirectories/brandmeister/channelDiff.ts';
import { isMapDeviceSkip, mapDeviceToChannelInput } from '../../lib/repeaterDirectories/brandmeister/mapToChannel.ts';
import { toTitleCase } from '../../lib/titleCase.ts';
import { validateChannel } from '../../lib/validation/channel.ts';
import type { Channel } from '../../models/codeplug.ts';
import { useCodeplug } from '../../state/codeplugStore.tsx';

export interface BrandMeisterVerifyProps {
  channel: Channel;
}

function formatDeviceLabel(device: BrandMeisterDevice, titleCaseNames: boolean): string {
  const city = device.city ? (titleCaseNames ? toTitleCase(device.city) : device.city) : '—';
  const status = device.statusText
    ? titleCaseNames
      ? toTitleCase(device.statusText)
      : device.statusText
    : '—';
  return `${device.callsign} — id ${device.id} — ${city} (${status})`;
}

export default function BrandMeisterVerify({ channel }: BrandMeisterVerifyProps) {
  const { codeplug, updateChannel } = useCodeplug();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<BrandMeisterDevice[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [diffOpen, setDiffOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<BrandMeisterDevice | null>(null);
  const [selectedFields, setSelectedFields] = useState<Set<ChannelDiffField>>(new Set());
  const [applyError, setApplyError] = useState<string | null>(null);
  const [titleCaseNames, setTitleCaseNames] = useState(true);

  const mapOptions = useMemo(() => ({ titleCaseText: titleCaseNames }), [titleCaseNames]);

  const diffRows: ChannelDiffRow[] = useMemo(() => {
    if (!selectedDevice) return [];
    return diffChannelFromDevice(channel, selectedDevice, mapOptions);
  }, [channel, selectedDevice, mapOptions]);

  const changedRows = useMemo(() => diffRows.filter((r) => r.changed), [diffRows]);

  const openDiffForDevice = (device: BrandMeisterDevice) => {
    setSelectedDevice(device);
    const rows = diffChannelFromDevice(channel, device, mapOptions);
    const changed = rows.filter((r) => r.changed).map((r) => r.field);
    setSelectedFields(new Set(changed));
    setApplyError(null);
    setDiffOpen(true);
  };

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      let results: BrandMeisterDevice[] = [];
      const remoteId = channel.meta?.repeaterDirectory?.remoteListingId;
      if (
        remoteId != null &&
        channel.meta?.repeaterDirectory?.sourceId === 'brandmeister'
      ) {
        const byId = await fetchDeviceById(remoteId);
        if (byId) results = [byId];
      }
      if (results.length === 0 && channel.callsign.trim()) {
        results = await fetchDevicesByCallsign(channel.callsign);
      }
      if (results.length === 0) {
        setError(`No BrandMeister devices found for ${channel.callsign || 'this channel'}.`);
        return;
      }

      const auto = matchDeviceForChannel(channel, results);
      if (auto) {
        openDiffForDevice(auto);
        return;
      }

      setDevices(results);
      setPickerOpen(true);
    } catch (err) {
      if (err instanceof BrandMeisterDirectoryError) {
        setError(err.message);
      } else {
        setError('Could not query BrandMeister.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleField = (field: ChannelDiffField, checked: boolean) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (checked) next.add(field);
      else next.delete(field);
      return next;
    });
  };

  const handleApply = () => {
    if (!selectedDevice) return;
    setApplyError(null);

    const fields = [...selectedFields];
    const patch = buildPatchFromDeviceDiff(selectedDevice, fields, mapOptions);

    if (fields.includes('name') && patch.name) {
      const issues = validateChannel(
        { ...channel, ...patch, name: patch.name },
        codeplug,
        channel.id,
      );
      const nameIssue = issues.find((i) => i.field === 'name' && i.severity === 'error');
      if (nameIssue) {
        setApplyError(nameIssue.message);
        return;
      }
    }

    const mapped = mapDeviceToChannelInput(selectedDevice, undefined, mapOptions);
    if (isMapDeviceSkip(mapped)) {
      setApplyError(mapped.reason);
      return;
    }

    updateChannel(channel.id, {
      ...patch,
      meta: {
        ...channel.meta,
        ...brandMeisterProvenancePatch(selectedDevice),
      },
    });
    setDiffOpen(false);
  };

  const nameSelected = selectedFields.has('name');

  return (
    <>
      <Stack gap={4}>
        <Button variant="light" size="sm" loading={loading} onClick={() => void handleCheck()}>
          Check BrandMeister
        </Button>
        {error ? (
          <Text size="xs" c="red" maw={220}>
            {error}
          </Text>
        ) : null}
      </Stack>

      <Modal
        opened={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Select BrandMeister device"
        size="lg"
      >
        <Checkbox
          label="Title case names"
          checked={titleCaseNames}
          onChange={(e) => setTitleCaseNames(e.currentTarget.checked)}
          mb="sm"
        />
        <Radio.Group
          value={selectedDevice ? String(selectedDevice.id) : null}
          onChange={(value) => {
            const device = devices.find((d) => String(d.id) === value) ?? null;
            setSelectedDevice(device);
          }}
        >
          <Stack gap="sm">
            {devices.map((device) => (
              <Radio
                key={device.id}
                value={String(device.id)}
                label={formatDeviceLabel(device, titleCaseNames)}
              />
            ))}
          </Stack>
        </Radio.Group>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setPickerOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={!selectedDevice}
            onClick={() => {
              if (selectedDevice) {
                setPickerOpen(false);
                openDiffForDevice(selectedDevice);
              }
            }}
          >
            Compare
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={diffOpen}
        onClose={() => setDiffOpen(false)}
        title="BrandMeister vs local"
        size="lg"
      >
        <Checkbox
          label="Title case names"
          checked={titleCaseNames}
          onChange={(e) => setTitleCaseNames(e.currentTarget.checked)}
          mb="sm"
        />
        {!diffHasChanges(diffRows) ? (
          <Text size="sm">Local channel matches the remote device.</Text>
        ) : (
          <Stack gap="md">
            <Table withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th />
                  <Table.Th>Field</Table.Th>
                  <Table.Th>Local</Table.Th>
                  <Table.Th>Remote</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {changedRows.map((row) => (
                  <Table.Tr key={row.field}>
                    <Table.Td>
                      <Checkbox
                        checked={selectedFields.has(row.field)}
                        onChange={(e) => toggleField(row.field, e.currentTarget.checked)}
                        aria-label={`Apply ${row.label}`}
                      />
                    </Table.Td>
                    <Table.Td>{row.label}</Table.Td>
                    <Table.Td>{row.local}</Table.Td>
                    <Table.Td>{row.remote}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            {nameSelected ? (
              <Text size="xs" c="dimmed">
                Applying a name change updates the CPS export label. Zone membership is unchanged.
              </Text>
            ) : null}

            {applyError ? (
              <Alert color="red" title="Cannot apply">
                {applyError}
              </Alert>
            ) : null}
          </Stack>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setDiffOpen(false)}>
            Close
          </Button>
          {diffHasChanges(diffRows) ? (
            <Button disabled={selectedFields.size === 0} onClick={handleApply}>
              Apply selected
            </Button>
          ) : null}
        </Group>
      </Modal>
    </>
  );
}
