import { Text } from '@mantine/core';
import ReportPage from '../../components/report/ReportPage.tsx';

export default function MaidenheadConverter() {
  return (
    <ReportPage title="Maidenhead converter">
      <Text c="dimmed">Convert between Maidenhead grid locators and WGS84 coordinates.</Text>
    </ReportPage>
  );
}
