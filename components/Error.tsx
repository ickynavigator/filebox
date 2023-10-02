import { Alert, Center, Container } from '@mantine/core';
import { AlertCircle } from 'tabler-icons-react';

interface Props {
  message?: string;
}
const Index: React.FC<Props> = ({ message }) => (
  <Container>
    <Center py="md">
      <Alert icon={<AlertCircle size={16} />} title="Bummer!" color="red">
        {message ?? 'Sorry but an error occurred.'}
      </Alert>
    </Center>
  </Container>
);

export default Index;
