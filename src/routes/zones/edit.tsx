import { Button, Checkbox, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ZoneMemberPicker from '../../components/crud/ZoneMemberPicker.tsx';
import HelpHint from '../../components/help/HelpHint.tsx';
import FormatVarianceTable from '../../components/help/FormatVarianceTable.tsx';
import { getHelpShort } from '../../content/help/manifest.ts';
import { FormPage, FormSection } from '../../components/ui/index.ts';
import { findEntityById } from '../../lib/reportLookup.ts';
import { hasValidationErrors } from '../../lib/validation/channel.ts';
import { validateZone } from '../../lib/validation/zone.ts';
import { useCodeplug } from '../../state/codeplugStore.tsx';
import type { ZoneMemberEntry } from '../../models/codeplug.ts';
import { ICON_SIZE_NAV, ICON_STROKE } from '../../lib/iconSizes.ts';
import { DEFAULT_SCAN_CARRIER_FREQUENCY_HZ } from '../../lib/zoneDerivedScanLists/index.ts';

export default function ZoneEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { codeplug, addZone, updateZone, setZoneMembers } = useCodeplug();
  const isNew = id === undefined;
  const existing = !isNew && id ? findEntityById(codeplug.zones, id) : null;

  const [name, setName] = useState(existing?.name ?? '');
  const [members, setMembers] = useState<ZoneMemberEntry[]>(existing?.members ?? []);
  const [exportScratchChannel, setExportScratchChannel] = useState(
    existing?.exportScratchChannel ?? false,
  );
  const [exportScanList, setExportScanList] = useState(existing?.exportScanList ?? false);
  const [scanCarrierMhz, setScanCarrierMhz] = useState<number | ''>(
    existing?.scanCarrierFrequencyHz != null
      ? existing.scanCarrierFrequencyHz / 1_000_000
      : DEFAULT_SCAN_CARRIER_FREQUENCY_HZ / 1_000_000,
  );
  const [formError, setFormError] = useState<string | null>(null);

  if (!isNew && !existing) {
    return (
      <FormPage title="Edit zone">
        <Text>Zone not found.</Text>
        <Button component={Link} to="/zones" mt="md" variant="light">
          Back to zones
        </Button>
      </FormPage>
    );
  }

  const cancelPath = isNew ? '/zones' : `/zones/${existing?.id}`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const scanCarrierFrequencyHz =
      exportScanList && typeof scanCarrierMhz === 'number' && scanCarrierMhz > 0
        ? Math.round(scanCarrierMhz * 1_000_000)
        : null;

    const issues = validateZone({ name, members }, codeplug, existing?.id);
    if (hasValidationErrors(issues)) {
      setFormError(issues.find((i) => i.severity === 'error')?.message ?? 'Validation failed');
      return;
    }

    try {
      if (isNew) {
        addZone({
          name: name.trim(),
          members,
          exportScratchChannel,
          exportScanList,
          scanCarrierFrequencyHz,
        });
        navigate('/zones');
      } else if (existing) {
        updateZone(existing.id, {
          name: name.trim(),
          exportScratchChannel,
          exportScanList,
          scanCarrierFrequencyHz,
        });
        setZoneMembers(existing.id, members);
        navigate(`/zones/${existing.id}`);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Save failed');
    }
  };

  return (
    <FormPage
      title={isNew ? 'New zone' : `Edit ${existing?.name ?? 'zone'}`}
      onSubmit={handleSubmit}
      footer={
        <>
          <Button component={Link} to={cancelPath} variant="default">
            Cancel
          </Button>
          <Button
            type="submit"
            leftSection={<IconDeviceFloppy size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
          >
            Save
          </Button>
        </>
      }
    >
      <Stack gap="lg">
        <Button
          component={Link}
          to={cancelPath}
          variant="subtle"
          size="compact-sm"
          style={{ alignSelf: 'flex-start' }}
          leftSection={<IconArrowLeft size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
        >
          Back
        </Button>

        {formError ? (
          <Text c="red" size="sm">
            {formError}
          </Text>
        ) : null}

        <FormSection title="Zone details">
          <TextInput
            label="Zone name"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </FormSection>

        <FormSection
          title="DM32 export options"
          description={getHelpShort('importExport.dm32ZoneExport')}
        >
          <Stack gap="sm">
            <Checkbox
              label={
                <HelpHint label="Export a scratch channel" helpId="zone.exportScratchChannel" />
              }
              description={getHelpShort('zone.exportScratchChannel')}
              checked={exportScratchChannel}
              onChange={(e) => setExportScratchChannel(e.currentTarget.checked)}
            />
            <Checkbox
              label={
                <HelpHint label="Export a scan list / scan channel" helpId="zone.exportScanList" />
              }
              description={getHelpShort('zone.exportScanList')}
              checked={exportScanList}
              onChange={(e) => setExportScanList(e.currentTarget.checked)}
            />
            {exportScanList ? (
              <NumberInput
                label={<HelpHint label="Scan carrier frequency (MHz)" helpId="zone.scanCarrier" />}
                description={getHelpShort('zone.scanCarrier')}
                value={scanCarrierMhz}
                onChange={(value) => {
                  if (value === '' || value == null) setScanCarrierMhz('');
                  else setScanCarrierMhz(typeof value === 'number' ? value : Number(value));
                }}
                min={0}
                decimalScale={6}
                step={0.00625}
              />
            ) : null}
            <FormatVarianceTable varianceId="zoneAndScan" />
          </Stack>
        </FormSection>

        <FormSection title="Member channels" description={getHelpShort('zone.membership')}>
          <ZoneMemberPicker
            channels={codeplug.channels}
            members={members}
            onChange={setMembers}
            showScanInclusion
          />
        </FormSection>
      </Stack>
    </FormPage>
  );
}
