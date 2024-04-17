import { Center, Code, Container, Stack, Text, Title } from '@mantine/core';
import { auth } from '~/lib/auth';
import { redirect } from 'next/navigation';
import { SignInForm } from './_form';

interface Props {
  searchParams: {
    next?: string;
  };
}

const Page = async (props: Props) => {
  const { searchParams } = props;
  const { next: nextPage = '/files' } = searchParams;

  const session = await auth();

  if (session) {
    redirect(nextPage);
  }

  return (
    <Center h="100%">
      <Container w="100%">
        <Stack align="stretch">
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
    </Center>
  );
};

export default Page;
