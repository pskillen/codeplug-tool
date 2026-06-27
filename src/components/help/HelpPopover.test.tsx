import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { describe, expect, it } from 'vitest';
import HelpPopover from './HelpPopover.tsx';

function renderHelp(helpId: 'gettingStarted.home' = 'gettingStarted.home') {
  return render(
    <MantineProvider>
      <MemoryRouter>
        <HelpPopover helpId={helpId} />
      </MemoryRouter>
    </MantineProvider>,
  );
}

describe('HelpPopover', () => {
  it('shows short text and learn more link when opened', async () => {
    renderHelp();
    fireEvent.click(screen.getByRole('button', { name: /Help: Home/i }));
    await waitFor(() => {
      expect(screen.getByText(/Importing here always creates a new project/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: 'Learn more', hidden: true })).toHaveAttribute(
      'href',
      '/help/getting-started',
    );
  });
});
