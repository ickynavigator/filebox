/* eslint-disable arrow-body-style */
import { keys } from '>lib/swr';
import { Auth } from '>types';
import {
  ActionIcon,
  Anchor,
  AppShell,
  Group,
  Header,
  useMantineColorScheme,
} from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { Box, Logout, MoonStars, Sun } from 'tabler-icons-react';

export const NavigationBar = () => {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { mutate } = useSWRConfig();
  const { data } = useSWR(
    keys.AUTH,
    async () => (await axios.get<{ message: Auth }>(`/api/auth/check`)).data,
    { fallbackData: { message: Auth.Unauthorized }, shouldRetryOnError: false },
  );
  const { trigger } = useSWRMutation(
    keys.AUTH_MUTATE,
    async () => (await axios.delete('/api/auth')).data,
    {
      onSuccess: () => {
        mutate(keys.AUTH, { message: Auth.Unauthorized }, false);
        router.push('/auth');
      },
    },
  );

  return (
    <Header height="10%">
      <Group sx={{ height: '100%' }} px={20} position="apart">
        <Group>
          <Anchor href="/">
            <Box size={50} />
          </Anchor>
          <Anchor
            component={Link}
            href="/files"
            size="xl"
            transform="capitalize"
            weight="bold"
          >
            List all files
          </Anchor>
          <Anchor
            component={Link}
            href="/files/upload"
            size="xl"
            transform="capitalize"
            weight="bold"
          >
            Upload a file
          </Anchor>
        </Group>

        <Group>
          {data.message === Auth.Authorized && (
            <ActionIcon variant="default" onClick={() => trigger()} size={30}>
              <Logout size={16} />
            </ActionIcon>
          )}
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
