import { MantineProvider, Text } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ListPage from './ListPage.tsx';
import { theme } from '../../theme.ts';

describe('ListPage', () => {
  it('renders title and children', () => {
    render(
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <ListPage title="Channels" description="All channels.">
          <Text>Table here</Text>
        </ListPage>
      </MantineProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Channels' })).toBeInTheDocument();
    expect(screen.getByText('All channels.')).toBeInTheDocument();
    expect(screen.getByText('Table here')).toBeInTheDocument();
  });
});
