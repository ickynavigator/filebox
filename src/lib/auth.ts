import { betterAuth } from 'better-auth';
import { credentials } from 'better-auth-credentials-plugin';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import 'better-auth/plugins';

import env from '~/env/index';
import db from '~/lib/db';

export type Session = typeof auth.$Infer.Session;

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'sqlite' }),
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    credentials({
      autoSignUp: true,
      callback(_, parsed) {
        if (parsed.password === env.PASSWORD) {
          return { id: '1', name: 'Admin', email: '', image: '' };
        }

        throw new Error('CredentialsSignin');
      },
    }),
  ],
});
