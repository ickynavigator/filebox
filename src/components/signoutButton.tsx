import { Suspense } from 'react';

import { auth } from '~/lib/auth';
import { InnerSignoutButton } from './signoutButton.client';

export const SignoutButton = async () => {
  const session = await auth();

  return <Suspense>{session?.user ? <InnerSignoutButton /> : null}</Suspense>;
};
