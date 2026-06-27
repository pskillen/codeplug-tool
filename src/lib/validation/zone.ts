import type { Codeplug, ZoneMemberEntry } from '../../models/codeplug.ts';
import type { ValidationIssue } from './channel.ts';

export function validateZone(
  input: {
    name: string;
    members?: ZoneMemberEntry[];
  },
  codeplug: Codeplug,
  zoneId?: string,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!input.name.trim()) {
    issues.push({ field: 'name', message: 'Zone name is required', severity: 'error' });
  } else {
    const duplicate = codeplug.zones.find((z) => z.name === input.name && z.id !== zoneId);
    if (duplicate) {
      issues.push({
        field: 'name',
        message: 'Another zone already uses this name',
        severity: 'error',
      });
    }
  }

  const members = input.members;
  if (members) {
    const channelIds = new Set(codeplug.channels.map((ch) => ch.id));
    for (const m of members) {
      if (!channelIds.has(m.channelId)) {
        issues.push({
          field: 'members',
          message: 'One or more selected channels no longer exist',
          severity: 'error',
        });
        break;
      }
    }
  }

  return issues;
}
