import { describe, expect, it } from 'vitest';
import {
  CHANNEL_LIST_COLUMNS_SCHEMA_VERSION,
  loadChannelVisibleColumns,
} from './channelListQueryUtils.ts';
import { channelListColumnsKey, channelListColumnsSchemaKey } from '../lib/listPrefs/keys.ts';

// loadFromStorage is exercised via loadChannelVisibleColumns custom path in channels;
// generic hook behaviour is covered by the channels empty-array test and DataTable tests.

describe('useDataTableColumnVisibility storage', () => {
  it('loadChannelVisibleColumns returns empty array when stored as []', () => {
    const projectId = 'proj-cols-test';
    const key = channelListColumnsKey(projectId);
    const schemaKey = channelListColumnsSchemaKey(projectId);
    const previous = localStorage.getItem(key);
    const previousSchema = localStorage.getItem(schemaKey);
    localStorage.setItem(key, JSON.stringify([]));
    localStorage.setItem(schemaKey, String(CHANNEL_LIST_COLUMNS_SCHEMA_VERSION));

    try {
      expect(loadChannelVisibleColumns(projectId)).toEqual([]);
    } finally {
      if (previous == null) localStorage.removeItem(key);
      else localStorage.setItem(key, previous);
      if (previousSchema == null) localStorage.removeItem(schemaKey);
      else localStorage.setItem(schemaKey, previousSchema);
    }
  });
});
