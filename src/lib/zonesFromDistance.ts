import type { Channel } from '../models/codeplug.ts';
import { channelHasGeolocation } from './channels.ts';
import { coordsToLocator } from './maidenhead.ts';
import { haversineDistanceM } from './geoDistance.ts';

export interface SearchCentre {
  lat: number;
  lon: number;
  label: string;
}

export interface ChannelInRange {
  channel: Channel;
  distanceM: number;
}

export function channelsInRange(
  channels: Channel[],
  centre: SearchCentre,
  maxDistanceKm: number,
): ChannelInRange[] {
  const maxM = maxDistanceKm * 1000;
  const result: ChannelInRange[] = [];

  for (const channel of channels) {
    if (!channelHasGeolocation(channel)) continue;
    const distanceM = haversineDistanceM(
      centre.lat,
      centre.lon,
      channel.location!.lat,
      channel.location!.lon,
    );
    if (distanceM <= maxM) {
      result.push({ channel, distanceM });
    }
  }

  result.sort((a, b) => a.distanceM - b.distanceM);
  return result;
}

export function countUnlocatedChannels(channels: Channel[]): number {
  return channels.filter((ch) => !channelHasGeolocation(ch)).length;
}

export function defaultZoneFromDistanceName(maxDistanceKm: number, centre: SearchCentre): string {
  const label = centre.label.trim();
  if (label) return `Within ${maxDistanceKm} km of ${label}`;
  const locator = coordsToLocator(centre.lat, centre.lon, 4);
  return `Within ${maxDistanceKm} km of ${locator}`;
}
