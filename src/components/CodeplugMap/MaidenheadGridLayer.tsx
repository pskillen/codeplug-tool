import L from 'leaflet';
import { useMemo, useState } from 'react';
import { Marker, Polyline, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import {
  computeGridLabels,
  computeGridLines,
  type MaidenheadGridMode,
} from '../../lib/maidenheadGrid.ts';

const LINE_STYLE = {
  '4': { color: '#666', weight: 1.5, opacity: 0.35 },
  '6': { color: '#888', weight: 1, opacity: 0.2 },
} as const;

function boundsFromLeaflet(bounds: L.LatLngBounds) {
  return {
    south: bounds.getSouth(),
    west: bounds.getWest(),
    north: bounds.getNorth(),
    east: bounds.getEast(),
  };
}

function safeMapBounds(map: L.Map) {
  if (typeof map.getBounds === 'function') {
    return boundsFromLeaflet(map.getBounds());
  }
  return { south: 49, west: -11, north: 61, east: 2 };
}

function labelIcon(): L.DivIcon {
  return L.divIcon({
    className: 'maidenhead-grid-label-wrap',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export interface MaidenheadGridLayerProps {
  mode: MaidenheadGridMode;
}

export default function MaidenheadGridLayer({ mode }: MaidenheadGridLayerProps) {
  const map = useMap();
  const [bounds, setBounds] = useState(() => safeMapBounds(map));

  useMapEvents({
    moveend() {
      setBounds(safeMapBounds(map));
    },
    zoomend() {
      setBounds(safeMapBounds(map));
    },
  });

  const lines = useMemo(
    () => (mode === 'off' ? [] : computeGridLines(bounds, mode)),
    [bounds, mode],
  );
  const labels = useMemo(
    () => (mode === 'off' ? [] : computeGridLabels(bounds, mode)),
    [bounds, mode],
  );

  if (mode === 'off') return null;

  return (
    <>
      {lines.map((line, index) => (
        <Polyline
          key={`${line.level}-${index}-${line.positions[0][0]}-${line.positions[0][1]}`}
          positions={line.positions}
          pathOptions={LINE_STYLE[line.level]}
          interactive={false}
        />
      ))}
      {labels.map((label) => (
        <Marker
          key={`${label.level}-${label.text}-${label.position[0]}-${label.position[1]}`}
          position={label.position}
          icon={labelIcon()}
          interactive={false}
        >
          <Tooltip permanent direction="center" className="maidenhead-grid-label">
            {label.text}
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}
