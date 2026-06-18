import { Badge, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CodeplugProject } from '../../models/codeplugProject.ts';
import { useProjects } from '../../state/codeplugStore.tsx';

function formatUpdatedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function ProjectList() {
  const navigate = useNavigate();
  const { projects, activeProjectId, setActiveProject, deleteProject } = useProjects();
  const [deleteTarget, setDeleteTarget] = useState<CodeplugProject | null>(null);
  const [confirmOpen, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);

  const openProject = (id: string) => {
    setActiveProject(id);
    navigate('/summary');
  };

  const requestDelete = (project: CodeplugProject) => {
    setDeleteTarget(project);
    openConfirm();
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteProject(deleteTarget.id);
    }
    setDeleteTarget(null);
    closeConfirm();
  };

  if (!projects.length) {
    return null;
  }

  return (
    <>
      <Stack gap="sm">
        {projects.map((project) => {
          const isActive = project.id === activeProjectId;
          const channelCount = project.codeplug.channels.length;
          const zoneCount = project.codeplug.zones.length;

          return (
            <Group key={project.id} justify="space-between" align="flex-start" wrap="nowrap">
              <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                <Group gap="xs">
                  <Text fw={600} truncate>
                    {project.name}
                  </Text>
                  {isActive ? (
                    <Badge size="sm" variant="light">
                      Active
                    </Badge>
                  ) : null}
                </Group>
                <Text size="sm" c="dimmed">
                  {channelCount} channel{channelCount === 1 ? '' : 's'}
                  {zoneCount ? ` · ${zoneCount} zone${zoneCount === 1 ? '' : 's'}` : ''}
                  {' · '}
                  updated {formatUpdatedAt(project.updatedAt)}
                </Text>
              </Stack>
              <Group gap="xs" wrap="nowrap">
                <Button size="compact-sm" variant="default" onClick={() => openProject(project.id)}>
                  Open
                </Button>
                <Button
                  size="compact-sm"
                  variant="subtle"
                  color="red"
                  onClick={() => requestDelete(project)}
                >
                  Delete
                </Button>
              </Group>
            </Group>
          );
        })}
      </Stack>

      <Modal
        opened={confirmOpen}
        onClose={() => {
          setDeleteTarget(null);
          closeConfirm();
        }}
        title="Delete codeplug?"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            Delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeConfirm}>
              Cancel
            </Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
