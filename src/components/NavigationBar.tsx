import { Anchor, Box, Container, Group } from '@mantine/core';
import ColorSchemeToggle from './colorSchemeToggle';
import { SignoutButton } from './signoutButton';
import FileBoxLogo from './fileBoxLogo';
import NavigationButton from './NavigationButton';
import NavigationDrawer from './navigationDrawer';

export const NavigationBar = async () => (
  <Box component="header" h={56} style={{ height: '100%' }}>
    <Container
      h={56}
      display="flex"
      style={{ alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Anchor href="/" underline="never">
        <FileBoxLogo />
      </Anchor>

      <Group gap="xs" visibleFrom="sm">
        <NavigationButton href="/files">List all files</NavigationButton>

        <NavigationButton href="/files/upload">Upload a file</NavigationButton>

        <Group gap="xs">
          <SignoutButton />

          <ColorSchemeToggle />
        </Group>
      </Group>

      <NavigationDrawer signoutbutton={<SignoutButton />} />
    </Container>
  </Box>
);
