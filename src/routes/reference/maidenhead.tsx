import { Group, NumberInput, SegmentedControl, Stack, Text, TextInput, Title } from '@mantine/core';
import { useMemo, useState } from 'react';
import ReportPage from '../../components/report/ReportPage.tsx';
import { coordsToLocator, isValidLocator, locatorToCoords } from '../../lib/maidenhead.ts';

type LocatorPrecision = 4 | 6 | 8 | 10;

const PRECISION_OPTIONS: { value: string; label: string }[] = [
  { value: '4', label: '4 (field)' },
  { value: '6', label: '6 (square)' },
  { value: '8', label: '8 (subsquare)' },
  { value: '10', label: '10 (cell)' },
];

function parseCoord(value: string | number): number | null {
  const n = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

export default function MaidenheadConverter() {
  const [locator, setLocator] = useState('');
  const [lat, setLat] = useState<string | number>('');
  const [lon, setLon] = useState<string | number>('');
  const [precision, setPrecision] = useState<LocatorPrecision>(6);

  const locatorError = useMemo(() => {
    if (!locator.trim()) return null;
    if (!isValidLocator(locator)) return 'Invalid Maidenhead locator (4, 6, 8, or 10 characters)';
    return null;
  }, [locator]);

  const handleLocatorChange = (value: string) => {
    setLocator(value);
    if (!value.trim()) return;
    if (!isValidLocator(value)) return;
    const coords = locatorToCoords(value);
    if (coords) {
      setLat(coords.lat);
      setLon(coords.lon);
      setLocator(value.trim().toUpperCase().replace(/\s/g, ''));
    }
  };

  const handleLatChange = (value: string | number) => {
    setLat(value);
    const latN = parseCoord(value);
    const lonN = parseCoord(lon);
    if (latN != null && lonN != null) {
      setLocator(coordsToLocator(latN, lonN, precision));
    }
  };

  const handleLonChange = (value: string | number) => {
    setLon(value);
    const latN = parseCoord(lat);
    const lonN = parseCoord(value);
    if (latN != null && lonN != null) {
      setLocator(coordsToLocator(latN, lonN, precision));
    }
  };

  const handlePrecisionChange = (value: string) => {
    const p = Number(value) as LocatorPrecision;
    setPrecision(p);
    const latN = parseCoord(lat);
    const lonN = parseCoord(lon);
    if (latN != null && lonN != null) {
      setLocator(coordsToLocator(latN, lonN, p));
    }
  };

  return (
    <ReportPage title="Maidenhead converter">
      <Stack gap="lg">
        <Text c="dimmed">
          Convert between Maidenhead grid locators and WGS84 coordinates. Updates live as you type.
        </Text>

        <Stack gap="sm">
          <Title order={4}>Locator</Title>
          <TextInput
            label="Maidenhead locator"
            placeholder="e.g. IO85uk"
            value={locator}
            onChange={(e) => handleLocatorChange(e.currentTarget.value)}
            error={locatorError}
          />
        </Stack>

        <Stack gap="sm">
          <Title order={4}>Coordinates</Title>
          <SegmentedControl
            value={String(precision)}
            onChange={handlePrecisionChange}
            data={PRECISION_OPTIONS}
          />
          <Group grow>
            <NumberInput
              label="Latitude"
              value={lat}
              onChange={handleLatChange}
              decimalScale={6}
              min={-90}
              max={90}
            />
            <NumberInput
              label="Longitude"
              value={lon}
              onChange={handleLonChange}
              decimalScale={6}
              min={-180}
              max={180}
            />
          </Group>
        </Stack>
      </Stack>
    </ReportPage>
  );
}
