import { Alert, Badge, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useCallback, useMemo, useState } from 'react';
import {
  applyTalkGroupMerges,
  findTalkGroupMergeCandidateGroups,
  formatTalkGroupMergeReportLines,
  previewTalkGroupMerges,
  type TalkGroupMergeCandidateGroup,
  type TalkGroupMergeSelection,
} from '../../lib/talkGroupMergeCandidates.ts';
import type { Codeplug, TalkGroup } from '../../models/codeplug.ts';
import { useCodeplug } from '../../state/codeplugStore.tsx';

export interface TalkGroupMergeCandidatesModalProps {
  opened: boolean;
  onClose: () => void;
}

function talkGroupById(talkGroups: TalkGroup[], id: string): TalkGroup | undefined {
  return talkGroups.find((tg) => tg.id === id);
}

function SourceTalkGroupSummary({ talkGroup }: { talkGroup: TalkGroup }) {
  return (
    <Stack gap={4}>
      <Text size="sm" fw={500}>
        {talkGroup.name}
      </Text>
      <Text size="xs" c="dimmed">
        DMR ID {talkGroup.number || '—'}
      </Text>
    </Stack>
  );
}

function CandidateGroupCard({
  group,
  merged,
  snapshotTalkGroups,
  resultName,
  onResultNameChange,
  preview,
  onMerge,
}: {
  group: TalkGroupMergeCandidateGroup;
  merged: boolean;
  snapshotTalkGroups: TalkGroup[];
  resultName: string;
  onResultNameChange: (name: string) => void;
  preview: ReturnType<typeof previewTalkGroupMerges>[number] | undefined;
  onMerge: () => void;
}) {
  const sources = group.sourceTalkGroupIds
    .map((id) => talkGroupById(snapshotTalkGroups, id))
    .filter((tg): tg is TalkGroup => tg != null);
  const isActionable = group.mergeKind === 'timeslotFamily';
  const hasErrors = preview?.validationIssues.some((i) => i.severity === 'error');

  return (
    <Stack
      gap="xs"
      p="sm"
      style={{
        border: '1px solid var(--mantine-color-gray-3)',
        borderRadius: 8,
        opacity: merged ? 0.55 : 1,
        background: merged ? 'var(--mantine-color-gray-0)' : undefined,
      }}
    >
      <Group justify="space-between" align="flex-start">
        {merged ? (
          <Text size="sm" c="dimmed" fw={500}>
            Merged
          </Text>
        ) : null}
        {group.mergeKind === 'timeslotFamily' ? (
          <Badge color="teal" variant="light" ml="auto">
            Timeslot family
          </Badge>
        ) : (
          <Badge color="orange" variant="light" ml="auto">
            Ambiguous
          </Badge>
        )}
      </Group>

      {group.ambiguousReason ? (
        <Text size="xs" c="orange">
          {group.ambiguousReason}
        </Text>
      ) : null}

      {sources.map((tg) => (
        <SourceTalkGroupSummary key={tg.id} talkGroup={tg} />
      ))}

      {isActionable && !merged ? (
        <>
          <TextInput
            label="Result name"
            value={resultName}
            onChange={(e) => onResultNameChange(e.currentTarget.value)}
            size="sm"
          />

          {preview && preview.rglImpacts.length > 0 ? (
            <Stack gap={4}>
              <Text size="xs" fw={500}>
                RX group list updates
              </Text>
              {preview.rglImpacts.map((impact) => (
                <Text key={impact.rglId} size="xs" c="dimmed">
                  {impact.rglName}: {impact.absorbedMemberLabels.join(', ')} →{' '}
                  {impact.survivorLabel}
                </Text>
              ))}
            </Stack>
          ) : null}

          {preview && preview.channelImpacts.length > 0 ? (
            <Stack gap={4}>
              <Text size="xs" fw={500}>
                Channel TX contact updates
              </Text>
              {preview.channelImpacts.map((impact) => (
                <Text key={impact.channelId} size="xs" c="dimmed">
                  {impact.channelName}
                </Text>
              ))}
            </Stack>
          ) : null}
        </>
      ) : null}

      {preview?.validationIssues.some((i) => i.severity === 'error') ? (
        <Alert color="red" variant="light">
          {preview.validationIssues
            .filter((i) => i.severity === 'error')
            .map((i) => (
              <Text key={i.field} size="sm">
                {i.message}
              </Text>
            ))}
        </Alert>
      ) : null}

      {isActionable ? (
        <Group justify="flex-end">
          <Button onClick={onMerge} disabled={merged || hasErrors}>
            {merged ? 'Merged' : 'Merge'}
          </Button>
        </Group>
      ) : null}
    </Stack>
  );
}

