import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { fetchByCallsign, EtccDirectoryError } from './client.ts';

const GB7DC_RESPONSE = JSON.stringify({
  data: [
    {
      id: 4763,
      repeater: 'GB7DC',
      status: 'OPERATIONAL',
      modeCodes: ['A', 'M:1'],
      tx: 439350000,
      rx: 430350000,
      ctcss: 71.9,
      band: '70CM',
      locator: 'IO92',
    },
  ],
});

describe('fetchByCallsign', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches and parses listings', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(GB7DC_RESPONSE, { status: 200 }));
    const listings = await fetchByCallsign('GB7DC');
    expect(listings).toHaveLength(1);
    expect(listings[0].repeater).toBe('GB7DC');
  });

  it('uses session cache on second call', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(GB7DC_RESPONSE, { status: 200 }));
    await fetchByCallsign('GB7DC');
    await fetchByCallsign('GB7DC');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('throws EtccDirectoryError on HTTP failure', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('error', { status: 503 }));
    await expect(fetchByCallsign('GB7DC')).rejects.toBeInstanceOf(EtccDirectoryError);
  });
});
