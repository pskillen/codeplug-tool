import { Button, Group, Modal, Stack, Table, Text } from '@mantine/core';
import { useMemo, useState } from 'react';
import {
  BrandMeisterDirectoryError,
  fetchStaticTalkgroups,
} from '../../lib/repeaterDirectories/registry.ts';
import {
  diffRxGroupListFromBrandMeister,
  findBrandMeisterDeviceIdForRxList,
} from '../../lib/repeaterDirectories/brandmeister/rxListDiff.ts';
import { entityDiffHasChanges } from '../../lib/repeaterDirectories/brandmeister/entityDiff.ts';
import { resolveTalkGroupsFromStatic } from '../../lib/repeaterDirectories/brandmeister/mapTalkGroups.ts';
import { staticTalkgroupSlots } from '../../lib/repeaterDirectories/brandmeister/mapTalkGroups.ts';
import type { RxGroupList, RxGroupListMember } from '../../models/codeplug.ts';
import { useCodeplug } from '../../state/codeplugStore.tsx';

export interface BrandMeisterRxListVerifyProps {
  rxGroupList: RxGroupList;
}

export default function BrandMeisterRxListVerify({ rxGroupList }: BrandMeisterRxListVerifyProps) {
  const { codeplug, setRxGroupListMembers } = useCodeplug();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diffOpen, setDiffOpen] = useState(false);
  const [diffRows, setDiffRows] = useState<ReturnType<typeof diffRxGroupListFromBrandMeister>>([]);
  const [pendingMemberRefs, setPendingMemberRefs] = useState<RxGroupListMember[] | null>(null);

  const deviceId = useMemo(
    () => findBrandMeisterDeviceIdForRxList(rxGroupList, codeplug),
    [rxGroupList, codeplug],
  );

  const handleCheck = async () => {
    if (deviceId == null) {
      setError('Link a BrandMeister channel to this RX list to verify membership.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const staticTgs = await fetchStaticTalkgroups(deviceId);
      const rows = diffRxGroupListFromBrandMeister(rxGroupList, staticTgs, codeplug);
      setDiffRows(rows);

      if (!entityDiffHasChanges(rows)) {
        setPendingMemberRefs(null);
        setDiffOpen(true);
        return;
      }

      const resolved = await resolveTalkGroupsFromStatic(staticTgs, codeplug.talkGroups);
      const idByNumber = new Map(resolved.idByNumber);
      for (const tg of codeplug.talkGroups) {
        const key = tg.number.trim();
        if (key) idByNumber.set(key, tg.id);
      }

      const refs: RxGroupListMember[] = [];
      for (const { number, timeslot } of staticTalkgroupSlots(staticTgs)) {
        const id = idByNumber.get(number);
        if (!id) continue;
        refs.push({ ref: { kind: 'talkGroup', id }, timeslot });
      }

      if (refs.length === 0) {
        setError('Remote talk groups are not present in this codeplug — add them first.');
        return;
      }

      setPendingMemberRefs(refs);
      setDiffOpen(true);
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

  const handleApply = () => {
    if (pendingMemberRefs) {
      setRxGroupListMembers(rxGroupList.id, pendingMemberRefs);
    }
    setDiffOpen(false);
  };

  return (
    <>
      <Stack gap={4}>
        <Button
          variant="light"
          size="sm"
          loading={loading}
          disabled={deviceId == null}
          onClick={() => void handleCheck()}
        >
          Check BrandMeister
        </Button>
        {deviceId == null ? (
          <Text size="xs" c="dimmed" maw={220}>
            Assign this list to a channel imported from BrandMeister first.
          </Text>
        ) : null}
        {error ? (
          <Text size="xs" c="red" maw={220}>
            {error}
          </Text>
        ) : null}
      </Stack>

      <Modal opened={diffOpen} onClose={() => setDiffOpen(false)} title="BrandMeister vs local" size="lg">
        {!entityDiffHasChanges(diffRows) ? (
          <Text size="sm">RX group list membership matches the repeater static talk groups.</Text>
        ) : (
          <Stack gap="md">
            <Table withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Field</Table.Th>
                  <Table.Th>Local</Table.Th>
                  <Table.Th>Remote</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {diffRows
                  .filter((r) => r.changed)
                  .map((row) => (
                    <Table.Tr key={row.field}>
                      <Table.Td>{row.label}</Table.Td>
                      <Table.Td>{row.local}</Table.Td>
                      <Table.Td>{row.remote}</Table.Td>
                    </Table.Tr>
                  ))}
              </Table.Tbody>
            </Table>
            <Text size="xs" c="dimmed">
              Apply replaces membership with the repeater static talk group set.
            </Text>
          </Stack>
        )}
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setDiffOpen(false)}>
            Close
          </Button>
          {pendingMemberRefs ? <Button onClick={handleApply}>Apply membership</Button> : null}
        </Group>
      </Modal>
    </>
  );
}
