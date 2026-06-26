import {
  Alert,
  Anchor,
  Button,
  Group,
  Modal,
  Radio,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { frequencyHzToMhz, formatMhzNumber } from '../../lib/formatFrequency.ts';
import { ICON_SIZE_NAV, ICON_STROKE } from '../../lib/iconSizes.ts';
import {
  BrandMeisterDirectoryError,
  searchBrandMeisterDevices,
} from '../../lib/repeaterDirectories/registry.ts';
import type { BrandMeisterDevice } from '../../lib/repeaterDirectories/registry.ts';
import {
  isMapDeviceSkip,
  mapDeviceToChannelInput,
} from '../../lib/repeaterDirectories/brandmeister/mapToChannel.ts';
import type { EntityMeta } from '../../models/codeplug.ts';

export interface BrandMeisterFormPatch {
  callsign: string;
  name: string;
  rxFrequencyMhz: string;
  txFrequencyMhz: string;
  colourCode: string;
  comment: string;
  lat: string;
  lon: string;
  useLocation: boolean;
  meta?: EntityMeta;
}

function hzToMhzInput(hz: number | null): string {
  if (hz == null || hz <= 0) return '';
  const mhz = frequencyHzToMhz(hz);
  return mhz != null ? formatMhzNumber(mhz) : '';
}

export function deviceResultToFormPatch(
  device: BrandMeisterDevice,
): BrandMeisterFormPatch | null {
  const mapped = mapDeviceToChannelInput(device);
  if (isMapDeviceSkip(mapped)) return null;

  const lat = mapped.input.location?.lat;
  const lon = mapped.input.location?.lon;

  return {
    callsign: mapped.input.callsign,
    name: mapped.input.name,
    rxFrequencyMhz: hzToMhzInput(mapped.input.rxFrequency),
    txFrequencyMhz: hzToMhzInput(mapped.input.txFrequency),
    colourCode:
      mapped.input.colourCode != null ? String(mapped.input.colourCode) : '',
    comment: mapped.input.comment,
    lat: lat != null && Number.isFinite(lat) ? String(lat) : '',
    lon: lon != null && Number.isFinite(lon) ? String(lon) : '',
    useLocation: mapped.input.useLocation,
    meta: mapped.meta,
  };
}

export interface BrandMeisterChannelLookupProps {
  initialQuery?: string;
  onApply: (patch: BrandMeisterFormPatch) => void;
}

export default function BrandMeisterChannelLookup({
  initialQuery = '',
  onApply,
}: BrandMeisterChannelLookupProps) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [devices, setDevices] = useState<BrandMeisterDevice[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const runSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError('Enter a callsign or device id.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await searchBrandMeisterDevices(trimmed);
      if (result.devices.length === 0) {
        setError('No devices matched your search.');
        return;
      }
      if (result.devices.length === 1) {
        const patch = deviceResultToFormPatch(result.devices[0]);
        if (!patch) {
          setError('Device has no mappable DMR frequency data.');
          return;
        }
        onApply(patch);
        return;
      }
      setDevices(result.devices);
      setSelectedId(String(result.devices[0].id));
      setPickerOpen(true);
    } catch (err) {
      if (err instanceof BrandMeisterDirectoryError) {
        setError(err.message);
      } else {
        setError('Search failed — try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const applySelected = () => {
    const device = devices.find((d) => String(d.id) === selectedId);
    if (!device) return;
    const patch = deviceResultToFormPatch(device);
    if (!patch) {
      setError('Selected device has no mappable DMR frequency data.');
      setPickerOpen(false);
      return;
    }
    onApply(patch);
    setPickerOpen(false);
  };

  return (
    <>
      <Stack gap="xs">
        <Group align="flex-end" wrap="wrap">
          <TextInput
            label="BrandMeister lookup"
            description="Pre-fill from network by callsign or device id"
            placeholder="e.g. GB7HH"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void runSearch();
              }
            }}
            style={{ flex: 1, minWidth: 180 }}
          />
          <Button
            variant="light"
            leftSection={<IconSearch size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
            loading={loading}
            onClick={() => void runSearch()}
          >
            Look up
          </Button>
        </Group>
        {error ? (
          <Alert color="red" title="BrandMeister">
            {error}{' '}
            <Anchor href="https://brandmeister.network" target="_blank" rel="noopener noreferrer">
              BrandMeister
            </Anchor>
          </Alert>
        ) : null}
      </Stack>

      <Modal opened={pickerOpen} onClose={() => setPickerOpen(false)} title="Select device">
        <Stack gap="md">
          <Text size="sm">Multiple devices match — choose one to pre-fill the form.</Text>
          <Radio.Group value={selectedId ?? ''} onChange={setSelectedId}>
            <Stack gap="xs">
              {devices.map((d) => (
                <Radio
                  key={d.id}
                  value={String(d.id)}
                  label={`${d.callsign} (id ${d.id})${d.city ? ` — ${d.city}` : ''}`}
                />
              ))}
            </Stack>
          </Radio.Group>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setPickerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applySelected}>Apply to form</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
