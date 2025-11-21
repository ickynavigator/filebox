import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from '~/drizzle/schema';
import env from '~/env/index.mjs';
import { createSingleton } from '~/lib/utils';

function createDb() {
  const libsql = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_TOKEN,
  });
  const drizzleInstance = drizzle(libsql, { schema });

  return drizzleInstance;
}

const db = createSingleton('db', createDb);

export default db;
