'use client';

import {
  Burger,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  Stack,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ColorSchemeToggle from './colorSchemeToggle';
import FileBoxLogo from './fileBoxLogo';
import NavigationButton from './NavigationButton';

interface NavigationDrawerProps {
  signoutbutton: React.ReactNode;
}

export default function NavigationDrawer(props: NavigationDrawerProps) {
  const { signoutbutton } = props;
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <>
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />

      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="md"
        title={<FileBoxLogo />}
        hiddenFrom="sm"
        zIndex={1_000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Stack px="md">
            <NavigationButton href="/files">List all files</NavigationButton>

            <NavigationButton href="/files/upload">
              Upload a file
            </NavigationButton>
          </Stack>
          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            {signoutbutton}

            <ColorSchemeToggle />
          </Group>
        </ScrollArea>
      </Drawer>
    </>
  );
}
