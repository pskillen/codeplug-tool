import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { vendorFormatById } from '../../lib/vendorFormats.ts';
import ImportFormatDropzone from './ImportFormatDropzone.tsx';
import { theme } from '../../theme.ts';

describe('ImportFormatDropzone', () => {
  it('shows coming soon for planned formats', () => {
    render(
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <ImportFormatDropzone vendorFormat={vendorFormatById('qdmr')} onResult={() => {}} />
      </MantineProvider>,
    );
    expect(screen.getByText(/Import not available yet/i)).toBeInTheDocument();
  });

  it('renders dropzone for shipped CHIRP with explicit format hint', () => {
    render(
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <ImportFormatDropzone vendorFormat={vendorFormatById('chirp')} onResult={() => {}} />
      </MantineProvider>,
    );
    expect(screen.getByText(/Drop a CHIRP CSV memory CSV/i)).toBeInTheDocument();
  });
});
