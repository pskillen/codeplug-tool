import type { Channel } from '../../../models/codeplug.ts';
import { CHIRP_HEADERS } from '../../import/chirp/columns.ts';
import {
  deriveChirpDuplexAndOffset,
  formatChirpFrequencyWire,
  formatChirpModeWire,
  formatChirpPowerWireForProfile,
  formatChirpScanSkip,
  formatChirpToneFreq,
  formatChirpToneMode,
  formatChirpTStepWire,
} from '../../import/chirp/channelWire.ts';

const DEFAULT_DTCS_CODE = '023';
const DEFAULT_DTCS_POLARITY = 'NN';
const DEFAULT_CROSS_MODE = 'Tone->Tone';

function formatOffsetMhz(offsetMhz: number): string {
  return offsetMhz.toFixed(6);
}

function buildComputedChirpRow(channel: Channel, location: number, profileId: string): string[] {
  const { duplex, offsetMhz } = deriveChirpDuplexAndOffset(
    channel.rxFrequency,
    channel.txFrequency,
  );

  return [
    String(location),
    channel.name,
    formatChirpFrequencyWire(channel.rxFrequency),
    duplex,
    formatOffsetMhz(offsetMhz),
    formatChirpToneMode(channel.rxTone, channel.txTone),
    formatChirpToneFreq(channel.rxTone),
    formatChirpToneFreq(channel.txTone),
    DEFAULT_DTCS_CODE,
    DEFAULT_DTCS_POLARITY,
    DEFAULT_DTCS_CODE,
    DEFAULT_CROSS_MODE,
    formatChirpModeWire(channel.mode),
    formatChirpTStepWire(channel.bandwidthKHz),
    formatChirpScanSkip(channel.scanSkip),
    formatChirpPowerWireForProfile(channel.power, profileId),
    '',
    '',
    '',
    '',
    '',
  ];
}

/** Map one internal channel to a CHIRP CSV row (header order). */
export function channelToChirpRow(channel: Channel, location: number, profileId: string): string[] {
  const computed = buildComputedChirpRow(channel, location, profileId);
  const wire =
    channel.meta?.imported?.formatId === 'chirp' ? channel.meta.imported.wireColumns : undefined;
  if (!wire) return computed;

  return CHIRP_HEADERS.map((header, index) => {
    if (header === 'Location') return String(location);
    if (header === 'Name') return channel.name;
    const wireValue = wire[header];
    if (wireValue !== undefined) return wireValue;
    return computed[index] ?? '';
  });
}
