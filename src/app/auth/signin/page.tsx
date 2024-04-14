import { Code, Container, Stack, Text, Title } from '@mantine/core';
import { SignInForm } from './_form';
import { auth } from '~/lib/auth';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: {
    next?: string;
  };
}

const Page = async (props: Props) => {
  const session = await auth();
  const nextPage = props.searchParams.next ?? '/';

  if (session) {
    redirect(nextPage);
  }

  return (
    <Container my="lg">
      <Stack>
        <Title ta="center">Welcome Back!</Title>

        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Get the code from your admin
        </Text>

        <Text c="dimmed" size="sm" ta="center" mt={5}>
          hint: the demo password is <Code>password</Code>
        </Text>

        <SignInForm nextPage={nextPage} />
      </Stack>
    </Container>
  );
};

export default Page;
