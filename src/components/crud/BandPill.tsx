import { Badge } from '@mantine/core';
import { bandFromChannel, type BandDefinition } from '../../lib/bands.ts';
import type { Channel } from '../../models/codeplug.ts';

export interface BandPillProps {
  band: BandDefinition | null;
  size?: 'xs' | 'sm' | 'md';
}

export default function BandPill({ band, size = 'sm' }: BandPillProps) {
  if (!band) return null;
  return (
    <Badge size={size} style={{ backgroundColor: band.color, color: '#fff' }}>
      {band.label}
    </Badge>
  );
}

export function BandPillForChannel({
  channel,
  size,
}: {
  channel: Channel;
  size?: BandPillProps['size'];
}) {
  return <BandPill band={bandFromChannel(channel.rxFrequency, channel.txFrequency)} size={size} />;
}
