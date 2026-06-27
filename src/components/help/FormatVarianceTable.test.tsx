import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { describe, expect, it } from 'vitest';
import FormatVarianceTable from './FormatVarianceTable.tsx';

describe('FormatVarianceTable', () => {
  it('renders OpenGD77, DM32, and CHIRP columns', () => {
    render(
      <MantineProvider>
        <FormatVarianceTable varianceId="rxGroupListExport" />
      </MantineProvider>,
    );
    expect(screen.getByText('OpenGD77')).toBeInTheDocument();
    expect(screen.getByText('DM32')).toBeInTheDocument();
    expect(screen.getByText('CHIRP')).toBeInTheDocument();
    expect(screen.getByText(/One row keeps the list reference/i)).toBeInTheDocument();
  });
});
