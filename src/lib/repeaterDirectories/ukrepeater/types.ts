export const ETCC_API_BASE = 'https://api-beta.rsgb.online';

export interface EtccExtraDetails {
  ngr?: string;
  antennaHeight?: number;
  polarisation?: string;
}

export interface EtccListing {
  id: number;
  fac?: boolean;
  type?: string;
  status: string;
  keeperCallsign?: string;
  town?: string;
  modeCodes: string[];
  tx: number;
  rx: number;
  repeater: string;
  ctcss: number;
  txbw?: number;
  band: string;
  locator?: string;
  dbwErp?: number;
  extraDetails?: EtccExtraDetails;
}

export interface EtccResponse {
  data: EtccListing[];
}

export function listingToSnapshot(listing: EtccListing): Record<string, unknown> {
  return {
    id: listing.id,
    type: listing.type,
    status: listing.status,
    keeperCallsign: listing.keeperCallsign,
    town: listing.town,
    band: listing.band,
    modeCodes: listing.modeCodes,
    dbwErp: listing.dbwErp,
    extraDetails: listing.extraDetails,
  };
}

export function toDirectoryListing(listing: EtccListing) {
  return {
    sourceId: 'ukrepeater' as const,
    remoteListingId: listing.id,
    callsign: listing.repeater,
    band: listing.band,
    town: listing.town ?? '',
    status: listing.status,
    raw: listing,
  };
}
