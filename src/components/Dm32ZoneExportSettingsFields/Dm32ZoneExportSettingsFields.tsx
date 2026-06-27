import { Checkbox, Stack, Text } from '@mantine/core';
import { useExportSettings } from '../../hooks/useExportSettings.ts';

export default function Dm32ZoneExportSettingsFields() {
  const {
    exportScratchChannels,
    setExportScratchChannels,
    exportZoneDerivedScanLists,
    setExportZoneDerivedScanLists,
  } = useExportSettings();

  return (
    <Stack gap="sm">
      <Text size="sm" fw={500}>
        Zone-derived export
      </Text>
      <Checkbox
        label="Export scratch channels when enabled for zone"
        description="Honours per-zone scratch channel flags. Disable to omit scratch rows from this download."
        checked={exportScratchChannels}
        onChange={(e) => setExportScratchChannels(e.currentTarget.checked)}
      />
      <Checkbox
        label="Export scan lists when enabled for zone"
        description="Honours per-zone scan list flags — emits Scan.csv, scan carrier channels, and wires scan list FKs."
        checked={exportZoneDerivedScanLists}
        onChange={(e) => setExportZoneDerivedScanLists(e.currentTarget.checked)}
      />
    </Stack>
  );
}
