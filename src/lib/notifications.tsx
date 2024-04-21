import { NotificationData, notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { ReactNode } from 'react';

const notificationBase = (props: NotificationData) => {
  notifications.show({
    ...props,
  });
};

export const Notifications = {
  success: (message: ReactNode, options?: NotificationData) => {
    notificationBase({
      ...options,
      message,
      color: 'green',
      icon: <IconCheck color="green" />,
    });
  },
  error: (message: ReactNode, options?: NotificationData) => {
    notificationBase({
      ...options,
      message,
      color: 'red',
      icon: <IconX color="red" />,
    });
  },
};
