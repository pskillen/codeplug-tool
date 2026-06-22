import {
  formatFrequencyMhzWireFromHz,
  NONE_TONE,
  type ChannelTone,
} from '../../channelFields/index.ts';
import { isAnalogMode, isDigitalMode, type ChannelMode } from '../../channelModes.ts';
import { opengd77PercentToWire, DEFAULT_OPENGD77_PROFILE_ID } from '../../opengd77/profiles.ts';

export function formatOpenGd77PowerWire(
  percent: number | null,
  profileId: string = DEFAULT_OPENGD77_PROFILE_ID,
): string {
  return opengd77PercentToWire(profileId, percent);
}

/** OpenGD77 squelch — blank on digital; `Disabled` or `N%` on analogue. */
export function formatOpenGd77SquelchWire(mode: ChannelMode, percent: number | null): string {
  if (isDigitalMode(mode)) return '';
  if (percent == null || percent === 0) return 'Disabled';
  return `${percent}%`;
}

export function formatOpenGd77BandwidthWire(khz: number | null): string {
  if (khz == null) return '';
  return String(khz);
}

export function formatOpenGd77ColourCodeWire(code: number | null): string {
  if (code == null) return '';
  return String(code);
}

export function formatOpenGd77TimeslotWire(slot: 1 | 2 | null): string {
  if (slot == null) return '';
  return String(slot);
}

/** OpenGD77 DMR ID — empty on analogue; `None` or numeric string on digital. */
export function formatOpenGd77DmrIdWire(mode: ChannelMode, id: number | null): string {
  if (isAnalogMode(mode)) return '';
  if (id == null) return 'None';
  return String(id);
}

export function formatOpenGd77TransmitTimeoutWire(seconds: number | null): string {
  if (seconds == null) return '';
  return String(seconds);
}

/** OpenGD77 tone — blank on digital; `None` or CTCSS/DCS on analogue. */
export function formatOpenGd77ToneWire(mode: ChannelMode, tone: ChannelTone | null): string {
  if (isDigitalMode(mode)) return '';
  if (tone == null || tone === NONE_TONE) return 'None';
  return tone;
}

export function formatOpenGd77FrequencyWire(hz: number | null): string {
  return formatFrequencyMhzWireFromHz(hz);
}
