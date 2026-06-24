import { ABBREVIATIONS, STOPWORDS } from './dictionary.generated.ts';

export { ABBREVIATIONS, STOPWORDS } from './dictionary.generated.ts';

const STOPWORD_LOOKUP = new Set(STOPWORDS.map((word) => word.toLowerCase()));

/** Case-insensitive stopword check (for export-time token dropping). */
export function isStopword(word: string): boolean {
  return STOPWORD_LOOKUP.has(word.toLowerCase());
}

/** Apply the same letter casing pattern as `source` to `replacement`. */
export function matchWordCasing(source: string, replacement: string): string {
  if (source === source.toUpperCase() && source !== source.toLowerCase()) {
    return replacement.toUpperCase();
  }
  if (source[0] === source[0]?.toUpperCase() && source.slice(1) === source.slice(1).toLowerCase()) {
    return replacement[0]!.toUpperCase() + replacement.slice(1).toLowerCase();
  }
  if (source === source.toLowerCase()) {
    return replacement.toLowerCase();
  }
  return replacement;
}

/**
 * Return a progressively shorter form of `word` from the curated dictionary.
 * `level` 0 is the mildest abbreviation; higher levels are more aggressive.
 * Unknown words are returned unchanged. Levels beyond the last form clamp to the shortest entry.
 */
export function abbreviateWord(word: string, level: number): string {
  if (level < 0 || word.length === 0) {
    return word;
  }

  const forms = ABBREVIATIONS[word.toLowerCase()];
  if (!forms || forms.length === 0) {
    return word;
  }

  const index = Math.min(level, forms.length - 1);
  return matchWordCasing(word, forms[index]!);
}
