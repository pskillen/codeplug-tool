import { Alert, Collapse, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { getHelpEntry } from '../../content/help/manifest.ts';
import type { HelpTopicId } from '../../content/help/types.ts';
import { ICON_SIZE_ACTION, ICON_STROKE } from '../../lib/iconSizes.ts';

export interface HelpAlertProps {
  helpId: HelpTopicId;
  color?: string;
}

export default function HelpAlert({ helpId, color = 'blue' }: HelpAlertProps) {
  const entry = getHelpEntry(helpId);
  const [opened, { toggle }] = useDisclosure(false);
  if (!entry) return null;

  const hasMore = entry.body || entry.learnMoreSlug;

  return (
    <Alert color={color} title={entry.title} variant="light">
      {entry.short}
      {hasMore ? (
        <>
          {' '}
          <UnstyledButton onClick={toggle} style={{ fontSize: 'var(--mantine-font-size-sm)' }}>
            {opened ? 'Less' : 'More'}
            {opened ? (
              <IconChevronUp
                size={ICON_SIZE_ACTION}
                stroke={ICON_STROKE}
                style={{ verticalAlign: 'middle' }}
              />
            ) : (
              <IconChevronDown
                size={ICON_SIZE_ACTION}
                stroke={ICON_STROKE}
                style={{ verticalAlign: 'middle' }}
              />
            )}
          </UnstyledButton>
          <Collapse expanded={opened}>
            {entry.body ? (
              <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{entry.body}</div>
            ) : null}
            {entry.learnMoreSlug ? (
              <div style={{ marginTop: 8 }}>
                <Link to={`/help/${entry.learnMoreSlug}`}>Full guide</Link>
              </div>
            ) : null}
          </Collapse>
        </>
      ) : null}
    </Alert>
  );
}
