'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { useState } from 'react';

interface IAsyncButton {
  label: string;
  color?: string;
  action?: () => Promise<void>;
  Icon: React.ReactNode;

  buttonProps?: React.ComponentPropsWithoutRef<typeof ActionIcon>;
}

const AsyncButton = (props: IAsyncButton) => {
  const { label, color, action, Icon, buttonProps } = props;
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
            setLoading(true);
            await action();
            setLoading(false);
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
