'use client';

import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Notifications } from '~/lib/notifications';

const Page = () => {
  const searchParams = useSearchParams();
  const nextPage = searchParams?.get('next') || '/';
  const router = useRouter();

  const [loading, setloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({ initialValues: { passkey: '' } });

  const handleSubmit = async (values: typeof form.values) => {
    setloading(true);
    setError(null);

    const res = await signIn('credentials', {
      passkey: values.passkey,
      redirect: false,
    });

    setloading(false);

    if (!res?.error) {
      Notifications.success('Successfully authenticated');
      router.push(nextPage);
      return;
    }

    if (res?.error === 'CredentialsSignin') {
      form.setErrors({ passkey: 'Invalid passkey' });
      return;
    }

    const message = 'Something went wrong';
    setError(message);
    Notifications.error(message);
    return;
  };

  return (
    <Container my="lg">
      <Stack>
        <Title ta="center">Welcome Back!</Title>

        <Text c="dimmed" size="sm" ta="center" mt={5}>
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
      </Stack>
    </Container>
  );
};

export default Page;
