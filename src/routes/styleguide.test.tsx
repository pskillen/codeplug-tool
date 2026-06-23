import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Styleguide from './styleguide.tsx';
import { theme } from '../theme.ts';

describe('Styleguide route', () => {
  it('renders without throwing', () => {
    render(
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <MemoryRouter>
          <Styleguide />
        </MemoryRouter>
      </MantineProvider>,
    );
    expect(screen.getByRole('heading', { name: 'UI styleguide' })).toBeInTheDocument();
    expect(screen.getByText('Page layout')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Primary' })).toBeInTheDocument();
  });
});
