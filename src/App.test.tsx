import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App.tsx';
import { theme } from './theme.ts';

describe('App', () => {
  it('renders the home heading', () => {
    render(
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </MantineProvider>,
    );

    expect(screen.getByRole('heading', { name: 'opengd77-map' })).toBeInTheDocument();
  });
});
