import { SimpleGrid, Stack, Text } from '@mantine/core';
import {
  IconAddressBook,
  IconAntenna,
  IconFolders,
  IconListDetails,
  IconUsersGroup,
} from '@tabler/icons-react';
import SummaryCard from '../components/report/SummaryCard.tsx';
import ReportPage from '../components/report/ReportPage.tsx';
import { ICON_SIZE_NAV, ICON_STROKE } from '../lib/iconSizes.ts';
import { sortByName } from '../lib/reportLookup.ts';
import { useCodeplug } from '../state/codeplugStore.tsx';

function entityIcon(Icon: typeof IconAntenna) {
  return <Icon size={ICON_SIZE_NAV} stroke={ICON_STROKE} />;
}

export default function Summary() {
  const { codeplug } = useCodeplug();
  const { channels, zones, talkGroups, contacts, rxGroupLists, meta } = codeplug;

  const preview = <T extends { name: string }>(items: T[]) =>
    sortByName(items)
      .slice(0, 5)
      .map((i) => i.name);

  return (
    <ReportPage title="Summary">
      <Stack gap="md">
        {meta.importedAt ? (
          <Text size="sm" c="dimmed">
            Imported {new Date(meta.importedAt).toLocaleString()}
            {meta.sourceFiles.length ? ` · ${meta.sourceFiles.join(', ')}` : ''}
          </Text>
        ) : null}

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <SummaryCard
            title="Channels"
            count={channels.length}
            previewNames={preview(channels)}
            listPath="/channels"
            icon={entityIcon(IconAntenna)}
          />
          <SummaryCard
            title="Zones"
            count={zones.length}
            previewNames={preview(zones)}
            listPath="/zones"
            icon={entityIcon(IconFolders)}
          />
          <SummaryCard
            title="Talk groups"
            count={talkGroups.length}
            previewNames={preview(talkGroups)}
            listPath="/talk-groups"
            icon={entityIcon(IconUsersGroup)}
          />
          <SummaryCard
            title="Contacts"
            count={contacts.length}
            previewNames={preview(contacts)}
            listPath="/contacts"
            icon={entityIcon(IconAddressBook)}
          />
          <SummaryCard
            title="RX Group Lists"
            count={rxGroupLists.length}
            previewNames={preview(rxGroupLists)}
            listPath="/rx-group-lists"
            icon={entityIcon(IconListDetails)}
          />
        </SimpleGrid>
      </Stack>
    </ReportPage>
  );
}
