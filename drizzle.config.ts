import { defineConfig } from 'drizzle-kit';

import env from '~/env/index';

export default defineConfig({
  dialect: 'turso',
  out: './drizzle/migrations',
  schema: './drizzle/schema.ts',
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_TOKEN,
  },
  verbose: true,
  strict: true,
});
