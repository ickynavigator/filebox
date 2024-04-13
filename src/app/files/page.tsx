import { Alert, Center, Container, Stack } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { Metadata } from 'next';
import { deleteFile, getFiles } from '~/actions/files';
import { FileCard } from '~/components/fileCard';

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

  const deleteHandler = async (id: (typeof files)[number]['id']) => {
    'use server';
    await deleteFile(id);
  };

  return (
    <Container py="lg">
      <Stack>
        {files.map(file => (
          <FileCard key={file.id} file={file} deleteHandler={deleteHandler} />
        ))}
      </Stack>
    </Container>
  );
}

export default Page;
