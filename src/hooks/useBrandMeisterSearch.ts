import { useCallback, useState } from 'react';
import {
  BrandMeisterDirectoryError,
  detectBrandMeisterQueryKind,
  searchBrandMeisterDevices,
} from '../lib/repeaterDirectories/registry.ts';
import type { BrandMeisterDevice } from '../lib/repeaterDirectories/registry.ts';
import type { BrandMeisterQueryKind } from '../lib/repeaterDirectories/brandmeister/queryRouter.ts';

export interface BrandMeisterSearchState {
  query: string;
  loading: boolean;
  error: string | null;
  kind: BrandMeisterQueryKind | null;
  devices: BrandMeisterDevice[];
}

export function useBrandMeisterSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<BrandMeisterQueryKind | null>(null);
  const [devices, setDevices] = useState<BrandMeisterDevice[]>([]);

  const search = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError('Enter a callsign or BrandMeister device id.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await searchBrandMeisterDevices(trimmed);
      setKind(result.kind);
      setDevices(result.devices);
      if (result.devices.length === 0) {
        setError('No devices matched your search.');
      }
    } catch (err) {
      setDevices([]);
      setKind(detectBrandMeisterQueryKind(trimmed));
      if (err instanceof BrandMeisterDirectoryError) {
        setError(err.message);
      } else {
        setError('Search failed — try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [query]);

  return {
    query,
    setQuery,
    loading,
    error,
    kind,
    devices,
    search,
  };
}
