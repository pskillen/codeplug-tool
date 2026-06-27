import type { GeocodeProvider } from './geocode.ts';

export interface GeocodeProviderChoice {
  provider: GeocodeProvider;
  reason: string;
}

export function resolveGeocodeProviderChoice(opts?: {
  mapboxToken?: string;
  provider?: GeocodeProvider;
}): GeocodeProviderChoice {
  if (opts?.provider) {
    const name = opts.provider === 'mapbox' ? 'Mapbox' : 'Photon (OpenStreetMap)';
    return { provider: opts.provider, reason: `${name} selected explicitly` };
  }
  if (opts?.mapboxToken?.trim()) {
    return { provider: 'mapbox', reason: 'Mapbox — token set in Settings' };
  }
  return {
    provider: 'photon',
    reason: 'Photon (OpenStreetMap) — no Mapbox token in Settings',
  };
}

export function geocodeProviderLabel(provider: GeocodeProvider): string {
  return provider === 'mapbox' ? 'Mapbox' : 'Photon (OpenStreetMap)';
}
