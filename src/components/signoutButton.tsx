import { headers } from 'next/headers';
import { Suspense } from 'react';

import { InnerSignoutButton } from '~/components/signoutButton.client';
import { auth } from '~/lib/auth';

export const SignoutButton = async () => {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  return <Suspense>{session?.user ? <InnerSignoutButton /> : null}</Suspense>;
};
