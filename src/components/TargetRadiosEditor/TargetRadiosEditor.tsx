import { ActionIcon, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useState, type KeyboardEvent } from 'react';
import { hasDuplicateTargetRadios } from '../../lib/validation/project.ts';
import { ICON_SIZE_NAV, ICON_STROKE } from '../../lib/iconSizes.ts';

export interface TargetRadiosEditorProps {
  value: string[];
  onChange: (items: string[]) => void;
  label?: string;
  description?: string;
}

function isDuplicate(items: string[], candidate: string, excludeIndex?: number): boolean {
  const key = candidate.trim().toLowerCase();
  if (!key) return false;
  return items.some((item, index) => {
    if (excludeIndex !== undefined && index === excludeIndex) return false;
    return item.trim().toLowerCase() === key;
  });
}

export default function TargetRadiosEditor({
  value,
  onChange,
  label = 'Target radios',
  description = 'For your notes only — not used for import, export, or validation.',
}: TargetRadiosEditorProps) {
  const [newItem, setNewItem] = useState('');
  const [newItemError, setNewItemError] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  const commitNewItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) {
      setNewItem('');
      setNewItemError(null);
      return;
    }
    if (isDuplicate(value, trimmed)) {
      setNewItemError('This radio is already in the list');
      return;
    }
    onChange([...value, trimmed]);
    setNewItem('');
    setNewItemError(null);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(value[index]);
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
    setEditError(null);
  };

  const commitEdit = () => {
    if (editingIndex === null) return;
    const trimmed = editValue.trim();
    if (!trimmed) {
      onChange(value.filter((_, i) => i !== editingIndex));
      cancelEdit();
      return;
    }
    if (isDuplicate(value, trimmed, editingIndex)) {
      setEditError('This radio is already in the list');
      return;
    }
    onChange(value.map((item, i) => (i === editingIndex ? trimmed : item)));
    cancelEdit();
  };

  const handleNewKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitNewItem();
    }
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  const deleteItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    if (editingIndex === index) cancelEdit();
  };

  return (
    <Stack gap="xs">
      <div>
        <Text size="sm" fw={500}>
          {label}
        </Text>
        {description ? (
          <Text size="xs" c="dimmed">
            {description}
          </Text>
        ) : null}
      </div>

      <Stack gap={4}>
        {value.map((item, index) => (
          <Group key={`${item}-${index}`} gap="xs" wrap="nowrap" align="flex-start">
            <Text c="dimmed" lh="36px" style={{ flexShrink: 0 }}>
              •
            </Text>
            {editingIndex === index ? (
              <TextInput
                style={{ flex: 1 }}
                value={editValue}
                onChange={(e) => {
                  setEditValue(e.currentTarget.value);
                  setEditError(null);
                }}
                onBlur={commitEdit}
                onKeyDown={handleEditKeyDown}
                error={editError}
                autoFocus
              />
            ) : (
              <Text
                size="sm"
                style={{ flex: 1, cursor: 'pointer', lineHeight: '36px' }}
                onClick={() => startEdit(index)}
              >
                {item}
              </Text>
            )}
            {editingIndex !== index ? (
              <Group gap={4} wrap="nowrap" style={{ flexShrink: 0 }}>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  aria-label={`Edit ${item}`}
                  onClick={() => startEdit(index)}
                >
                  <IconPencil size={ICON_SIZE_NAV} stroke={ICON_STROKE} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="sm"
                  aria-label={`Delete ${item}`}
                  onClick={() => deleteItem(index)}
                >
                  <IconTrash size={ICON_SIZE_NAV} stroke={ICON_STROKE} />
                </ActionIcon>
              </Group>
            ) : null}
          </Group>
        ))}

        <Group gap="xs" wrap="nowrap" align="flex-start">
          <Text c="dimmed" lh="36px" style={{ flexShrink: 0 }}>
            •
          </Text>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Add a radio…"
            value={newItem}
            onChange={(e) => {
              setNewItem(e.currentTarget.value);
              setNewItemError(null);
            }}
            onBlur={commitNewItem}
            onKeyDown={handleNewKeyDown}
            error={newItemError}
          />
        </Group>
      </Stack>

      {hasDuplicateTargetRadios(value) ? (
        <Text size="xs" c="red">
          Target radios must be unique
        </Text>
      ) : null}
    </Stack>
  );
}
