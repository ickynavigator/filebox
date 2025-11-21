import { credentialsClient } from 'better-auth-credentials-plugin';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import type { auth } from '~/lib/auth';

export type Session = typeof authClient.$Infer.Session;

export const authClient = createAuthClient({
  plugins: [credentialsClient(), inferAdditionalFields<typeof auth>()],
});
