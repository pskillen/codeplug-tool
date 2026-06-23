import { useCallback, useState } from 'react';
import {
  detectQueryKind,
  EtccDirectoryError,
  searchUkRepeaters,
} from '../lib/repeaterDirectories/registry.ts';
import type { EtccListing } from '../lib/repeaterDirectories/registry.ts';
import type { QueryKind } from '../lib/repeaterDirectories/ukrepeater/queryRouter.ts';
import { useMapSettings } from './useMapSettings.ts';

export interface UkRepeaterSearchState {
  query: string;
  operationalOnly: boolean;
  bandFilter: string | null;
  loading: boolean;
  error: string | null;
  kind: QueryKind | null;
  listings: EtccListing[];
}

export function useUkRepeaterSearch() {
  const { mapboxToken } = useMapSettings();
  const [query, setQuery] = useState('');
  const [operationalOnly, setOperationalOnly] = useState(true);
  const [bandFilter, setBandFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<QueryKind | null>(null);
  const [listings, setListings] = useState<EtccListing[]>([]);

  const search = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError('Enter a callsign, locator, band, or town.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await searchUkRepeaters(
        trimmed,
        {
          operationalOnly,
          band: bandFilter ?? undefined,
        },
        {
          mapboxToken: mapboxToken.trim() || undefined,
        },
      );
      setKind(result.kind);
      setListings(result.listings);
      if (result.listings.length === 0) {
        setError('No repeaters matched your search.');
      }
    } catch (err) {
      setListings([]);
      setKind(detectQueryKind(trimmed));
      if (err instanceof EtccDirectoryError) {
        setError(err.message);
      } else {
        setError('Search failed — try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [query, operationalOnly, bandFilter, mapboxToken]);

  return {
    query,
    setQuery,
    operationalOnly,
    setOperationalOnly,
    bandFilter,
    setBandFilter,
    loading,
    error,
    kind,
    listings,
    search,
  };
}
