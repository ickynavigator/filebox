'use client';

import {
  ActionIconGroup,
  Card,
  Group,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import React from 'react';
import { IFile } from '~/types';
import { IconDownload, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { Notifications } from '~/lib/notifications';
import { useRouter } from 'next/navigation';
import { bytesToMegaBytes } from '~/lib/utils';
import AsyncButton from './AsyncButton';
import ClipboardButton from './copyButton';

interface Props {
  file: IFile;
  deleteHandler: (id: IFile['id']) => Promise<void>;
}

export const FileCard = (props: Props) => {
  const router = useRouter();
  const { file, deleteHandler } = props;

  return (
    <Card shadow="md" p="lg" withBorder>
      <Stack gap="xs">
        <Group justify="space-between" mb={5}>
          <Title order={3}>{file.name}</Title>
          <ActionIconGroup>
            <ClipboardButton text={file.url} />
            <AsyncButton
              label="Download"
              Icon={<IconDownload style={{ width: rem(16) }} />}
              buttonProps={{
                download: true,
                component: Link,
                rel: 'noopener noreferrer',
                target: '_blank',
                href: `api/download/${encodeURIComponent(file.url)}${file.name ? `?filename=${encodeURIComponent(file.name)}` : ''}`,
              }}
            />

            <AsyncButton
              color="red"
              label="Delete file"
              Icon={<IconX style={{ width: rem(16) }} />}
              onSuccess={() => {
                Notifications.success('File deleted');
                router.refresh();
              }}
              action={async () => {
                await deleteHandler(file.id);
              }}
            />
          </ActionIconGroup>
        </Group>

        {file.size ? (
          <Text size="sm" lh={1.5} c="dimmed">
            {bytesToMegaBytes(file?.size).toFixed(2)}MB
          </Text>
        ) : null}

        <Text size="sm" lh={1.5} c="dimmed">
          {file.description || 'No description'}
        </Text>
      </Stack>
    </Card>
  );
};
