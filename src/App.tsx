import { AppShell, Burger, Group, NavLink, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import ActiveProjectBar from './components/ActiveProjectBar/ActiveProjectBar.tsx';
import BuildFooter from './components/BuildFooter.tsx';
import Home from './routes/Home.tsx';
import Map from './routes/Map.tsx';
import { useProjects } from './state/codeplugStore.tsx';

function App() {
  const [opened, { toggle, close }] = useDisclosure();
  const location = useLocation();
  const { activeProjectId } = useProjects();
  const showNav = activeProjectId != null;

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={
        showNav
          ? {
              width: 260,
              breakpoint: 'sm',
              collapsed: { mobile: !opened },
            }
          : undefined
      }
      padding={location.pathname === '/map' ? 0 : 'md'}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          {showNav ? (
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          ) : null}
          <Text fw={600}>MM9PDY Codeplug Tool</Text>
        </Group>
      </AppShell.Header>

      {showNav ? (
        <AppShell.Navbar p="md">
          <Stack gap="md">
            <ActiveProjectBar />
            <NavLink
              component={Link}
              to="/"
              label="Home"
              active={location.pathname === '/'}
              onClick={close}
            />
            <NavLink
              component={Link}
              to="/map"
              label="Channel map"
              active={location.pathname === '/map'}
              onClick={close}
            />
          </Stack>
        </AppShell.Navbar>
      ) : null}

      <AppShell.Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
        </Routes>
        <BuildFooter />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
