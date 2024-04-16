import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import env from '~/env/index.mjs';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  pages: {
    signIn: '/auth/signin',
  },
  secret: env.NEXT_AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Passkey',
      credentials: {
        passkey: { label: 'Passkey', type: 'passkey' },
      },
      authorize({ passkey }) {
        if (passkey === env.PASSWORD) {
          return { id: '1', name: 'Admin', email: '', image: '' };
        }

        return null;
      },
    }),
  ],
});
