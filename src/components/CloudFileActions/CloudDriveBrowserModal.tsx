import { Alert, Button, Group, Modal, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconChevronLeft, IconFile, IconFolder } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { getGoogleDriveAccessToken, listDriveFolder } from '../../lib/cloud/googleDrive/index.ts';
import type { RemoteDriveEntry } from '../../lib/cloud/types.ts';
import { ICON_SIZE_NAV, ICON_STROKE } from '../../lib/iconSizes.ts';

export interface CloudDriveBrowserModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  /** Pick a single file — called with file id */
  onPickFile: (fileId: string, fileName: string) => void;
  /** Pick current folder for multi-file CPS import */
  onPickFolder?: (folderId: string, folderName: string) => void;
  fileFilter?: (name: string, mimeType?: string) => boolean;
  allowFolderImport?: boolean;
}

export default function CloudDriveBrowserModal({
  opened,
  onClose,
  title,
  onPickFile,
  onPickFolder,
  fileFilter,
  allowFolderImport = false,
}: CloudDriveBrowserModalProps) {
  const [folderStack, setFolderStack] = useState<Array<{ id: string; name: string }>>([
    { id: 'root', name: 'My Drive' },
  ]);
  const [entries, setEntries] = useState<RemoteDriveEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentFolder = folderStack[folderStack.length - 1]!;

  useEffect(() => {
    if (!opened) return;
    let cancelled = false;

    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getGoogleDriveAccessToken();
        const list = await listDriveFolder(token, currentFolder.id);
        if (!cancelled) setEntries(list);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setEntries([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [opened, currentFolder.id]);

  const enterFolder = (id: string, name: string) => {
    setFolderStack((stack) => [...stack, { id, name }]);
  };

  const goUp = () => {
    if (folderStack.length <= 1) return;
    setFolderStack((stack) => stack.slice(0, -1));
  };

  const visibleFiles = entries.filter((entry) => {
    if (entry.isFolder) return true;
    if (!fileFilter) return true;
    const fileRef = entry.ref;
    return fileFilter(fileRef.name, 'mimeType' in fileRef ? fileRef.mimeType : undefined);
  });

  return (
    <Modal opened={opened} onClose={onClose} title={title} size="lg">
      <Stack gap="sm">
        <Group justify="space-between">
          <Text size="sm" fw={500}>
            {currentFolder.name}
          </Text>
          {folderStack.length > 1 ? (
            <Button
              variant="subtle"
              size="compact-sm"
              leftSection={<IconChevronLeft size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
              onClick={goUp}
            >
              Up
            </Button>
          ) : null}
        </Group>

        {error ? (
          <Alert color="red" onClose={() => setError(null)} withCloseButton>
            {error}
          </Alert>
        ) : null}

        {loading ? <Text size="sm">Loading…</Text> : null}

        {!loading ? (
          <Stack gap={4}>
            {visibleFiles.length === 0 ? (
              <Text size="sm" c="dimmed">
                No matching files in this folder.
              </Text>
            ) : null}
            {visibleFiles.map((entry) => (
              <UnstyledButton
                key={entry.ref.id}
                onClick={() => {
                  if (entry.isFolder) {
                    enterFolder(entry.ref.id, entry.ref.name);
                    return;
                  }
                  onPickFile(entry.ref.id, entry.ref.name);
                  onClose();
                }}
                style={{ padding: '8px 4px', borderRadius: 4 }}
              >
                <Group gap="xs">
                  {entry.isFolder ? (
                    <IconFolder size={ICON_SIZE_NAV} stroke={ICON_STROKE} />
                  ) : (
                    <IconFile size={ICON_SIZE_NAV} stroke={ICON_STROKE} />
                  )}
                  <Text size="sm">{entry.ref.name}</Text>
                </Group>
              </UnstyledButton>
            ))}
          </Stack>
        ) : null}

        {allowFolderImport && onPickFolder ? (
          <Button
            variant="light"
            onClick={() => {
              onPickFolder(currentFolder.id, currentFolder.name);
              onClose();
            }}
          >
            Import CSV files from this folder
          </Button>
        ) : null}
      </Stack>
    </Modal>
  );
}
