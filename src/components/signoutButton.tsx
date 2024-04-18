import { auth } from '~/lib/auth';
import { Suspense } from 'react';
import { InnerSignoutButton } from './signoutButton.client';

export const SignoutButton = async () => {
  const session = await auth();

  return <Suspense>{session?.user ? <InnerSignoutButton /> : null}</Suspense>;
};
