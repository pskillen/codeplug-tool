import { describe, expect, it } from 'vitest';
import { buildChannel, buildZone } from '../test/builders/codeplug.ts';
import {
  formatZoneScanListColumn,
  formatZoneScratchColumn,
  zoneScanEligibleMemberCount,
} from './zones.ts';

describe('zone list column helpers', () => {
  const ch1 = buildChannel({ id: 'c1', name: 'A' });
  const ch2 = buildChannel({ id: 'c2', name: 'B', scanSkip: true });
  const channels = [ch1, ch2];

  it('formatZoneScanListColumn shows enabled count', () => {
    const zone = buildZone({
      id: 'z1',
      name: 'Local',
      members: [{ channelId: 'c1' }, { channelId: 'c2', includeInScanList: false }],
      exportScanList: true,
    });
    expect(zoneScanEligibleMemberCount(zone, channels)).toBe(1);
    expect(formatZoneScanListColumn(zone, channels)).toBe('Enabled / 1');
  });

  it('formatZoneScanListColumn is em dash when disabled', () => {
    const zone = buildZone({ id: 'z1', name: 'Local', members: [{ channelId: 'c1' }] });
    expect(formatZoneScanListColumn(zone, channels)).toBe('—');
  });

  it('formatZoneScratchColumn reflects export flag', () => {
    expect(
      formatZoneScratchColumn(buildZone({ id: 'z1', name: 'Z', exportScratchChannel: true })),
    ).toBe('Enabled');
    expect(formatZoneScratchColumn(buildZone({ id: 'z1', name: 'Z' }))).toBe('—');
  });
});
