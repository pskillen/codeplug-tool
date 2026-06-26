import type { ChannelInput } from '../../codeplugMutations.ts';
import { channelFieldDefaults } from '../../../models/codeplug.ts';
import type { EntityMeta } from '../../../models/codeplug.ts';
import type { BrandMeisterDevice } from './types.ts';
import { deviceToSnapshot, mhzStringToHz } from './types.ts';
import { toTitleCase } from '../../titleCase.ts';

export interface MapDeviceOptions {
  titleCaseText?: boolean;
}

export interface MapDeviceResult {
  input: ChannelInput;
  meta: EntityMeta;
  warnings: string[];
}

export interface MapDeviceSkip {
  reason: string;
  warnings: string[];
}

function formatDeviceText(value: string | undefined, titleCaseText: boolean): string {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return '';
  return titleCaseText ? toTitleCase(trimmed) : trimmed;
}

function buildComment(device: BrandMeisterDevice, titleCaseText: boolean): string {
  const parts: string[] = [];
  const description = formatDeviceText(device.description, titleCaseText);
  const status = formatDeviceText(device.statusText, titleCaseText);
  if (description) parts.push(description);
  if (status) parts.push(status);
  return parts.join(' — ');
}

function qualifierName(device: BrandMeisterDevice, titleCaseText: boolean): string {
  const city = formatDeviceText(device.city, titleCaseText);
  if (city) return city;
  const priority = formatDeviceText(device.priorityDescription, titleCaseText);
  if (priority) {
    const withoutCallsign = priority.replace(new RegExp(`^${device.callsign}\\s*`, 'i'), '').trim();
    return withoutCallsign || priority;
  }
  return device.callsign;
}

export function mapDeviceToChannelInput(
  device: BrandMeisterDevice,
  fetchedAt = new Date().toISOString(),
  options: MapDeviceOptions = {},
): MapDeviceResult | MapDeviceSkip {
  const titleCaseText = options.titleCaseText ?? false;
  const warnings: string[] = [];

  const rxFrequency = mhzStringToHz(device.tx);
  const txFrequency = mhzStringToHz(device.rx);

  if (rxFrequency == null && txFrequency == null) {
    return {
      reason: 'No frequency data on device',
      warnings: ['Device has no tx/rx frequencies'],
    };
  }

  const colourCode =
    device.colorcode != null && device.colorcode >= 0 && device.colorcode <= 15
      ? device.colorcode
      : null;

  if (device.colorcode != null && colourCode == null) {
    warnings.push(`Colour code ${device.colorcode} out of range — not mapped`);
  }

  const lat = device.lat;
  const lng = device.lng;
  const location =
    lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)
      ? { lat, lon: lng }
      : null;

  const input: ChannelInput = {
    ...channelFieldDefaults(),
    callsign: device.callsign,
    name: qualifierName(device, titleCaseText),
    exportNameMode: 'callsign_name',
    mode: 'dmr',
    multiMode: false,
    modeProfiles: [],
    rxFrequency,
    txFrequency,
    colourCode,
    location,
    useLocation: location != null,
    comment: buildComment(device, titleCaseText),
  };

  const meta: EntityMeta = {
    repeaterDirectory: {
      sourceId: 'brandmeister',
      remoteListingId: device.id,
      fetchedAt,
      snapshot: deviceToSnapshot(device),
    },
  };

  return { input, meta, warnings };
}

export function isMapDeviceSkip(
  result: MapDeviceResult | MapDeviceSkip,
): result is MapDeviceSkip {
  return 'reason' in result;
}
