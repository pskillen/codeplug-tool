import { describe, expect, it } from 'vitest';
import { buildChannel, buildCodeplug, buildZone } from '../../test/builders/codeplug.ts';
import { buildZoneScanExportPlan } from './index.ts';

describe('buildZoneScanExportPlan', () => {
  it('derives scan list and carrier for flagged zone', () => {
    const ch = buildChannel({
      id: 'c1',
      name: 'Glasgow',
      callsign: 'GB7GL',
      mode: 'dmr',
      rxFrequency: 430_987_500,
      txFrequency: 438_987_500,
    });
    const zone = buildZone({
      id: 'z1',
      name: 'Local',
      members: [{ channelId: 'c1' }],
      exportScanList: true,
    });
    const codeplug = buildCodeplug({ channels: [ch], zones: [zone] });
    const plan = buildZoneScanExportPlan(
      codeplug,
      { expandTalkGroups: true, codeplug },
      { exportZoneDerivedScanLists: true },
    );
    expect(plan.scanLists).toHaveLength(1);
    expect(plan.scanLists[0]?.scanListName).toBe('Local');
    expect(plan.scanLists[0]?.carrierWireName).toBe('Local Scan');
    expect(plan.carrierRows).toHaveLength(1);
    expect(plan.carrierRows[0]?.rxFrequency).toBe(145_500_000);
  });

  it('excludes scanSkip channels from member list', () => {
    const ch = buildChannel({
      id: 'c1',
      name: 'A',
      mode: 'fm',
      scanSkip: true,
    });
    const ch2 = buildChannel({ id: 'c2', name: 'B', mode: 'fm' });
    const zone = buildZone({
      id: 'z1',
      name: 'Local',
      members: [{ channelId: 'c1' }, { channelId: 'c2' }],
      exportScanList: true,
    });
    const codeplug = buildCodeplug({ channels: [ch, ch2], zones: [zone] });
    const plan = buildZoneScanExportPlan(
      codeplug,
      { expandTalkGroups: true, codeplug },
      { exportZoneDerivedScanLists: true },
    );
    expect(plan.scanLists[0]?.memberWireNames).toEqual(['B']);
  });

  it('skips when master toggle off', () => {
    const ch = buildChannel({ id: 'c1', name: 'A', mode: 'fm' });
    const zone = buildZone({
      id: 'z1',
      name: 'Local',
      members: [{ channelId: 'c1' }],
      exportScanList: true,
    });
    const codeplug = buildCodeplug({ channels: [ch], zones: [zone] });
    const plan = buildZoneScanExportPlan(
      codeplug,
      { expandTalkGroups: true, codeplug },
      { exportZoneDerivedScanLists: false },
    );
    expect(plan.scanLists).toHaveLength(0);
  });
});
