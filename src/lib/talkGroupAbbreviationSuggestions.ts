import { shortenWireName } from './channelExpansion/shortenName.ts';

export interface TalkGroupAbbreviationSuggestion {
  maxLen: number;
  text: string;
}

const SUGGESTION_LENGTHS = [6, 8, 10, 12] as const;

/** Shorthand candidates for a talk-group name at common export length targets. */
export function talkGroupAbbreviationSuggestions(
  name: string,
): TalkGroupAbbreviationSuggestion[] {
  const trimmed = name.trim();
  if (!trimmed) return [];
  return SUGGESTION_LENGTHS.map((maxLen) => ({
    maxLen,
    text: shortenWireName(trimmed, maxLen),
  }));
}
