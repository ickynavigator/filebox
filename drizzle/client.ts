import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from '~/drizzle/schema';
import env from '~/env/index';

export function createDb() {
  const libsql = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_TOKEN,
  });
  const instance = drizzle(libsql, { schema });

  return instance;
}
