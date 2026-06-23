/** Remote repeater directory sources (ukrepeater.net, future RepeaterBook, etc.). */

import type { EtccListing } from './ukrepeater/types.ts';

export type RepeaterDirectorySourceId = 'ukrepeater';

export interface RepeaterDirectoryListing {
  sourceId: RepeaterDirectorySourceId;
  remoteListingId: number;
  callsign: string;
  band: string;
  town: string;
  status: string;
  raw: EtccListing;
}

export interface RepeaterDirectorySource {
  readonly id: RepeaterDirectorySourceId;
  readonly label: string;
  search(query: string): Promise<RepeaterDirectoryListing[]>;
  fetchByCallsign(callsign: string): Promise<RepeaterDirectoryListing[]>;
  fetchByListingId(listingId: number): Promise<RepeaterDirectoryListing | null>;
}
