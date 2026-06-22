import { Select, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import type { ImportResult } from '../../lib/import/types.ts';
import {
  defaultVendorFormatId,
  vendorFormatById,
  vendorFormatSelectData,
  type VendorFormatId,
} from '../../lib/vendorFormats.ts';
import ImportFormatDropzone from '../ImportFormatDropzone/ImportFormatDropzone.tsx';

export interface ImportNewProjectPanelProps {
  onImported: (result: ImportResult) => void;
  persistenceError?: string | null;
  onDismissPersistenceError?: () => void;
  /** Shown above the format selector when the user has no projects yet. */
  introText?: string;
}

export default function ImportNewProjectPanel({
  onImported,
  persistenceError,
  onDismissPersistenceError,
  introText,
}: ImportNewProjectPanelProps) {
  const [vendorFormatId, setVendorFormatId] = useState<VendorFormatId>(defaultVendorFormatId);
  const vendorFormat = vendorFormatById(vendorFormatId);

  return (
    <Stack gap="sm">
      {introText ? (
        <Text size="sm" c="dimmed">
          {introText}
        </Text>
      ) : null}
      <Select
        label="Vendor format"
        description="Choose the CPS export format you are importing — files are not auto-detected."
        data={vendorFormatSelectData()}
        value={vendorFormatId}
        onChange={(value) => value && setVendorFormatId(value as VendorFormatId)}
        allowDeselect={false}
      />
      <ImportFormatDropzone
        vendorFormat={vendorFormat}
        onResult={onImported}
        persistenceError={persistenceError}
        onDismissPersistenceError={onDismissPersistenceError}
      />
    </Stack>
  );
}
