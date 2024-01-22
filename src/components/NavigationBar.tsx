'use client';

import {
  ActionIcon,
  Anchor,
  Group,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconBox,
  IconLogout,
  IconMoonStars,
  IconSun,
} from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export const NavigationBar = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const session = useSession();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <Group style={{ height: '100%' }} px={20} justify="space-between">
        <Group>
          <Anchor href="/">
            <IconBox size={50} />
          </Anchor>
          <Anchor
            component={Link}
            href="/files"
            size="xl"
            tt="capitalize"
            fw="bold"
          >
            List all files
          </Anchor>
          <Anchor
            component={Link}
            href="/files/upload"
            size="xl"
            tt="capitalize"
            fw="bold"
          >
            Upload a file
          </Anchor>
        </Group>

        <Group>
          {session.status === 'authenticated' && (
            <ActionIcon variant="default" onClick={handleSignOut}>
              <IconLogout size={16} />
            </ActionIcon>
          )}
          <ActionIcon
            variant="default"
            onClick={() => toggleColorScheme()}
            size={30}
          >
            {colorScheme === 'dark' ? (
              <IconSun size={16} />
            ) : (
              <IconMoonStars size={16} />
            )}
          </ActionIcon>
        </Group>
      </Group>
    </>
  );
};
