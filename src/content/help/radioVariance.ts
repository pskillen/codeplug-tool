import type { FormatVarianceRow, VarianceId } from './types.ts';

export const varianceTables: Record<VarianceId, { title: string; rows: FormatVarianceRow[] }> = {
  rxGroupListExport: {
    title: 'RX group list on export',
    rows: [
      {
        aspect: 'Channel rows',
        opengd77: 'One row keeps the list reference',
        dm32: 'One row per list member (fan-out)',
        chirp: 'n/a — analogue only',
      },
      {
        aspect: 'List members',
        opengd77: 'Stored in TG_Lists.csv',
        dm32: 'Becomes separate channel TX contacts',
        chirp: 'n/a',
      },
      {
        aspect: 'TX contact + list together',
        opengd77: 'Both columns set independently',
        dm32: 'Fan-out skipped if TX contact already set',
        chirp: 'n/a',
      },
    ],
  },
  multiModeExport: {
    title: 'Multi-mode channel on export',
    rows: [
      {
        aspect: 'Wire rows',
        opengd77: 'Split to -F / -D suffix rows',
        dm32: 'Single native dual-mode row',
        chirp: 'Analogue profile only',
      },
    ],
  },
  zoneAndScan: {
    title: 'Zones and scanning',
    rows: [
      {
        aspect: 'Zone role',
        opengd77: 'Zone is the scan list',
        dm32: 'Zone and scan list are separate',
        chirp: 'Single scan sequence',
      },
      {
        aspect: 'Include in scan flag',
        opengd77: 'Ignored',
        dm32: 'Honoured when scan export enabled',
        chirp: 'Honoured for scan members',
      },
    ],
  },
  zoneDerivedExport: {
    title: 'Zone export flags (DM32)',
    rows: [
      {
        aspect: 'Scratch channel',
        opengd77: 'Not used',
        dm32: 'Zone flag + export master toggle',
        chirp: 'Not used',
      },
      {
        aspect: 'Scan list + carrier',
        opengd77: 'Not used',
        dm32: 'Zone flag + export master toggle → Scan.csv',
        chirp: 'Not used',
      },
    ],
  },
  exportNamePipeline: {
    title: 'Export name pipeline (order)',
    rows: [
      {
        aspect: '1',
        opengd77: 'Radio profile',
        dm32: 'Radio profile',
        chirp: 'Radio profile',
      },
      {
        aspect: '2',
        opengd77: 'Compose base name',
        dm32: 'Compose base name',
        chirp: 'Compose base name',
      },
      {
        aspect: '3',
        opengd77: 'Split multi-mode (-F/-D)',
        dm32: 'Keep dual-mode row',
        chirp: 'Skip digital',
      },
      {
        aspect: '4',
        opengd77: 'Keep RX list reference',
        dm32: 'Fan out RX list members',
        chirp: 'n/a',
      },
      {
        aspect: '5',
        opengd77: 'Shorten to fit limit',
        dm32: 'Shorten to fit limit',
        chirp: 'Shorten to fit limit',
      },
    ],
  },
};

export function getVarianceTable(id: VarianceId) {
  return varianceTables[id];
}
