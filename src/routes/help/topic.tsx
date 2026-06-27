import { Stack } from '@mantine/core';
import { Navigate, useParams } from 'react-router-dom';
import { Page, PageHeader } from '../../components/ui/index.ts';
import FormatVarianceTable from '../../components/help/FormatVarianceTable.tsx';
import HelpMarkdown from '../../components/help/HelpMarkdown.tsx';
import { glossaryMarkdown } from '../../content/help/glossary.ts';
import { getHelpEntry, hubTopics } from '../../content/help/manifest.ts';
import type { HelpHubTopicId } from '../../content/help/types.ts';

function isHubTopic(id: string): id is HelpHubTopicId {
  return (hubTopics as readonly string[]).includes(id);
}

export default function HelpTopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  if (!topicId || !isHubTopic(topicId)) {
    return <Navigate to="/help" replace />;
  }

  const entry = getHelpEntry(topicId);
  if (!entry) {
    return <Navigate to="/help" replace />;
  }

  let body = entry.body ?? '';
  if (topicId === 'glossary') {
    body = glossaryMarkdown();
  }

  return (
    <Page width="wide">
      <PageHeader title={entry.title} description={entry.short} />
      <Stack gap="md">
        <HelpMarkdown content={body} />
        {topicId === 'exporting' ? (
          <>
            <FormatVarianceTable varianceId="rxGroupListExport" />
            <FormatVarianceTable varianceId="multiModeExport" />
            <FormatVarianceTable varianceId="exportNamePipeline" />
          </>
        ) : null}
        {topicId === 'zones' ? (
          <>
            <FormatVarianceTable varianceId="zoneAndScan" />
            <FormatVarianceTable varianceId="zoneDerivedExport" />
          </>
        ) : null}
        {topicId === 'talk-groups-contacts-rgl' ? (
          <FormatVarianceTable varianceId="rxGroupListExport" />
        ) : null}
      </Stack>
    </Page>
  );
}
