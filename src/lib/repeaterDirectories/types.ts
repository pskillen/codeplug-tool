/** Remote repeater directory sources (ukrepeater.net, BrandMeister, etc.). */

export type RepeaterDirectorySourceId = 'ukrepeater' | 'brandmeister';

export interface RepeaterDirectoryListing {
  sourceId: RepeaterDirectorySourceId;
  remoteListingId: number;
  callsign: string;
  band: string;
  town: string;
  status: string;
  raw: unknown;
}

export interface RepeaterDirectorySource {
  readonly id: RepeaterDirectorySourceId;
  readonly label: string;
  search(query: string): Promise<RepeaterDirectoryListing[]>;
  fetchByCallsign(callsign: string): Promise<RepeaterDirectoryListing[]>;
  fetchByListingId(listingId: number): Promise<RepeaterDirectoryListing | null>;
}
