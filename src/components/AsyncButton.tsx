'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { useTransition } from 'react';

import { Notifications } from '~/lib/notifications';

interface IAsyncButton {
  label: string;
  color?: string;
  action?: () => Promise<void>;
  onSuccess?: () => void;
  Icon: React.ReactNode;

  buttonProps?: React.ComponentPropsWithoutRef<typeof ActionIcon>;
}

const AsyncButton = (props: IAsyncButton) => {
  const { label, color, action, Icon, buttonProps, onSuccess } = props;
  const [loading, startTransition] = useTransition();

  const handleClick = () => {
    if (!action) return;

    startTransition(async () => {
      try {
        await action();
        onSuccess?.();
      } catch {
        Notifications.error('An error occurred. Please try again.');
      }
    });
  };

  return (
    <Tooltip label={label} withArrow color={color}>
      <ActionIcon
        variant="outline"
        color={color}
        loading={loading}
        onClick={handleClick}
        {...buttonProps}
      >
        {Icon}
      </ActionIcon>
    </Tooltip>
  );
};
export default AsyncButton;
