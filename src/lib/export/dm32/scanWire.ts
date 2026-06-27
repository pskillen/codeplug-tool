import { formatCsv } from '../csvWrite.ts';
import type { DerivedZoneScanList } from '../../zoneDerivedScanLists/index.ts';
import { SCAN_COL, SCAN_HEADERS } from '../../import/dm32/columns.ts';

/** DM32 Scan.csv wire values for zone-derived lists. */
export function serialiseDerivedScanLists(lists: DerivedZoneScanList[]): string {
  const rows = lists.map((list, i) => {
    const values: Record<string, string> = {
      [SCAN_COL.number]: String(i + 1),
      [SCAN_COL.name]: list.scanListName,
      [SCAN_COL.ctcScanMode]: 'Detection CTC',
      [SCAN_COL.scanTxMode]: 'Last Actived Channel',
      [SCAN_COL.hangTime]: '3.0',
      [SCAN_COL.priorityChannel1]: 'None',
      [SCAN_COL.priorityChannel2]: 'None',
      [SCAN_COL.designedChannel]: list.carrierWireName,
      [SCAN_COL.prioritySweepTime]: '500',
      [SCAN_COL.talkback]: '0',
      [SCAN_COL.members]: list.memberWireNames.join('|'),
    };
    return SCAN_HEADERS.map((h) => values[h] ?? '');
  });
  return formatCsv(SCAN_HEADERS, rows);
}
