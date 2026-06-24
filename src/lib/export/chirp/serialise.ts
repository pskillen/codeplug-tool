import type { Codeplug } from '../../../models/codeplug.ts';
import { isAnalogMode } from '../../channelModes.ts';
import { formatCsv } from '../csvWrite.ts';
import { CHIRP_HEADERS } from '../../import/chirp/columns.ts';
import type { ExportOptions } from '../../import-export/types.ts';
import { effectiveMaxNameLength } from '../../channelExpansion/exportOptions.ts';
import { channelToChirpRow } from './channelWire.ts';
import { DEFAULT_CHIRP_PROFILE_ID, getChirpProfile } from './profiles.ts';

export interface ChirpSerialiseResult {
  csv: string;
  warnings: string[];
}

export function serialiseChirpCsv(
  codeplug: Codeplug,
  options?: ExportOptions,
): ChirpSerialiseResult {
  const profileId = options?.profileId ?? DEFAULT_CHIRP_PROFILE_ID;
  const profile = getChirpProfile(profileId);
  const warnings: string[] = [];

  const skipped = codeplug.channels.filter((ch) => !isAnalogMode(ch.mode));
  if (skipped.length > 0) {
    warnings.push(
      `Skipped ${skipped.length} non-analogue channel(s): ${skipped.map((ch) => ch.name).join(', ')}`,
    );
  }

  let analogueChannels = codeplug.channels.filter((ch) => isAnalogMode(ch.mode));
  if (analogueChannels.length > profile.maxMemorySlots) {
    const excess = analogueChannels.length - profile.maxMemorySlots;
    warnings.push(
      `Truncated ${excess} channel(s) to fit ${profile.maxMemorySlots} memory slots for ${profile.label}.`,
    );
    analogueChannels = analogueChannels.slice(0, profile.maxMemorySlots);
  }

  const reserved = new Set<string>();
  const wireOpts = {
    reserved,
    maxNameLength: effectiveMaxNameLength(options, profile.nameLimit),
    shortenNames: options?.shortenNames ?? true,
    nameModeOverride: options?.nameModeOverride,
    warnings,
  };

  const rows = analogueChannels.map((channel, index) =>
    channelToChirpRow(channel, index + 1, profileId, wireOpts),
  );

  return {
    csv: formatCsv([...CHIRP_HEADERS], rows),
    warnings,
  };
}
