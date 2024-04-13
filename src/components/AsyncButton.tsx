'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { useState } from 'react';
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
  const [loading, setLoading] = useState(false);

  return (
    <Tooltip label={label} withArrow color={color}>
      <ActionIcon
        variant="light"
        color={color}
        loading={loading}
        onClick={
          action &&
          (async () => {
            try {
              setLoading(true);
              await action();
              setLoading(false);
              onSuccess?.();
            } catch (error) {
              Notifications.error('An error occurred. Please try again.');
            }
          })
        }
        {...buttonProps}
      >
        {Icon}
      </ActionIcon>
    </Tooltip>
  );
};
export default AsyncButton;
