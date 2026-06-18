import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from './App.tsx';
import { newProject } from './models/codeplugProject.ts';
import { CODEPLUG_STORAGE_KEY, serializeProjects } from './state/codeplugStorage.ts';
import { CodeplugProvider } from './state/codeplugStore.tsx';
import { theme } from './theme.ts';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
  Polygon: () => null,
  Polyline: () => null,
  Circle: () => null,
  Tooltip: () => null,
  useMap: () => ({
    fitBounds: vi.fn(),
    setView: vi.fn(),
    invalidateSize: vi.fn(),
    getContainer: () => {
      const parent = document.createElement('div');
      const container = document.createElement('div');
      parent.appendChild(container);
      return container;
    },
  }),
}));

function renderApp(initialRoute = '/') {
  return render(
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <MemoryRouter initialEntries={[initialRoute]}>
        <CodeplugProvider>
          <App />
        </CodeplugProvider>
      </MemoryRouter>
    </MantineProvider>,
  );
}

describe('App', () => {
  it('renders the home heading and import section', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { name: 'MM9PDY Codeplug Tool' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Import codeplug' })).toBeInTheDocument();
  });

  it('renders the channel map on /map', () => {
    renderApp('/map');
    expect(screen.getByRole('heading', { name: 'Channel map' })).toBeInTheDocument();
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.queryByText('Active codeplug')).not.toBeInTheDocument();
    expect(screen.queryByText('Drop CSV files or a folder here')).not.toBeInTheDocument();
  });

  it('shows app nav with active codeplug when a project is active', () => {
    const project = newProject('Test repeaters');
    localStorage.setItem(
      CODEPLUG_STORAGE_KEY,
      serializeProjects({ activeProjectId: project.id, projects: [project] }),
    );

    renderApp('/map');

    expect(screen.getByText('Active codeplug')).toBeInTheDocument();
    expect(screen.getByText('Test repeaters')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Channel map' })).toBeInTheDocument();
  });
});
