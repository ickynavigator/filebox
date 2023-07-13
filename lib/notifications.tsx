import { NotificationProps, notifications } from '@mantine/notifications';
import { ReactNode } from 'react';
import { Check, X } from 'tabler-icons-react';

export const ICON_STROKE_WIDTH = 1;

export const notificationBase = (props: NotificationProps) => {
  notifications.show({
    ...props,
  });
};

export const Notifications = {
  success: (message: ReactNode, options?: NotificationProps) => {
    notificationBase({
      ...options,
      message,
      color: 'green',
      icon: <Check strokeWidth={ICON_STROKE_WIDTH} color="green" />,
    });
  },
  error: (message: ReactNode, options?: NotificationProps) => {
    notificationBase({
      ...options,
      message,
      color: 'red',
      icon: <X strokeWidth={ICON_STROKE_WIDTH} color="red" />,
    });
  },
};
