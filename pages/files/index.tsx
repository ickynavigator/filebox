import { Loader } from '>components';
import { Alert, Center, Container } from '@mantine/core';
import { useFetchAllFiles } from 'hooks';
import { AlertCircle } from 'tabler-icons-react';

const Index = () => {
  const { data, error, loading } = useFetchAllFiles({});

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
      {files.map(file => (
        <div key={file.id}>{file.name}</div>
      ))}
    </Container>
  );
};

export default Index;
