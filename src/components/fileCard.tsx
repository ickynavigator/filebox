'use client';

import {
  ActionIconGroup,
  Card,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import React from 'react';
import type { IFile } from '@prisma/client';
import { IconDownload, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { Notifications } from '~/lib/notifications';
import { useRouter } from 'next/navigation';
import { bytesToMegaBytes } from '~/lib/utils';
import type { IFileReturn } from '~/types';
import { timeFromNow } from '~/lib/dateTime';
import cx from 'clsx';
import AsyncButton from './AsyncButton';
import ClipboardButton from './copyButton';
import CustomPill from './customPill';
import classes from './fileCard.module.css';

interface Props {
  file: IFileReturn['files'][number];
  deleteHandler: (id: IFile['id']) => Promise<void>;
}

export const FileCard = (props: Props) => {
  const router = useRouter();
  const { file, deleteHandler } = props;

  const expiryTime = timeFromNow(file.expiresAt);

  const expiringToday =
    expiryTime.includes('hours') ||
    expiryTime.includes('minutes') ||
    expiryTime.includes('seconds');

  return (
    <Card
      shadow="md"
      p="lg"
      withBorder
      className={cx({ [classes.ExpiringSoon]: expiringToday })}
    >
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

        {file.expiresAt ? (
          <Text size="sm" lh={1.5} c="red">
            Expires: {expiryTime}
          </Text>
        ) : null}

        {file.size ? (
          <Text size="sm" lh={1.5} c="dimmed">
            {bytesToMegaBytes(file?.size).toFixed(2)}MB
          </Text>
        ) : null}

        <Text size="sm" lh={1.5} c="dimmed">
          {file.description || 'No description'}
        </Text>

        {file.tags.length > 0 ? (
          <ScrollArea offsetScrollbars>
            <Group gap="xs" wrap="nowrap">
              {file.tags.map(tag => (
                <CustomPill key={tag.id} tag={tag} />
              ))}
            </Group>
          </ScrollArea>
        ) : null}
      </Stack>
    </Card>
  );
};
