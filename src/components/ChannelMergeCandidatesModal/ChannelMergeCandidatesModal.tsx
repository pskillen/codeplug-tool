import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useCallback, useMemo, useState } from 'react';
import ModePill from '../crud/ModePill.tsx';
import {
  applyChannelMerges,
  findChannelMergeCandidates,
  formatChannelMergeReportLines,
  previewChannelMerges,
  type ChannelMergeCandidateGroup,
  type ChannelMergeSelection,
} from '../../lib/channelMergeCandidates.ts';
import { formatFrequencyHz } from '../../lib/formatFrequency.ts';
import { entityRefDisplayName } from '../../lib/entityRefs.ts';
import type { Channel, Codeplug } from '../../models/codeplug.ts';
import { useCodeplug } from '../../state/codeplugStore.tsx';

export interface ChannelMergeCandidatesModalProps {
  opened: boolean;
  onClose: () => void;
}

function channelById(codeplug: Codeplug, id: string): Channel | undefined {
  return codeplug.channels.find((ch) => ch.id === id);
}

function selectionsFromCandidates(
  candidates: ChannelMergeCandidateGroup[],
): ChannelMergeSelection[] {
  return candidates.map((group) => ({
    groupId: group.id,
    sourceChannelIds: group.sourceChannelIds,
    resultName: group.suggestedName,
    enabled: group.mergeKind === 'multiMode',
  }));
}

function SourceChannelSummary({ channel, codeplug }: { channel: Channel; codeplug: Codeplug }) {
  const contact =
    entityRefDisplayName(channel.contactRef, codeplug.talkGroups, codeplug.contacts) || '—';
  const rgl = channel.rxGroupListId
    ? (codeplug.rxGroupLists.find((r) => r.id === channel.rxGroupListId)?.name ?? '—')
    : '—';

  return (
    <Stack gap={4}>
      <Group gap="xs" wrap="wrap">
        <Text size="sm" fw={500}>
          {channel.name}
        </Text>
        <ModePill mode={channel.mode} size="xs" />
      </Group>
      <Text size="xs" c="dimmed">
        RX {formatFrequencyHz(channel.rxFrequency)} · TX {formatFrequencyHz(channel.txFrequency)}
      </Text>
      <Text size="xs" c="dimmed">
        Contact {contact} · RX list {rgl}
      </Text>
    </Stack>
  );
}

export default function ChannelMergeCandidatesModal({
  opened,
  onClose,
}: ChannelMergeCandidatesModalProps) {
  const { codeplug, applyChannelMerges: applyMerges } = useCodeplug();
  const candidates = useMemo(() => findChannelMergeCandidates(codeplug), [codeplug]);
  const [selections, setSelections] = useState(() => selectionsFromCandidates(candidates));
  const [appliedSummary, setAppliedSummary] = useState<string | null>(null);

  const enabledSelections = selections.filter((s) => s.enabled);
  const previews = useMemo(
    () => previewChannelMerges(codeplug, enabledSelections),
    [codeplug, enabledSelections],
  );

  const toggleGroup = useCallback((groupId: string, enabled: boolean) => {
    setSelections((prev) => prev.map((s) => (s.groupId === groupId ? { ...s, enabled } : s)));
  }, []);

  const setResultName = useCallback((groupId: string, resultName: string) => {
    setSelections((prev) => prev.map((s) => (s.groupId === groupId ? { ...s, resultName } : s)));
  }, []);

  const handleApply = useCallback(() => {
    const { report } = applyChannelMerges(codeplug, selections, candidates);
    applyMerges(selections, candidates);
    const lines = formatChannelMergeReportLines(report);
    setAppliedSummary(lines.length > 0 ? lines.join(' · ') : 'No merges applied');
    onClose();
  }, [applyMerges, candidates, codeplug, onClose, selections]);

  const applyCount = enabledSelections.filter((s) => {
    const group = candidates.find((g) => g.id === s.groupId);
    return group?.mergeKind === 'multiMode';
  }).length;

  const hasValidationErrors = previews.some((p) =>
    p.validationIssues.some((i) => i.severity === 'error'),
  );

  return (
    <>
      {appliedSummary ? (
        <Text size="sm" c="dimmed">
          Merge applied: {appliedSummary}
        </Text>
      ) : null}

      <Modal opened={opened} onClose={onClose} title="Merge channel candidates" size="lg">
        <Stack gap="md">
          {candidates.length === 0 ? (
            <Alert color="blue">No merge candidates found in this codeplug.</Alert>
          ) : (
            candidates.map((group) => {
              const selection = selections.find((s) => s.groupId === group.id);
              const sources = group.sourceChannelIds
                .map((id) => channelById(codeplug, id))
                .filter((ch): ch is Channel => ch != null);
              const preview = previews.find((p) => p.groupId === group.id);
              const isActionable = group.mergeKind === 'multiMode';

              return (
                <Stack
                  key={group.id}
                  gap="xs"
                  p="sm"
                  style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 8 }}
                >
                  <Group justify="space-between" align="flex-start">
                    <Checkbox
                      label="Apply this merge"
                      checked={selection?.enabled ?? false}
                      disabled={!isActionable}
                      onChange={(e) => toggleGroup(group.id, e.currentTarget.checked)}
                    />
                    {isActionable ? (
                      <Badge color="teal" variant="light">
                        Multi-mode
                      </Badge>
                    ) : group.mergeKind === 'multiTalkgroup' ? (
                      <Badge color="gray" variant="light">
                        Multi-talkgroup (not yet supported)
                      </Badge>
                    ) : (
                      <Badge color="orange" variant="light">
                        Ambiguous
                      </Badge>
                    )}
                  </Group>

                  {group.ambiguousReason ? (
                    <Text size="xs" c="orange">
                      {group.ambiguousReason}
                    </Text>
                  ) : null}

                  {sources.map((ch) => (
                    <SourceChannelSummary key={ch.id} channel={ch} codeplug={codeplug} />
                  ))}

                  {isActionable ? (
                    <TextInput
                      label="Result name"
                      value={selection?.resultName ?? group.suggestedName}
                      onChange={(e) => setResultName(group.id, e.currentTarget.value)}
                      size="sm"
                    />
                  ) : null}

                  {preview?.validationIssues.some((i) => i.severity === 'error') ? (
                    <Alert color="red" title="Validation">
                      {preview.validationIssues
                        .filter((i) => i.severity === 'error')
                        .map((i) => (
                          <Text key={i.field} size="sm">
                            {i.message}
                          </Text>
                        ))}
                    </Alert>
                  ) : null}
                </Stack>
              );
            })
          )}

          {hasValidationErrors ? (
            <Alert color="yellow">
              One or more selected merges have validation errors and will be skipped on apply.
            </Alert>
          ) : null}

          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={applyCount === 0}>
              Apply {applyCount} merge{applyCount === 1 ? '' : 's'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
