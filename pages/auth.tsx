import { Notifications } from '>lib/notifications';
import { keys } from '>lib/swr';
import { Auth } from '>types';
import {
  Alert,
  Button,
  Container,
  Paper,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

type MutReq = { arg: { password: string } };

const Index = () => {
  const router = useRouter();
  const [loading, setloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    initialValues: {
      passkey: '',
    },
  });
  const { trigger } = useSWRMutation(
    keys.AUTH_MUTATE,
    async (_, { arg: { password } }: MutReq) =>
      (await axios.post<{ message: Auth }>('/api/auth', { password })).data,
    {
      onError: () => {
        const msg = 'An Error Occured';
        setError(msg);
        return Notifications.error(msg);
      },
    },
  );

  const handleSubmit = async (values: typeof form.values) => {
    setloading(true);
    setError(null);

    const res = await trigger({ password: values.passkey });

    if (res.message === Auth.Authorized) {
      Notifications.success('Successfully authenticated');

      const nextPage = router.query.next ? String(router.query.next) : '/';
      return router.push(nextPage);
    }

    setloading(false);
    if (res?.message === Auth.Unauthorized) {
      const msg = 'Invalid passkey';
      setError(msg);
      return Notifications.error(msg);
    }

    return setError('Something went wrong');
  };

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={theme => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome Back!
      </Title>

      <Text color="dimmed" size="sm" align="center" mt={5}>
        Get the code from your admin
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Code"
            placeholder="passkey"
            {...form.getInputProps('passkey')}
          />

          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Authenticate
          </Button>
        </Paper>
      </form>

      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Bummer!"
          color="red"
          withCloseButton
        >
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default Index;
