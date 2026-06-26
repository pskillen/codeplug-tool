import { Button, Checkbox, Group, Modal, Stack, Table, Text } from '@mantine/core';
import { useMemo, useState } from 'react';
import {
  BrandMeisterDirectoryError,
  fetchTalkgroupMeta,
} from '../../lib/repeaterDirectories/registry.ts';
import {
  diffTalkGroupFromBrandMeister,
  entityDiffHasChanges,
} from '../../lib/repeaterDirectories/brandmeister/entityDiff.ts';
import type { TalkGroup } from '../../models/codeplug.ts';
import { useCodeplug } from '../../state/codeplugStore.tsx';

export interface BrandMeisterTalkGroupVerifyProps {
  talkGroup: TalkGroup;
}

export default function BrandMeisterTalkGroupVerify({ talkGroup }: BrandMeisterTalkGroupVerifyProps) {
  const { updateTalkGroup } = useCodeplug();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diffOpen, setDiffOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [remoteName, setRemoteName] = useState<string | null>(null);

  const diffRows = useMemo(() => {
    if (!remoteName && !talkGroup.number) return [];
    return diffTalkGroupFromBrandMeister(talkGroup, {
      ID: Number.parseInt(talkGroup.number, 10) || 0,
      Name: remoteName ?? '',
    });
  }, [talkGroup, remoteName]);

  const changedRows = diffRows.filter((r) => r.changed);

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const meta = await fetchTalkgroupMeta(talkGroup.number);
      if (!meta) {
        setError(`Talk group ${talkGroup.number} not found on BrandMeister.`);
        return;
      }
      setRemoteName(meta.Name);
      const rows = diffTalkGroupFromBrandMeister(talkGroup, meta);
      setSelectedFields(new Set(rows.filter((r) => r.changed).map((r) => r.field)));
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
    if (!remoteName || !selectedFields.has('name')) {
      setDiffOpen(false);
      return;
    }
    updateTalkGroup(talkGroup.id, { name: remoteName });
    setDiffOpen(false);
  };

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

      <Modal opened={diffOpen} onClose={() => setDiffOpen(false)} title="BrandMeister vs local" size="lg">
        {!entityDiffHasChanges(diffRows) ? (
          <Text size="sm">Local talk group matches BrandMeister catalogue.</Text>
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
                        onChange={(e) => {
                          setSelectedFields((prev) => {
                            const next = new Set(prev);
                            if (e.currentTarget.checked) next.add(row.field);
                            else next.delete(row.field);
                            return next;
                          });
                        }}
                      />
                    </Table.Td>
                    <Table.Td>{row.label}</Table.Td>
                    <Table.Td>{row.local}</Table.Td>
                    <Table.Td>{row.remote}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        )}
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setDiffOpen(false)}>
            Close
          </Button>
          {entityDiffHasChanges(diffRows) ? (
            <Button disabled={selectedFields.size === 0} onClick={handleApply}>
              Apply selected
            </Button>
          ) : null}
        </Group>
      </Modal>
    </>
  );
}