export default function TalkGroupMergeCandidatesModal({
  opened,
  onClose,
}: TalkGroupMergeCandidatesModalProps) {
  const { codeplug, applyTalkGroupMerges: applyMerges } = useCodeplug();
  const [snapshotTalkGroups] = useState(() => codeplug.talkGroups);
  const [mergedGroups, setMergedGroups] = useState<TalkGroupMergeCandidateGroup[]>([]);
  const [resultNames, setResultNames] = useState<Record<string, string>>({});
  const [lastMergeNote, setLastMergeNote] = useState<string | null>(null);

  const candidates = useMemo(() => findTalkGroupMergeCandidateGroups(codeplug), [codeplug]);

  const mergedIds = useMemo(() => new Set(mergedGroups.map((g) => g.id)), [mergedGroups]);

  const activeCandidates = useMemo(
    () => candidates.filter((g) => !mergedIds.has(g.id)),
    [candidates, mergedIds],
  );

  const displayGroups = useMemo(
    () => [...mergedGroups, ...activeCandidates],
    [mergedGroups, activeCandidates],
  );

  const setResultName = useCallback((groupId: string, resultName: string) => {
    setResultNames((prev) => ({ ...prev, [groupId]: resultName }));
  }, []);

  const buildSelection = useCallback(
    (group: TalkGroupMergeCandidateGroup): TalkGroupMergeSelection => ({
      groupId: group.id,
      sourceTalkGroupIds: group.sourceTalkGroupIds,
      resultName: resultNames[group.id]?.trim() || group.suggestedName,
      enabled: true,
    }),
    [resultNames],
  );

  const previewForGroup = useCallback(
    (group: TalkGroupMergeCandidateGroup) =>
      previewTalkGroupMerges(codeplug, [buildSelection(group)], candidates)[0],
    [buildSelection, codeplug, candidates],
  );

  const handleMergeOne = useCallback(
    (group: TalkGroupMergeCandidateGroup) => {
      if (mergedIds.has(group.id) || group.mergeKind !== 'timeslotFamily') return;

      const selection = buildSelection(group);
      const preview = previewForGroup(group);
      if (preview?.validationIssues.some((i) => i.severity === 'error')) return;

      const { report } = applyTalkGroupMerges(codeplug, [selection], [group]);
      applyMerges([selection], [group]);
      setMergedGroups((prev) => [...prev, group]);
      const lines = formatTalkGroupMergeReportLines(report);
      setLastMergeNote(lines.join(' · ') || `Merged into "${selection.resultName}"`);
    },
    [applyMerges, buildSelection, codeplug, mergedIds, previewForGroup],
  );

  const displayCodeplug: Codeplug = useMemo(
    () => ({ ...codeplug, talkGroups: snapshotTalkGroups }),
    [codeplug, snapshotTalkGroups],
  );

  return (
    <Modal opened={opened} onClose={onClose} title="Merge talk group candidates" size="lg">
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Combines per-slot talk group contacts (e.g. Scotland TS1 and Scotland TS2) into one
          logical talk group. RX group list member slots are preserved.
        </Text>

        {lastMergeNote ? (
          <Alert color="green" variant="light">
            {lastMergeNote}
          </Alert>
        ) : null}

        {displayGroups.length === 0 ? (
          <Alert color="blue">No merge candidates found.</Alert>
        ) : (
          displayGroups.map((group) => (
            <CandidateGroupCard
              key={group.id}
              group={group}
              merged={mergedIds.has(group.id)}
              snapshotTalkGroups={displayCodeplug.talkGroups}
              resultName={resultNames[group.id] ?? group.suggestedName}
              onResultNameChange={(name) => setResultName(group.id, name)}
              preview={mergedIds.has(group.id) ? undefined : previewForGroup(group)}
              onMerge={() => handleMergeOne(group)}
            />
          ))
        )}

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
