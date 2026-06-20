import { MantineProvider } from '@mantine/core';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '../../theme.ts';
import TargetRadiosEditor from './TargetRadiosEditor.tsx';

function renderEditor(ui: ReactNode) {
  return render(
    <MantineProvider theme={theme} defaultColorScheme="dark">
      {ui}
    </MantineProvider>,
  );
}

describe('TargetRadiosEditor', () => {
  it('adds an item on blur when the add input is non-empty', () => {
    const onChange = vi.fn();
    renderEditor(<TargetRadiosEditor value={[]} onChange={onChange} />);

    const input = screen.getByPlaceholderText('Add a radio…');
    fireEvent.change(input, { target: { value: 'Baofeng 1701' } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith(['Baofeng 1701']);
  });

  it('adds an item on Enter', () => {
    const onChange = vi.fn();
    renderEditor(<TargetRadiosEditor value={[]} onChange={onChange} />);

    const input = screen.getByPlaceholderText('Add a radio…');
    fireEvent.change(input, { target: { value: 'DM-32UV' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith(['DM-32UV']);
  });

  it('does not add on empty blur', () => {
    const onChange = vi.fn();
    renderEditor(<TargetRadiosEditor value={[]} onChange={onChange} />);

    fireEvent.blur(screen.getByPlaceholderText('Add a radio…'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('deletes an item', () => {
    const onChange = vi.fn();
    renderEditor(<TargetRadiosEditor value={['A', 'B']} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete A' }));
    expect(onChange).toHaveBeenCalledWith(['B']);
  });

  it('commits inline edit on blur', () => {
    const onChange = vi.fn();
    renderEditor(<TargetRadiosEditor value={['Old']} onChange={onChange} />);

    fireEvent.click(screen.getByText('Old'));
    const editInput = screen.getByDisplayValue('Old');
    fireEvent.change(editInput, { target: { value: 'New' } });
    fireEvent.blur(editInput);

    expect(onChange).toHaveBeenCalledWith(['New']);
  });

  it('rejects duplicate add', () => {
    const onChange = vi.fn();
    renderEditor(<TargetRadiosEditor value={['Baofeng 1701']} onChange={onChange} />);

    const input = screen.getByPlaceholderText('Add a radio…');
    fireEvent.change(input, { target: { value: 'baofeng 1701' } });
    fireEvent.blur(input);

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText('This radio is already in the list')).toBeInTheDocument();
  });
});
