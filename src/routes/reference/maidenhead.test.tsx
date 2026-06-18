import { MantineProvider } from '@mantine/core';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import MaidenheadConverter from './maidenhead.tsx';
import { theme } from '../../theme.ts';

vi.mock('../../components/MapLocationPicker/MapLocationPicker.tsx', () => ({
  default: () => <div data-testid="map-location-picker" />,
}));

function renderConverter() {
  return render(
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <MemoryRouter>
        <MaidenheadConverter />
      </MemoryRouter>
    </MantineProvider>,
  );
}

describe('MaidenheadConverter', () => {
  it('shows validation error for invalid locator', () => {
    renderConverter();
    const input = screen.getByLabelText('Maidenhead locator');
    fireEvent.change(input, { target: { value: 'IO8' } });
    expect(screen.getByText(/Invalid Maidenhead locator/)).toBeInTheDocument();
  });

  it('updates coordinates when a valid locator is entered', () => {
    renderConverter();
    const input = screen.getByLabelText('Maidenhead locator');
    fireEvent.change(input, { target: { value: 'IO85' } });
    expect(screen.getByLabelText('Latitude')).toHaveValue('55.5');
    expect(screen.getByLabelText('Longitude')).toHaveValue('-3');
  });
});
