/**
 * UK postcode shape detection (BS7666-style outward + inward groups).
 * Used to route geocode searches before callsign heuristics in ukrepeater auto mode.
 */

const UK_POSTCODE_RE =
  /^(GIR\s*0AA|(([A-PR-UWYZ][0-9]{1,2})|(([A-PR-UWYZ][A-HK-Y][0-9]{1,2})|(([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9]?[A-HJKSTUW]))))\s*[0-9][A-HJ-Z]{2})$/i;

function normaliseUkPostcode(query: string): string {
  return query.trim().replace(/\s+/g, ' ').toUpperCase();
}

/** True when the query looks like a UK postcode (with or without inward/outward space). */
export function looksLikeUkPostcode(query: string): boolean {
  const trimmed = query.trim();
  if (!trimmed) return false;

  const spaced = normaliseUkPostcode(trimmed);
  if (UK_POSTCODE_RE.test(spaced)) return true;

  const compact = trimmed.replace(/\s/g, '').toUpperCase();
  if (compact.length < 5 || compact.length > 7) return false;

  if (compact === 'GIR0AA') return true;

  const withSpace =
    compact.length === 5
      ? `${compact.slice(0, 2)} ${compact.slice(2)}`
      : `${compact.slice(0, -3)} ${compact.slice(-3)}`;
  return UK_POSTCODE_RE.test(withSpace);
}

/** Plain town/QTH name — letters, spaces, hyphens, apostrophes; no digits. */
export function looksLikeTownName(query: string): boolean {
  const trimmed = query.trim();
  if (!trimmed) return false;
  return /^[a-zA-Z][a-zA-Z\s'-]*$/.test(trimmed);
}
