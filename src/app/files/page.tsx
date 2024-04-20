import {
  Alert,
  Center,
  Container,
  Group,
  ScrollArea,
  Stack,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { Metadata } from 'next';
import { deleteFile } from '~/actions/aws';
import { getFilesCached } from '~/actions/files';
import { getTagsCached } from '~/actions/tags';
import CustomPill from '~/components/customPill';
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

  const tags = await getTagsCached();

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
        {tags.length > 0 ? (
          <ScrollArea offsetScrollbars>
            <Group gap="xs" wrap="nowrap">
              {tags.map(tag => (
                <CustomPill key={tag.id} tag={tag} />
              ))}
            </Group>
          </ScrollArea>
        ) : null}

        {files.map(file => (
          <FileCard key={file.id} file={file} deleteHandler={deleteHandler} />
        ))}
      </Stack>
    </Container>
  );
}

export default Page;
