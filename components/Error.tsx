import { Alert, Button, Center, Container, Stack } from '@mantine/core';
import { AlertCircle } from 'tabler-icons-react';

interface Props {
  message?: string;
  retry?: {
    show?: boolean;
    onClick?: () => void;
    message?: string;
  };
}
const Index: React.FC<Props> = props => {
  const { message, retry } = props;
  const handleRetry = () => {
    if (retry && retry.onClick) {
      retry.onClick();
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };
  return (
    <Container>
      <Center py="md">
        <Stack>
          <Alert icon={<AlertCircle size={16} />} title="Bummer!" color="red">
            {message ?? 'Sorry but an error occurred.'}
          </Alert>

          {retry?.show && (
            <Button
              onClick={handleRetry}
              variant="outline"
              color="yellow"
              leftIcon={<AlertCircle size={16} />}
            >
              {retry?.message ?? 'Reload Page'}
            </Button>
          )}
        </Stack>
      </Center>
    </Container>
  );
};

export default Index;
