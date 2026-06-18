import { Alert, Box, Button, Group, Stack, Text } from '@mantine/core';
import { useCallback, useRef, useState } from 'react';
import { collectFilesFromDataTransfer, importFiles } from '../../lib/import/index.ts';
import { useCodeplug } from '../../state/codeplugStore.tsx';
import '../ChannelMap/ChannelMap.css';

function formatImportSummary(
  recognised: string[],
  skipped: { fileName: string; message: string }[],
  errors: { fileName: string; message: string }[],
): string | null {
  const parts: string[] = [];
  if (recognised.length) parts.push(`Recognised: ${recognised.join(', ')}`);
  if (skipped.length)
    parts.push(`Skipped: ${skipped.map((s) => `${s.fileName} (${s.message})`).join('; ')}`);
  if (errors.length)
    parts.push(`Errors: ${errors.map((e) => `${e.fileName}: ${e.message}`).join('; ')}`);
  return parts.length ? parts.join(' · ') : null;
}

export default function ImportPanel() {
  const { codeplug, applyImport, clear } = useCodeplug();
  const [dragover, setDragover] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      try {
        const result = await importFiles(files);
        applyImport(result);
        setSummary(formatImportSummary(result.recognised, result.skipped, result.errors));
        setError(result.errors.length ? result.errors.map((e) => e.message).join('; ') : null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    },
    [applyImport],
  );

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragover(false);
      const files = await collectFilesFromDataTransfer(e.dataTransfer);
      await handleFiles(files);
    },
    [handleFiles],
  );

  const channelCount = codeplug.channels.length;
  const zoneCount = codeplug.zones.length;

  return (
    <Stack gap="sm">
      <Text size="sm" c="dimmed">
        Drop OpenGD77 CSV files or a whole export folder. <code>Channels.csv</code> and{' '}
        <code>Zones.csv</code> are recognised; other files are skipped.
      </Text>

      {error ? (
        <Alert color="red" onClose={() => setError(null)} withCloseButton>
          {error}
        </Alert>
      ) : null}

      {summary ? (
        <Text size="sm" c="dimmed">
          {summary}
        </Text>
      ) : null}

      <Box
        className={`channel-map-dropzone${dragover ? ' dragover' : ''}`}
        tabIndex={0}
        onClick={() => filesInputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragover(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragover(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragover(false);
        }}
        onDrop={onDrop}
      >
        Drop CSV files or a folder here, or click to choose files
        <input
          ref={filesInputRef}
          type="file"
          accept=".csv,text/csv"
          multiple
          hidden
          onChange={(e) => {
            const list = e.target.files ? [...e.target.files] : [];
            void handleFiles(list);
            e.target.value = '';
          }}
        />
      </Box>

      <Group grow>
        <Button variant="default" onClick={() => filesInputRef.current?.click()}>
          Choose files
        </Button>
        <Button variant="default" onClick={() => folderInputRef.current?.click()}>
          Choose folder
        </Button>
      </Group>

      <input
        ref={folderInputRef}
        type="file"
        accept=".csv,text/csv"
        hidden
        multiple
        {...({ webkitdirectory: '', directory: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
        onChange={(e) => {
          const list = e.target.files ? [...e.target.files] : [];
          void handleFiles(list);
          e.target.value = '';
        }}
      />

      {channelCount > 0 || zoneCount > 0 ? (
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {channelCount} channel{channelCount === 1 ? '' : 's'}
            {zoneCount ? ` · ${zoneCount} zone${zoneCount === 1 ? '' : 's'}` : ''} loaded
          </Text>
          <Button variant="subtle" color="red" size="compact-sm" onClick={() => clear()}>
            Clear all
          </Button>
        </Group>
      ) : null}
    </Stack>
  );
}
