/* eslint-disable arrow-body-style */
import {
  ActionIcon,
  Anchor,
  AppShell,
  Group,
  Header,
  useMantineColorScheme,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import React from 'react';
import { Box, MoonStars, Sun } from 'tabler-icons-react';

export const NavigationBar = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Header py={30} height={100}>
      <Group sx={{ height: '100%' }} px={20} position="apart">
        <Group>
          <Anchor href="/">
            <Box size={50} />
          </Anchor>
          <Anchor
            component={NextLink}
            href="/files"
            size="xl"
            transform="capitalize"
            weight="bold"
          >
            List all files
          </Anchor>
          <Anchor
            component={NextLink}
            href="/files/upload"
            size="xl"
            transform="capitalize"
            weight="bold"
          >
            Upload a file
          </Anchor>
        </Group>

        <Group>
          <ActionIcon
            variant="default"
            onClick={() => toggleColorScheme()}
            size={30}
          >
            {colorScheme === 'dark' ? (
              <Sun size={16} />
            ) : (
              <MoonStars size={16} />
            )}
          </ActionIcon>
        </Group>
      </Group>
    </Header>
  );
};

interface Props {
  children: React.ReactNode;
}
export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <AppShell navbarOffsetBreakpoint="sm" header={<NavigationBar />}>
      {children}
    </AppShell>
  );
};

export default Layout;
