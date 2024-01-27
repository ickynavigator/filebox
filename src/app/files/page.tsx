import {
  Alert,
  Card,
  Center,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconAlertCircle, IconDownload, IconX } from '@tabler/icons-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { deleteFile, getFiles } from '~/actions/files';
import AsyncButton from '~/components/AsyncButton';

export const metadata: Metadata = {
  title: 'List all files',
};

interface PageProps {
  searchParams: { search?: string };
}

async function Page(props: PageProps) {
  const { search } = props.searchParams;
  const { files } = await getFiles({ keyword: search ?? null });

  if (files.length <= 0) {
    return (
      <Center py="md" className="h-100">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Bummer!"
          color="yellow"
        >
          No files found.
        </Alert>
      </Center>
    );
  }

  return (
    <Container py="lg">
      <Stack>
        {files.map(file => (
          <Card shadow="sm" p="lg" key={file.id}>
            <Group justify="space-between" mb={5}>
              <Title order={3}>{file.name}</Title>
              <Group>
                <AsyncButton
                  label="Download"
                  Icon={<IconDownload />}
                  buttonProps={{
                    download: true,
                    component: Link,
                    rel: 'noopener noreferrer',
                    target: '_blank',
                    href: `api/download?filename=${file.id}`,
                  }}
                />
                <AsyncButton
                  color="red"
                  label="Delete file"
                  Icon={<IconX />}
                  action={async () => {
                    'use server';
                    await deleteFile(file.id);
                  }}
                />
              </Group>
            </Group>
            <Text size="sm" lh={1.5} c="dimmed">
              {file.description || 'No description'}
            </Text>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}

export default Page;
