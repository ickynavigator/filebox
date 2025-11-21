import { betterAuth } from 'better-auth';
import { credentials } from 'better-auth-credentials-plugin';

import 'better-auth/plugins';

import env from '~/env/index';

export type Session = typeof auth.$Infer.Session;

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    credentials({
      autoSignUp: true,
      async callback(_, parsed) {
        if (parsed.password === env.PASSWORD) {
          return { id: '1', name: 'Admin', email: '', image: '' };
        }

        throw new Error('CredentialsSignin');
      },
    }),
  ],
});
