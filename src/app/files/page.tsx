import {
  Alert,
  Button,
  Card,
  Center,
  Container,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconAlertCircle, IconDownload, IconX } from '@tabler/icons-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { deleteFile, getFiles } from '~/actions/files';

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
            <Group justify="space-between" mb={5} mt="sm">
              <Title order={3} td="underline">
                {file.name}
              </Title>
              <Group>
                <Tooltip label="Download" withArrow>
                  <Button
                    component={Link}
                    variant="light"
                    color="blue"
                    mt={14}
                    download
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`api/download?filename=${file.url}`}
                  >
                    <IconDownload />
                  </Button>
                </Tooltip>
                <Tooltip label="Delete file" withArrow color="red">
                  <Button
                    variant="light"
                    color="red"
                    mt={14}
                    onClick={async () => {
                      'use server';
                      await deleteFile(file.id);
                      window.location.reload();
                    }}
                  >
                    <IconX />
                  </Button>
                </Tooltip>
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
