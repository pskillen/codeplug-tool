import { Button, Group, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import TargetRadiosEditor from '../../components/TargetRadiosEditor/TargetRadiosEditor.tsx';
import ReportPage from '../../components/report/ReportPage.tsx';
import { hasValidationErrors } from '../../lib/validation/channel.ts';
import {
  sanitizeProjectMetadataPatch,
  validateProjectMetadata,
} from '../../lib/validation/project.ts';
import type { CodeplugProject } from '../../models/codeplugProject.ts';
import { useProjects } from '../../state/codeplugStore.tsx';
import { ICON_SIZE_NAV, ICON_STROKE } from '../../lib/iconSizes.ts';

type FormValues = Pick<
  CodeplugProject,
  'name' | 'description' | 'notes' | 'author' | 'targetRadios'
>;

function projectToForm(project: CodeplugProject): FormValues {
  return {
    name: project.name,
    description: project.description,
    notes: project.notes,
    author: project.author,
    targetRadios: [...project.targetRadios],
  };
}

export default function ProjectEdit() {
  const navigate = useNavigate();
  const { activeProject, updateProject } = useProjects();

  if (!activeProject) {
    return <Navigate to="/" replace />;
  }

  return (
    <ProjectEditForm
      key={activeProject.id}
      project={activeProject}
      onSave={(patch) => {
        updateProject(activeProject.id, patch);
        navigate('/summary');
      }}
    />
  );
}

function ProjectEditForm({
  project,
  onSave,
}: {
  project: CodeplugProject;
  onSave: (patch: ReturnType<typeof sanitizeProjectMetadataPatch>) => void;
}) {
  const [values, setValues] = useState<FormValues>(() => projectToForm(project));
  const [formError, setFormError] = useState<string | null>(null);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const patch = sanitizeProjectMetadataPatch(values);
    const issues = validateProjectMetadata({
      name: patch.name ?? '',
      description: patch.description,
      notes: patch.notes,
      author: patch.author,
      targetRadios: patch.targetRadios,
    });

    if (hasValidationErrors(issues)) {
      setFormError(issues.find((i) => i.severity === 'error')?.message ?? 'Validation failed');
      return;
    }

    onSave(patch);
  };

  return (
    <ReportPage title="Edit project">
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          <Button
            component={Link}
            to="/summary"
            variant="subtle"
            size="compact-sm"
            style={{ alignSelf: 'flex-start' }}
            leftSection={<IconArrowLeft size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
          >
            Back to summary
          </Button>

          {formError ? (
            <Text c="red" size="sm">
              {formError}
            </Text>
          ) : null}

          <TextInput
            label="Name"
            required
            value={values.name}
            onChange={(e) => set('name', e.currentTarget.value)}
          />
          <TextInput
            label="Description"
            description="Short one-line summary"
            value={values.description}
            onChange={(e) => set('description', e.currentTarget.value)}
          />
          <TextInput
            label="Author"
            description="Who created or maintains this layout"
            value={values.author}
            onChange={(e) => set('author', e.currentTarget.value)}
          />
          <TargetRadiosEditor
            value={values.targetRadios}
            onChange={(targetRadios) => set('targetRadios', targetRadios)}
          />
          <Textarea
            label="Notes"
            description="Free-form notes about layout intent or pending changes"
            minRows={4}
            value={values.notes}
            onChange={(e) => set('notes', e.currentTarget.value)}
          />

          <Group>
            <Button
              type="submit"
              leftSection={<IconDeviceFloppy size={ICON_SIZE_NAV} stroke={ICON_STROKE} />}
            >
              Save
            </Button>
            <Button component={Link} to="/summary" variant="default">
              Cancel
            </Button>
          </Group>
        </Stack>
      </form>
    </ReportPage>
  );
}
