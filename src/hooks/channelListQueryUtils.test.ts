import { describe, expect, it } from 'vitest';
import {
  CHANNEL_LIST_COLUMN_STORAGE_KEY,
  CHANNEL_OPTIONAL_COLUMNS,
  defaultChannelVisibleColumns,
  loadChannelVisibleColumns,
} from './channelListQueryUtils.ts';

describe('defaultChannelVisibleColumns', () => {
  it('includes power by default and omits squelch', () => {
    const cols = defaultChannelVisibleColumns();
    expect(cols).toContain('power');
    expect(cols).not.toContain('squelch');
    expect(cols).toEqual(
      CHANNEL_OPTIONAL_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.key),
    );
  });
});

describe('loadChannelVisibleColumns', () => {
  it('migrates stored prefs to include power but not squelch', () => {
    const key = CHANNEL_LIST_COLUMN_STORAGE_KEY;
    const previous = localStorage.getItem(key);
    localStorage.setItem(key, JSON.stringify(['contact', 'rgl', 'loc', 'distance']));

    try {
      const cols = loadChannelVisibleColumns();
      expect(cols).toContain('power');
      expect(cols).not.toContain('squelch');
    } finally {
      if (previous == null) localStorage.removeItem(key);
      else localStorage.setItem(key, previous);
    }
  });
});
