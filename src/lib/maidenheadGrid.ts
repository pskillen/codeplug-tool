import { coordsToLocator } from './maidenhead.ts';

export type MaidenheadGridMode = 'off' | '4' | '6';

export interface MapBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

export interface GridLine {
  positions: [number, number][];
  level: '4' | '6';
}

export interface GridLabel {
  position: [number, number];
  text: string;
  level: '4' | '6';
}

const LON_STEP_4 = 2;
const LAT_STEP_4 = 1;
const LON_STEP_6 = 2 / 24;
const LAT_STEP_6 = 1 / 24;
const ORIGIN_LON = -180;
const ORIGIN_LAT = -90;

const DEFAULT_BUFFER_DEG = 0.5;

/** Fine 6-char lines and labels only render at this Leaflet zoom or above. */
export const MIN_ZOOM_FOR_6_DETAIL = 9;

function show6CharDetail(mode: MaidenheadGridMode, zoom: number | undefined): boolean {
  if (mode !== '6') return false;
  if (zoom == null) return true;
  return zoom >= MIN_ZOOM_FOR_6_DETAIL;
}

function padBounds(bounds: MapBounds, bufferDeg: number): MapBounds {
  return {
    south: Math.max(-90, bounds.south - bufferDeg),
    west: bounds.west - bufferDeg,
    north: Math.min(90, bounds.north + bufferDeg),
    east: bounds.east + bufferDeg,
  };
}

function enumBoundaries(min: number, max: number, step: number, origin: number): number[] {
  const nStart = Math.floor((min - origin) / step);
  const nEnd = Math.ceil((max - origin) / step);
  const out: number[] = [];
  for (let n = nStart; n <= nEnd; n++) {
    out.push(origin + n * step);
  }
  return out;
}

function verticalLine(lon: number, bounds: MapBounds): GridLine['positions'] {
  return [
    [bounds.south, lon],
    [bounds.north, lon],
  ];
}

function horizontalLine(lat: number, bounds: MapBounds): GridLine['positions'] {
  return [
    [lat, bounds.west],
    [lat, bounds.east],
  ];
}

function addLevelLines(
  lines: GridLine[],
  bounds: MapBounds,
  level: '4' | '6',
  lonStep: number,
  latStep: number,
): void {
  for (const lon of enumBoundaries(bounds.west, bounds.east, lonStep, ORIGIN_LON)) {
    lines.push({ positions: verticalLine(lon, bounds), level });
  }
  for (const lat of enumBoundaries(bounds.south, bounds.north, latStep, ORIGIN_LAT)) {
    lines.push({ positions: horizontalLine(lat, bounds), level });
  }
}

export function computeGridLines(
  bounds: MapBounds,
  mode: MaidenheadGridMode,
  bufferDeg = DEFAULT_BUFFER_DEG,
  zoom?: number,
): GridLine[] {
  if (mode === 'off') return [];

  const padded = padBounds(bounds, bufferDeg);
  const lines: GridLine[] = [];

  if (mode === '4' || mode === '6') {
    addLevelLines(lines, padded, '4', LON_STEP_4, LAT_STEP_4);
  }
  if (show6CharDetail(mode, zoom)) {
    addLevelLines(lines, padded, '6', LON_STEP_6, LAT_STEP_6);
  }

  return lines;
}

function forEachCellCentre(
  bounds: MapBounds,
  lonStep: number,
  latStep: number,
  fn: (lat: number, lon: number) => void,
): void {
  const nMin = Math.floor((bounds.west - ORIGIN_LON) / lonStep);
  const nMax = Math.floor((bounds.east - ORIGIN_LON) / lonStep);
  const mMin = Math.floor((bounds.south - ORIGIN_LAT) / latStep);
  const mMax = Math.floor((bounds.north - ORIGIN_LAT) / latStep);

  for (let n = nMin; n <= nMax; n++) {
    for (let m = mMin; m <= mMax; m++) {
      const centreLon = ORIGIN_LON + n * lonStep + lonStep / 2;
      const centreLat = ORIGIN_LAT + m * latStep + latStep / 2;
      if (
        centreLat >= bounds.south &&
        centreLat <= bounds.north &&
        centreLon >= bounds.west &&
        centreLon <= bounds.east
      ) {
        fn(centreLat, centreLon);
      }
    }
  }
}

export function computeGridLabels(
  bounds: MapBounds,
  mode: MaidenheadGridMode,
  bufferDeg = DEFAULT_BUFFER_DEG,
  zoom?: number,
): GridLabel[] {
  if (mode === 'off') return [];

  const padded = padBounds(bounds, bufferDeg);
  const labels: GridLabel[] = [];

  if (mode === '4') {
    forEachCellCentre(padded, LON_STEP_4, LAT_STEP_4, (lat, lon) => {
      labels.push({
        position: [lat, lon],
        text: coordsToLocator(lat, lon, 4),
        level: '4',
      });
    });
  }

  if (show6CharDetail(mode, zoom)) {
    forEachCellCentre(padded, LON_STEP_6, LAT_STEP_6, (lat, lon) => {
      labels.push({
        position: [lat, lon],
        text: coordsToLocator(lat, lon, 6),
        level: '6',
      });
    });
  }

  return labels;
}
