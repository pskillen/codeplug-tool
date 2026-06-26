import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  BrandMeisterDirectoryError,
  fetchDevicesByCallsign,
  fetchDeviceById,
  fetchStaticTalkgroups,
  fetchTalkgroupMeta,
} from './client.ts';

const SAMPLE_DEVICE = {
  id: 235226,
  callsign: 'GB7HH',
  tx: '439.7500',
  rx: '430.7500',
  colorcode: 3,
  city: 'Romford',
  statusText: 'Both Slots Linked',
};

afterEach(() => {
  vi.restoreAllMocks();
  sessionStorage.clear();
});

describe('BrandMeister client', () => {
  it('fetchDevicesByCallsign parses device array', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify([SAMPLE_DEVICE]),
      }),
    );

    const devices = await fetchDevicesByCallsign('GB7HH');
    expect(devices).toHaveLength(1);
    expect(devices[0].callsign).toBe('GB7HH');
    expect(devices[0].colorcode).toBe(3);
  });

  it('fetchDeviceById returns single device', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(SAMPLE_DEVICE),
      }),
    );

    const device = await fetchDeviceById(235226);
    expect(device?.id).toBe(235226);
  });

  it('fetchDeviceById returns null on 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: async () => '{"error":"not found"}',
      }),
    );

    await expect(fetchDeviceById(999999)).resolves.toBeNull();
  });

  it('throws BrandMeisterDirectoryError on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(fetchDevicesByCallsign('GB7HH')).rejects.toBeInstanceOf(
      BrandMeisterDirectoryError,
    );
  });

  it('fetchStaticTalkgroups parses array', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () =>
          JSON.stringify([{ talkgroup: '9', slot: '1', repeaterid: '235226' }]),
      }),
    );

    const tgs = await fetchStaticTalkgroups(235226);
    expect(tgs).toHaveLength(1);
    expect(tgs[0].talkgroup).toBe('9');
    expect(tgs[0].slot).toBe('1');
  });

  it('fetchTalkgroupMeta returns name', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify({ ID: 9, Name: 'Local' }),
      }),
    );

    const meta = await fetchTalkgroupMeta('9');
    expect(meta?.Name).toBe('Local');
  });
});
