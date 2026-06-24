/** Transmit admit policy — vendor-neutral enum; wire labels at import/export boundary. */
export type ChannelTxAdmit = 'channel_idle' | 'allow_tx';

export const DEFAULT_TX_ADMIT: ChannelTxAdmit = 'channel_idle';

const DM32_WIRE_TO_TX_ADMIT: Record<string, ChannelTxAdmit> = {
  'channel idle': 'channel_idle',
  'allow tx': 'allow_tx',
};

/** Coerce stored or legacy wire strings to the internal enum. */
export function normalizeTxAdmit(value: unknown): ChannelTxAdmit {
  if (value === 'channel_idle' || value === 'allow_tx') {
    return value;
  }
  if (typeof value === 'string') {
    const mapped = DM32_WIRE_TO_TX_ADMIT[value.trim().toLowerCase()];
    if (mapped) return mapped;
  }
  return DEFAULT_TX_ADMIT;
}
