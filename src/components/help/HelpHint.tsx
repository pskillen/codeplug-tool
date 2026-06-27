import { Group } from '@mantine/core';
import type { ReactNode } from 'react';
import HelpPopover from './HelpPopover.tsx';
import type { HelpTopicId } from '../../content/help/types.ts';

export interface HelpHintProps {
  label: ReactNode;
  helpId?: HelpTopicId;
}

/** Form label row with optional help popover. */
export default function HelpHint({ label, helpId }: HelpHintProps) {
  if (!helpId) return <>{label}</>;
  return (
    <Group gap={4} wrap="nowrap" display="inline-flex" align="center">
      <span>{label}</span>
      <HelpPopover helpId={helpId} />
    </Group>
  );
}
