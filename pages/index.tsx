import { Button, Center, Container, Text, Title } from '@mantine/core';
import { NextLink } from '@mantine/next';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Box, File, HeartHandshake } from 'tabler-icons-react';

const Home: NextPage = () => (
  <>
    <Head>
      <title>File Box</title>
      <meta name="description" content="A file dropbox" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Container>
      <Title order={1} align="center">
        Welcome to FileBox
      </Title>
      <Center>
        <File color="blue" size={48} />
        <HeartHandshake color="pink" size={48} />
        <Box color="brown" size={48} />
      </Center>
      <Text align="center">A file uploading and downloading site</Text>

      <Center my="lg">
        <Button component={NextLink} href="/files/upload" mx="md">
          Upload a new file
        </Button>
        <Button component={NextLink} href="/files" mx="md">
          View All Files
        </Button>
      </Center>
    </Container>
  </>
);

export default Home;
