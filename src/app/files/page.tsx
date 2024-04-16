import { Alert, Center, Container, Stack } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { Metadata } from 'next';
import { deleteFile } from '~/actions/aws';
import { getFilesCached } from '~/actions/files';
import { FileCard } from '~/components/fileCard';

export const metadata: Metadata = {
  title: 'List files',
};

interface PageProps {
  searchParams: { search?: string };
}

async function Page(props: PageProps) {
  const { searchParams } = props;
  const { search } = searchParams;

  const { files } = await getFilesCached({ keyword: search ?? null });

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
