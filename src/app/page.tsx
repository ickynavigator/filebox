import { Button, Center, Container, Text, Title } from '@mantine/core';
import { IconBox, IconFile, IconHeartHandshake } from '@tabler/icons-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'File Box',
};

function Page() {
  return (
    <Container my="lg">
      <Title order={1} ta="center">
        Welcome to FileBox
      </Title>

      <Center>
        <IconFile color="blue" size={48} />
        <IconHeartHandshake color="pink" size={48} />
        <IconBox color="brown" size={48} />
      </Center>

      <Text ta="center">A file uploading and downloading site</Text>

      <Center my="lg">
        <Button component={Link} href="/files/upload" mx="md">
          Upload a new file
        </Button>

        <Button component={Link} href="/files" mx="md">
          View All Files
        </Button>
      </Center>
    </Container>
  );
}

export default Page;
