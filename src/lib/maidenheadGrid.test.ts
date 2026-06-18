import { describe, expect, it } from 'vitest';
import { coordsToLocator } from './maidenhead.ts';
import { computeGridLabels, computeGridLines } from './maidenheadGrid.ts';

/** Glasgow area viewport. */
const glasgowBounds = {
  south: 55.5,
  west: -5.0,
  north: 56.2,
  east: -3.8,
};

describe('maidenheadGrid', () => {
  it('returns no lines or labels when mode is off', () => {
    expect(computeGridLines(glasgowBounds, 'off')).toEqual([]);
    expect(computeGridLabels(glasgowBounds, 'off')).toEqual([]);
  });

  it('draws 4-char grid lines at 2° / 1° spacing', () => {
    const lines = computeGridLines(glasgowBounds, '4', 0);
    const lons = lines.flatMap((l) => l.positions.map((p) => p[1]));
    expect(lines.some((l) => l.level === '4')).toBe(true);
    expect(lines.every((l) => l.level === '4')).toBe(true);
    expect(lons.some((lon) => Math.abs(lon - -6) < 0.001)).toBe(true);
    expect(lons.some((lon) => Math.abs(lon - -4) < 0.001)).toBe(true);
  });

  it('adds 6-char fine lines in mode 6', () => {
    const lines = computeGridLines(glasgowBounds, '6', 0);
    expect(lines.some((l) => l.level === '4')).toBe(true);
    expect(lines.some((l) => l.level === '6')).toBe(true);
    expect(lines.filter((l) => l.level === '6').length).toBeGreaterThan(
      lines.filter((l) => l.level === '4').length,
    );
  });

  it('labels 4-char cells with IO85-style locators', () => {
    const labels = computeGridLabels(glasgowBounds, '4', 0);
    expect(labels.length).toBeGreaterThan(0);
    expect(labels.every((l) => l.text.length === 4)).toBe(true);
    expect(labels.some((l) => l.text.startsWith('IO'))).toBe(true);
    for (const label of labels) {
      expect(label.text).toBe(coordsToLocator(label.position[0], label.position[1], 4));
    }
  });

  it('labels 6-char fine cells in mode 6', () => {
    const labels = computeGridLabels(glasgowBounds, '6', 0);
    expect(labels.length).toBeGreaterThan(0);
    expect(labels.every((l) => l.text.length === 6)).toBe(true);
    for (const label of labels) {
      expect(label.text).toBe(coordsToLocator(label.position[0], label.position[1], 6));
    }
  });

  it('clamps latitude at poles in padded bounds', () => {
    const polarBounds = { south: 88, west: 0, north: 89.5, east: 10 };
    expect(() => computeGridLines(polarBounds, '4')).not.toThrow();
    expect(() => computeGridLabels(polarBounds, '4')).not.toThrow();
  });
});
