import { renderHook, act, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LIST_NAME_FILTER_DEBOUNCE_MS } from './useDebouncedNameFilter.ts';
import { channelListPrefsKey, entityListPrefsKey } from '../lib/listPrefs/keys.ts';
import { saveChannelListPrefs, saveEntityListPrefs } from '../lib/listPrefs/storage.ts';
import { newProject } from '../models/codeplugProject.ts';
import { CODEPLUG_STORAGE_KEY, serializeProjects } from '../state/codeplugStorage.ts';
import { CodeplugProvider } from '../state/codeplugStore.tsx';
import { useChannelListQuery } from './useChannelListQuery.ts';
import { useListNameQuery } from './useListNameQuery.ts';

function makeWrapper(initialEntries: string[]) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <CodeplugProvider>{children}</CodeplugProvider>
      </MemoryRouter>
    );
  };
}

describe('useChannelListQuery', () => {
  let projectId: string;

  beforeEach(() => {
    const project = newProject('Test');
    projectId = project.id;
    localStorage.setItem(
      CODEPLUG_STORAGE_KEY,
      serializeProjects({ activeProjectId: project.id, projects: [project] }),
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('reads defaults from empty search params', () => {
    const { result } = renderHook(() => useChannelListQuery(), {
      wrapper: makeWrapper(['/channels']),
    });

    expect(result.current.nameFilter).toBe('');
    expect(result.current.sortMode).toBe('name');
    expect(result.current.bandFilter).toEqual([]);
    expect(result.current.distanceFilterEnabled).toBe(false);
    expect(result.current.maxDistanceKm).toBe(25);
  });

  it('round-trips filter params in the URL', () => {
    const { result } = renderHook(() => useChannelListQuery(), {
      wrapper: makeWrapper([
        '/channels?q=gb3le&sort=distance&band=2m,70cm&mode=DMR&duplex=simplex&distance=1&maxKm=50',
      ]),
    });

    expect(result.current.nameFilter).toBe('gb3le');
    expect(result.current.sortMode).toBe('distance');
    expect(result.current.bandFilter).toEqual(['2m', '70cm']);
    expect(result.current.modeFilter).toEqual(['DMR']);
    expect(result.current.duplexFilter).toBe('simplex');
    expect(result.current.distanceFilterEnabled).toBe(true);
    expect(result.current.maxDistanceKm).toBe(50);
  });

  it('writes search params when filters change', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useChannelListQuery(), {
      wrapper: makeWrapper(['/channels']),
    });

    act(() => {
      result.current.setNameFilter('repeater');
    });
    expect(result.current.nameFilterInput).toBe('repeater');
    expect(result.current.nameFilter).toBe('');

    act(() => {
      vi.advanceTimersByTime(LIST_NAME_FILTER_DEBOUNCE_MS);
    });
    expect(result.current.nameFilter).toBe('repeater');
    vi.useRealTimers();

    act(() => {
      result.current.setSortMode('distance');
    });
    await waitFor(() => expect(result.current.sortMode).toBe('distance'));

    act(() => {
      result.current.setBandFilter(['2m']);
    });
    await waitFor(() => expect(result.current.bandFilter).toEqual(['2m']));

    act(() => {
      result.current.setDistanceFilterEnabled(true);
    });
    await waitFor(() => expect(result.current.distanceFilterEnabled).toBe(true));

    act(() => {
      result.current.setMaxDistanceKm(100);
    });
    await waitFor(() => expect(result.current.maxDistanceKm).toBe(100));
  });

  it('hydrates from localStorage when URL has no params', async () => {
    saveChannelListPrefs(projectId, {
      q: 'stored',
      sortMode: 'distance',
      band: ['2m'],
    });

    const { result } = renderHook(() => useChannelListQuery(), {
      wrapper: makeWrapper(['/channels']),
    });

    await waitFor(() => expect(result.current.nameFilter).toBe('stored'));
    expect(result.current.sortMode).toBe('distance');
    expect(result.current.bandFilter).toEqual(['2m']);
  });

  it('URL params win over localStorage on load', () => {
    saveChannelListPrefs(projectId, { q: 'stored' });

    const { result } = renderHook(() => useChannelListQuery(), {
      wrapper: makeWrapper(['/channels?q=url-wins']),
    });

    expect(result.current.nameFilter).toBe('url-wins');
  });

  it('persists filter changes to localStorage', async () => {
    const { result } = renderHook(() => useChannelListQuery(), {
      wrapper: makeWrapper(['/channels']),
    });

    act(() => {
      result.current.setBandFilter(['70cm']);
    });
    await waitFor(() => expect(result.current.bandFilter).toEqual(['70cm']));

    const stored = JSON.parse(localStorage.getItem(channelListPrefsKey(projectId))!);
    expect(stored.band).toEqual(['70cm']);
  });

  it('does not restore stale localStorage q when clearing the name filter', () => {
    vi.useFakeTimers();
    saveChannelListPrefs(projectId, { q: 'stored' });

    const { result } = renderHook(() => useChannelListQuery(), {
      wrapper: makeWrapper(['/channels']),
    });

    act(() => {
      vi.runAllTimers();
    });
    expect(result.current.nameFilter).toBe('stored');

    act(() => {
      result.current.setNameFilter('');
    });
    expect(result.current.nameFilterInput).toBe('');
    expect(result.current.nameFilter).toBe('stored');

    act(() => {
      vi.advanceTimersByTime(LIST_NAME_FILTER_DEBOUNCE_MS);
    });
    expect(result.current.nameFilter).toBe('');

    const stored = JSON.parse(localStorage.getItem(channelListPrefsKey(projectId))!);
    expect(stored.q).toBe('');
    vi.useRealTimers();
  });
});

describe('useListNameQuery', () => {
  let projectId: string;

  beforeEach(() => {
    const project = newProject('Test');
    projectId = project.id;
    localStorage.setItem(
      CODEPLUG_STORAGE_KEY,
      serializeProjects({ activeProjectId: project.id, projects: [project] }),
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('hydrates name filter from localStorage', async () => {
    saveEntityListPrefs('zones', projectId, { q: 'north' });

    const { result } = renderHook(() => useListNameQuery('zones'), {
      wrapper: makeWrapper(['/zones']),
    });

    await waitFor(() => expect(result.current.nameFilter).toBe('north'));
  });

  it('URL q wins over stored prefs', () => {
    saveEntityListPrefs('contacts', projectId, { q: 'stored' });

    const { result } = renderHook(() => useListNameQuery('contacts'), {
      wrapper: makeWrapper(['/contacts?q=url']),
    });

    expect(result.current.nameFilter).toBe('url');
  });

  it('isolates prefs by entity', async () => {
    saveEntityListPrefs('zones', projectId, { q: 'zone-a' });
    saveEntityListPrefs('contacts', projectId, { q: 'contact-b' });

    const zones = renderHook(() => useListNameQuery('zones'), {
      wrapper: makeWrapper(['/zones']),
    });
    await waitFor(() => expect(zones.result.current.nameFilter).toBe('zone-a'));

    const contacts = renderHook(() => useListNameQuery('contacts'), {
      wrapper: makeWrapper(['/contacts']),
    });
    await waitFor(() => expect(contacts.result.current.nameFilter).toBe('contact-b'));
  });

  it('persists name filter to localStorage', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useListNameQuery('talk-groups'), {
      wrapper: makeWrapper(['/talk-groups']),
    });

    act(() => {
      result.current.setNameFilter('local');
    });
    act(() => {
      vi.advanceTimersByTime(LIST_NAME_FILTER_DEBOUNCE_MS);
    });
    expect(result.current.nameFilter).toBe('local');

    const stored = JSON.parse(localStorage.getItem(entityListPrefsKey('talk-groups', projectId))!);
    expect(stored.q).toBe('local');
    vi.useRealTimers();
  });

  it('does not restore stale localStorage q when clearing the name filter', () => {
    vi.useFakeTimers();
    saveEntityListPrefs('zones', projectId, { q: 'north' });

    const { result } = renderHook(() => useListNameQuery('zones'), {
      wrapper: makeWrapper(['/zones']),
    });

    act(() => {
      vi.runAllTimers();
    });
    expect(result.current.nameFilter).toBe('north');

    act(() => {
      result.current.setNameFilter('');
    });
    act(() => {
      vi.advanceTimersByTime(LIST_NAME_FILTER_DEBOUNCE_MS);
    });
    expect(result.current.nameFilter).toBe('');

    const stored = JSON.parse(localStorage.getItem(entityListPrefsKey('zones', projectId))!);
    expect(stored.q).toBe('');
    vi.useRealTimers();
  });
});
