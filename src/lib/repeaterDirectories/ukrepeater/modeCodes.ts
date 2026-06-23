import type { ChannelMode } from '../../channelModes.ts';

export interface ParsedModeCodes {
  hasAnalog: boolean;
  hasDmr: boolean;
  colourCode: number | null;
  /** Phase 1 mappable — FM and/or DMR present. */
  phase1Supported: boolean;
  unsupportedFlags: string[];
}

const PHASE1_FLAGS = new Set(['A', 'M']);

export function parseModeCodes(modeCodes: string[]): ParsedModeCodes {
  let hasAnalog = false;
  let hasDmr = false;
  let colourCode: number | null = null;
  const unsupportedFlags: string[] = [];

  for (const raw of modeCodes) {
    const code = raw.trim().toUpperCase();
    if (code === 'A') {
      hasAnalog = true;
      continue;
    }
    if (code === 'M') {
      hasDmr = true;
      continue;
    }
    if (code.startsWith('M:')) {
      hasDmr = true;
      const n = parseInt(code.slice(2), 10);
      if (Number.isFinite(n) && n >= 0 && n <= 15) {
        colourCode = n;
      }
      continue;
    }
    if (!PHASE1_FLAGS.has(code.charAt(0))) {
      unsupportedFlags.push(raw);
    }
  }

  return {
    hasAnalog,
    hasDmr,
    colourCode,
    phase1Supported: hasAnalog || hasDmr,
    unsupportedFlags,
  };
}

export function primaryModeFromCodes(parsed: ParsedModeCodes): ChannelMode {
  if (parsed.hasAnalog) return 'fm';
  if (parsed.hasDmr) return 'dmr';
  return 'other';
}

export function formatModeCodesSummary(modeCodes: string[]): string {
  return modeCodes.join(', ') || '—';
}

export function isOperationalStatus(status: string): boolean {
  return status.trim().toUpperCase() === 'OPERATIONAL';
}
