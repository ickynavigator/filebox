'use client';

import { ActionIcon } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useTransition } from 'react';

import { signOut } from '~/lib/auth.react';

export const InnerSignoutButton = () => {
  const [loading, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <ActionIcon variant="default" onClick={handleSignOut} loading={loading}>
      <IconLogout size={16} />
    </ActionIcon>
  );
};
