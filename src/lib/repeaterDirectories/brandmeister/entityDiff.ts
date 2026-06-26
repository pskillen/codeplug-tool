import type { TalkGroup } from '../../../models/codeplug.ts';
import type { BrandMeisterTalkgroupMeta } from './types.ts';

export interface EntityDiffRow {
  field: string;
  label: string;
  local: string;
  remote: string;
  changed: boolean;
}

export function diffTalkGroupFromBrandMeister(
  talkGroup: TalkGroup,
  meta: BrandMeisterTalkgroupMeta,
): EntityDiffRow[] {
  const remoteName = meta.Name?.trim() ?? '';
  const rows: EntityDiffRow[] = [];

  rows.push({
    field: 'number',
    label: 'DMR ID',
    local: talkGroup.number,
    remote: String(meta.ID),
    changed: talkGroup.number.trim() !== String(meta.ID),
  });

  rows.push({
    field: 'name',
    label: 'Name',
    local: talkGroup.name,
    remote: remoteName || '—',
    changed: remoteName !== '' && talkGroup.name !== remoteName,
  });

  return rows;
}

export function entityDiffHasChanges(rows: EntityDiffRow[]): boolean {
  return rows.some((r) => r.changed);
}
