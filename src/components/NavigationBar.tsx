import { ActionIcon, Anchor, Group } from '@mantine/core';
import { IconBox, IconLogout } from '@tabler/icons-react';
import { signOut } from '~/lib/auth.react';
import Link from 'next/link';
import ColorSchemeToggle from './colorSchemeToggle';
import { auth } from '~/lib/auth';
import { SignoutButton } from './signoutButton';

export const NavigationBar = async () => {
  const session = await auth();

  return (
    <>
      <Group style={{ height: '100%' }} px={20} justify="space-between">
        <Group>
          <Anchor href="/">
            <IconBox size={32} />
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
          {session?.user != null && <SignoutButton />}
          <ColorSchemeToggle />
        </Group>
      </Group>
    </>
  );
};
