import type { Channel } from '../../../models/codeplug.ts';
import {
  deriveChirpDuplexAndOffset,
  formatChirpFrequencyWire,
  formatChirpModeWire,
  formatChirpPowerWireForProfile,
  formatChirpScanSkip,
  formatChirpToneColumns,
  formatChirpTStepWire,
  parseChirpOffsetMhz,
} from '../../import/chirp/channelWire.ts';

const DEFAULT_DTCS_CODE = '023';
const DEFAULT_DTCS_POLARITY = 'NN';
const DEFAULT_CROSS_MODE = 'Tone->Tone';

function chirpDuplexAndOffset(channel: Channel): { duplex: string; offsetMhz: number } {
  const derived = deriveChirpDuplexAndOffset(
    channel.rxFrequency,
    channel.txFrequency,
    channel.rxOnly,
  );
  const imported = channel.meta?.imported;
  if (
    imported?.formatId === 'chirp' &&
    imported.chirpDuplexWire !== undefined &&
    channel.rxFrequency === channel.txFrequency &&
    derived.duplex === '' &&
    imported.chirpDuplexWire.trim() !== ''
  ) {
    return {
      duplex: imported.chirpDuplexWire,
      offsetMhz: parseChirpOffsetMhz(imported.chirpOffsetWire ?? '0'),
    };
  }
  return derived;
}

/** Map one internal channel to a CHIRP CSV row (header order). */
export function channelToChirpRow(channel: Channel, location: number, profileId: string): string[] {
  const { duplex, offsetMhz } = chirpDuplexAndOffset(channel);
  const tones = formatChirpToneColumns(channel.rxTone, channel.txTone);

  return [
    String(location),
    channel.name,
    formatChirpFrequencyWire(channel.rxFrequency),
    duplex,
    offsetMhz.toFixed(6),
    tones.tone,
    tones.rToneFreq,
    tones.cToneFreq,
    DEFAULT_DTCS_CODE,
    DEFAULT_DTCS_POLARITY,
    DEFAULT_DTCS_CODE,
    DEFAULT_CROSS_MODE,
    formatChirpModeWire(channel.mode, channel.bandwidthKHz),
    formatChirpTStepWire(),
    formatChirpScanSkip(channel.scanSkip),
    formatChirpPowerWireForProfile(channel.power, profileId),
    channel.comment,
    '',
    '',
    '',
    '',
  ];
}
