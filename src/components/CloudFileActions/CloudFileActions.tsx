import { Alert, Button, Stack, Text } from '@mantine/core';
import { IconBrandGoogleDrive, IconCloudUpload } from '@tabler/icons-react';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { getExportAdapter } from '../../lib/import-export/registry.ts';
import { buildExportPayload } from '../../lib/fileDelivery/index.ts';
import { importFromSources } from '../../lib/fileDelivery/importFromSources.ts';
import type { ImportResult } from '../../lib/import/types.ts';
import {
  createDriveTextFile,
  getGoogleDriveAccessToken,
  listDriveCsvInFolder,
  readDriveTextFile,
} from '../../lib/cloud/googleDrive/index.ts';
import type { VendorFormatId } from '../../lib/import-export/types.ts';
import { isGoogleDriveConfigured } from '../../lib/cloud/googleDrive/config.ts';
import { isGoogleDriveConnected } from '../../lib/cloud/googleDrive/auth.ts';
import { useGoogleDriveConnection } from '../../hooks/useGoogleDriveConnection.ts';
import { ICON_SIZE_NAV, ICON_STROKE } from '../../lib/iconSizes.ts';
import type { CodeplugProject } from '../../models/codeplugProject.ts';
import type { Codeplug } from '../../models/codeplug.ts';
import CloudDriveBrowserModal from './CloudDriveBrowserModal.tsx';

export interface CloudFileActionsImportProps {
  mode: 'import';
  vendorFormatId: VendorFormatId;
  profileId?: string;
  onImportResult: (result: ImportResult) => void;
}

export interface CloudFileActionsExportProps {
  mode: 'export';
  vendorFormatId: VendorFormatId;
  codeplug: Codeplug;
  project?: CodeplugProject | null;
  exportOptions?: Parameters<typeof buildExportPayload>[1]['options'];
  onComplete?: (message: string) => void;
}

export type CloudFileActionsProps = CloudFileActionsImportProps | CloudFileActionsExportProps;

function isYamlFormat(formatId: VendorFormatId): boolean {
  return formatId === 'native-yaml';
}

function isMultiFileCps(formatId: VendorFormatId): boolean {
  return formatId === 'opengd77' || formatId === 'dm32';
}

export default function CloudFileActions(props: CloudFileActionsProps) {
  const { configured, connected, connect, busy: connectBusy } = useGoogleDriveConnection();
  const [pickerOpen, { open: openPicker, close: closePicker }] = useDisclosure(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!configured) {
    return (
      <Text size="sm" c="dimmed">
        Google Drive is not configured for this build. See Settings or the contributor docs.
      </Text>
    );
  }

  const handleImportFile = async (fileId: string) => {
    if (props.mode !== 'import') return;
    setLoading(true);
    setError(null);
    try {
      const token = await getGoogleDriveAccessToken();
      const { ref, content } = await readDriveTextFile(token, fileId);
      const result = await importFromSources([{ name: ref.name, text: content }], {
        vendorFormatId: props.vendorFormatId,
        profileId: props.profileId,
      });
      if (result.errors.length) {
        setError(result.errors.map((e) => e.message).join('; '));
        return;
      }
      props.onImportResult(result);
      setStatus(`Imported ${ref.name} from Google Drive`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleImportFolder = async (folderId: string, folderName: string) => {
    if (props.mode !== 'import') return;
    setLoading(true);
    setError(null);
    try {
      const token = await getGoogleDriveAccessToken();
      const files = await listDriveCsvInFolder(token, folderId);
      if (!files.length) {
        setError(`No CSV files found in ${folderName}`);
        return;
      }
      const sources = await Promise.all(
        files.map(async (file) => {
          const { content } = await readDriveTextFile(token, file.id);
          return { name: file.name, text: content };
        }),
      );
      const result = await importFromSources(sources, {
        vendorFormatId: props.vendorFormatId,
        profileId: props.profileId,
        directoryName: folderName,
      });
      if (result.errors.length) {
        setError(result.errors.map((e) => e.message).join('; '));
        return;
      }
      props.onImportResult(result);
      setStatus(`Imported ${files.length} file(s) from ${folderName}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (props.mode !== 'export') return;
    setLoading(true);
    setError(null);
    try {
      const adapter = getExportAdapter(props.vendorFormatId);
      const { payloads, warnings } = buildExportPayload(adapter, {
        codeplug: props.codeplug,
        project: props.project ?? undefined,
        options: props.exportOptions,
      });
      const token = await getGoogleDriveAccessToken();
      for (const payload of payloads) {
        await createDriveTextFile(token, {
          name: payload.fileName,
          content: payload.content,
          mimeType: payload.mimeType,
        });
      }
      const warnText = warnings.length ? ` (${warnings.join('; ')})` : '';
      const message = `Saved ${payloads.length} file(s) to Google Drive${warnText}`;
      setStatus(message);
      props.onComplete?.(message);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const importFormatId = props.mode === 'import' ? props.vendorFormatId : 'native-yaml';

  return (
    <Stack gap="xs">
      {!connected ? (
        <Button
          variant="light"
          leftSection={<IconBrandGoogleDrive size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
          loading={connectBusy}
          onClick={() => void connect()}
        >
          Connect Google Drive
        </Button>
      ) : props.mode === 'import' ? (
        <Button
          variant="light"
          leftSection={<IconBrandGoogleDrive size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
          loading={loading}
          onClick={openPicker}
        >
          Open from Google Drive
        </Button>
      ) : (
        <Button
          variant="light"
          leftSection={<IconCloudUpload size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
          loading={loading}
          onClick={() => void handleExport()}
        >
          Save to Google Drive
        </Button>
      )}

      {status ? (
        <Text size="sm" c="dimmed">
          {status}
        </Text>
      ) : null}
      {error ? (
        <Alert color="red" onClose={() => setError(null)} withCloseButton>
          {error}
        </Alert>
      ) : null}

      {props.mode === 'import' && connected ? (
        <CloudDriveBrowserModal
          opened={pickerOpen}
          onClose={closePicker}
          title="Open from Google Drive"
          onPickFile={(id) => void handleImportFile(id)}
          onPickFolder={
            isMultiFileCps(importFormatId)
              ? (folderId, folderName) => void handleImportFolder(folderId, folderName)
              : undefined
          }
          allowFolderImport={isMultiFileCps(importFormatId)}
          fileFilter={(name) => {
            const lower = name.toLowerCase();
            if (isYamlFormat(importFormatId)) {
              return lower.endsWith('.yaml') || lower.endsWith('.yml');
            }
            return lower.endsWith('.csv');
          }}
        />
      ) : null}
    </Stack>
  );
}

/** @internal exported for tests */
export function cloudFileActionsConfigured(): boolean {
  return isGoogleDriveConfigured();
}

/** @internal exported for tests */
export function cloudFileActionsConnected(): boolean {
  return isGoogleDriveConnected();
}
