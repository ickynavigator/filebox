import { Loader } from '>components';
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
  useMantineTheme,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import axios from 'axios';
import { useFetchAllFiles } from 'hooks';
import Head from 'next/head';
import { AlertCircle, Download, X } from 'tabler-icons-react';

const Index = () => {
  const { data, error, loading } = useFetchAllFiles({});
  const theme = useMantineTheme();

  const secondaryColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7];

  if (loading) {
    return <Loader />;
  }

  if (error || !data) {
    return (
      <Container>
        <Center py="md">
          <Alert icon={<AlertCircle size={16} />} title="Bummer!" color="red">
            Sorry but an error occurred.
          </Alert>
        </Center>
      </Container>
    );
  }

  const { files } = data;

  const deleteFileHandler = async (fileId: string) => {
    const res = await axios.delete(`/api/file/${fileId}`);

    if (res.status === 200) {
      window.location.reload();
    }
  };

  return (
    <Container className="h-100">
      <Head>
        <title>List all files</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {files && files.length > 0 ? (
        <Stack>
          {files.map(file => (
            <Card shadow="sm" p="lg" key={String(file._id)}>
              <Group
                position="apart"
                style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
              >
                <Title order={3} style={{ textDecoration: 'underline' }}>
                  {file.name}
                </Title>

                <Group>
                  <Tooltip label="Download" withArrow>
                    <Button
                      component={NextLink}
                      variant="light"
                      color="blue"
                      style={{ marginTop: 14 }}
                      download
                      rel="noopener noreferrer"
                      target="_blank"
                      href={`api/download?filename=${file.url}`}
                    >
                      <Download />
                    </Button>
                  </Tooltip>

                  <Tooltip label="Delete file" withArrow color="red">
                    <Button
                      variant="light"
                      color="red"
                      style={{ marginTop: 14 }}
                      onClick={() => deleteFileHandler(String(file._id))}
                    >
                      <X />
                    </Button>
                  </Tooltip>
                </Group>
              </Group>

              <Text
                size="sm"
                style={{ color: secondaryColor, lineHeight: 1.5 }}
              >
                {file.description || 'No description'}
              </Text>
            </Card>
          ))}
        </Stack>
      ) : (
        <Center py="md" className="h-100">
          <Alert
            icon={<AlertCircle size={16} />}
            title="Bummer!"
            color="yellow"
          >
            No files found.
          </Alert>
        </Center>
      )}
    </Container>
  );
};

export default Index;
