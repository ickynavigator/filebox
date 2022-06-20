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
  useMantineTheme,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import { useFetchAllFiles } from 'hooks';
import { AlertCircle, Download } from 'tabler-icons-react';

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

  return (
    <Container className="h-100">
      {files.length > 0 ? (
        <Stack>
          {files.map(file => (
            <Card shadow="sm" p="lg">
              <Group
                position="apart"
                style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
              >
                <Title order={3} style={{ textDecoration: 'underline' }}>
                  {file.name}
                </Title>
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
