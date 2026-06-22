import { describe, expect, it } from 'vitest';
import {
  formatOpenGd77DmrIdWire,
  formatOpenGd77SquelchWire,
  formatOpenGd77ToneWire,
} from './channelWire.ts';

describe('OpenGD77 export channelWire (mode-aware)', () => {
  describe('formatOpenGd77ToneWire', () => {
    it('is blank on digital', () => {
      expect(formatOpenGd77ToneWire('dmr', 'none')).toBe('');
      expect(formatOpenGd77ToneWire('dmr', '103.5')).toBe('');
    });

    it('is None or CTCSS on analogue', () => {
      expect(formatOpenGd77ToneWire('fm', 'none')).toBe('None');
      expect(formatOpenGd77ToneWire('fm', '103.5')).toBe('103.5');
    });
  });

  describe('formatOpenGd77SquelchWire', () => {
    it('is blank on digital', () => {
      expect(formatOpenGd77SquelchWire('dmr', null)).toBe('');
      expect(formatOpenGd77SquelchWire('dmr', 75)).toBe('');
    });

    it('is Disabled or percent on analogue', () => {
      expect(formatOpenGd77SquelchWire('fm', null)).toBe('Disabled');
      expect(formatOpenGd77SquelchWire('fm', 75)).toBe('75%');
    });
  });

  describe('formatOpenGd77DmrIdWire', () => {
    it('is empty on analogue', () => {
      expect(formatOpenGd77DmrIdWire('fm', null)).toBe('');
      expect(formatOpenGd77DmrIdWire('fm', 1234567)).toBe('');
    });

    it('is None or numeric on digital', () => {
      expect(formatOpenGd77DmrIdWire('dmr', null)).toBe('None');
      expect(formatOpenGd77DmrIdWire('dmr', 2351234)).toBe('2351234');
    });
  });
});
