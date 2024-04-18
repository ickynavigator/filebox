'use client';

import { ActionIcon } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { signOut } from '~/lib/auth.react';
import React from 'react';

export const InnerSignoutButton = () => {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ActionIcon variant="default" onClick={handleSignOut}>
      <IconLogout size={16} />
    </ActionIcon>
  );
};
