import { User } from 'better-auth';
import {
  credentialsClient,
  defaultCredentialsSchema,
} from 'better-auth-credentials-plugin';
import { createAuthClient } from 'better-auth/react';

export type Session = typeof authClient.$Infer.Session;

export const authClient = createAuthClient({
  plugins: [
    credentialsClient<
      User,
      '/sign-in/credentials',
      typeof defaultCredentialsSchema
    >(),
  ],
});

export const { signIn, signOut, useSession, getSession } = authClient;
