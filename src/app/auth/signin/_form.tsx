'use client';

import { Alert, Button, Paper, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { signIn } from '~/lib/auth.react';
import React, { useState } from 'react';
import { Notifications } from '~/lib/notifications';
import { useRouter } from 'next/navigation';

interface Props {
  nextPage: string;
}

export const SignInForm = (props: Props) => {
  const router = useRouter();

  const [loading, setloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({ initialValues: { passkey: '' } });

  const handleSubmit = async (values: typeof form.values) => {
    setloading(true);
    setError(null);

    const { passkey } = values;

    const res = await signIn('credentials', { passkey, redirect: false });

    setloading(false);

    if (!res?.error) {
      Notifications.success('Successfully authenticated');
      router.push(props.nextPage);
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
    <>
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
    </>
  );
};
