import type { Codeplug, Zone } from '../../models/codeplug.ts';
import type { ExportOptions } from '../import-export/types.ts';
import {
  expandChannelRowsForExport,
  type ExpandChannelOptions,
  type ExpandedChannelRow,
} from '../channelExpansion/index.ts';
import { memberIncludesInScanList } from '../zones.ts';

export const DEFAULT_SCAN_CARRIER_FREQUENCY_HZ = 145_500_000;

export interface DerivedZoneScanList {
  zoneId: string;
  scanListName: string;
  memberWireNames: string[];
  carrierWireName: string;
}

export interface ZoneScanExportPlan {
  scanLists: DerivedZoneScanList[];
  carrierRows: ExpandedChannelRow[];
  carrierWireNameByZoneId: Map<string, string>;
  warnings: string[];
}

function scanExportEnabled(zone: Zone, options?: ExportOptions): boolean {
  return zone.exportScanList === true && options?.exportZoneDerivedScanLists !== false;
}

function uniqueWireName(base: string, reserved: Set<string>): string {
  if (!reserved.has(base)) return base;
  let n = 2;
  while (reserved.has(`${base} ${n}`)) n++;
  return `${base} ${n}`;
}

function buildCarrierRow(zone: Zone, wireName: string): ExpandedChannelRow {
  const hz = zone.scanCarrierFrequencyHz ?? DEFAULT_SCAN_CARRIER_FREQUENCY_HZ;
  return {
    sourceChannelId: `scan-carrier:${zone.id}`,
    wireName,
    mode: 'fm',
    bandwidthKHz: 12.5,
    colourCode: null,
    timeslot: null,
    dmrId: null,
    rxTone: 'none',
    txTone: 'none',
    squelch: null,
    contactRef: null,
    rxGroupListId: null,
    rxFrequency: hz,
    txFrequency: hz,
    location: null,
    useLocation: false,
    power: null,
    forbidTransmit: false,
    aprsConfigName: '',
    voxEnabled: false,
    transmitTimeout: null,
    scanSkip: false,
    opengd77Extras: {},
  };
}

/** Plan zone-derived scan lists and synthetic carrier channels for DM32 export. */
export function buildZoneScanExportPlan(
  codeplug: Codeplug,
  expandOptions: ExpandChannelOptions,
  exportOptions?: ExportOptions,
  profileScanListMembers = 16,
): ZoneScanExportPlan {
  const warnings: string[] = [];
  const scanLists: DerivedZoneScanList[] = [];
  const carrierRows: ExpandedChannelRow[] = [];
  const carrierWireNameByZoneId = new Map<string, string>();
  const reserved = new Set<string>();
  const channelById = new Map(codeplug.channels.map((ch) => [ch.id, ch]));
  const withLookup = {
    ...expandOptions,
    channelById,
    warnings,
  };

  for (const zone of codeplug.zones) {
    if (!scanExportEnabled(zone, exportOptions)) continue;

    const memberWireNames: string[] = [];
    for (const member of zone.members) {
      if (!memberIncludesInScanList(member)) continue;
      const ch = channelById.get(member.channelId);
      if (!ch || ch.scanSkip) continue;
      const expanded = expandChannelRowsForExport(ch, withLookup, reserved);
      for (const row of expanded) {
        memberWireNames.push(row.wireName);
        reserved.add(row.wireName);
      }
    }

    if (memberWireNames.length === 0) {
      warnings.push(`Zone "${zone.name}" has no scan-eligible members — scan list skipped`);
      continue;
    }

    let truncated = memberWireNames;
    if (truncated.length > profileScanListMembers) {
      warnings.push(
        `Zone "${zone.name}" scan list truncated from ${truncated.length} to ${profileScanListMembers} members`,
      );
      truncated = truncated.slice(0, profileScanListMembers);
    }

    const carrierBase = `${zone.name} Scan`;
    const carrierWireName = uniqueWireName(carrierBase, reserved);
    reserved.add(carrierWireName);
    carrierWireNameByZoneId.set(zone.id, carrierWireName);

    scanLists.push({
      zoneId: zone.id,
      scanListName: zone.name,
      memberWireNames: truncated,
      carrierWireName,
    });
    carrierRows.push(buildCarrierRow(zone, carrierWireName));
  }

  return { scanLists, carrierRows, carrierWireNameByZoneId, warnings };
}

export function scanListNameForCarrierWireName(
  plan: ZoneScanExportPlan,
  wireName: string,
): string | null {
  for (const list of plan.scanLists) {
    if (list.carrierWireName === wireName) return list.scanListName;
  }
  return null;
}
