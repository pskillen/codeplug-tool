import { Button, Stack, Text } from '@mantine/core';
import { IconGitMerge, IconPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import TalkGroupMergeCandidatesModal from '../../TalkGroupMergeCandidatesModal/TalkGroupMergeCandidatesModal.tsx';
import { getHelpShort } from '../../../content/help/manifest.ts';
import { ICON_SIZE_NAV, ICON_STROKE } from '../../../lib/iconSizes.ts';
import type { SectionNavProps } from '../../../nav/sectionNavTypes.ts';

export default function TalkGroupsSectionNav({ variant }: SectionNavProps) {
  const isSidebar = variant === 'sidebar';
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [mergeSession, setMergeSession] = useState(0);

  return (
    <Stack gap="sm">
      <Button
        component={Link}
        to="/talk-groups/new"
        leftSection={<IconPlus size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
        fullWidth={isSidebar}
      >
        New talk group
      </Button>

      <Button
        variant="light"
        leftSection={<IconGitMerge size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
        fullWidth={isSidebar}
        onClick={() => {
          setMergeSession((s) => s + 1);
          setMergeModalOpen(true);
        }}
      >
        Find merge candidates
      </Button>
      <Text size="xs" c="dimmed">
        {getHelpShort('talkGroup.mergeCandidates')}
      </Text>

      <TalkGroupMergeCandidatesModal
        key={mergeSession}
        opened={mergeModalOpen}
        onClose={() => setMergeModalOpen(false)}
      />
    </Stack>
  );
}
