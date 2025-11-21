import fs from 'fs';
import { createClient } from '@libsql/client';
import { asc } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from '~/drizzle/schema';
import env from '~/env/index';

const libsql = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_TOKEN,
});
const db = drizzle(libsql, { schema });

async function main() {
  const files = await db
    .select()
    .from(schema.ifile)
    .orderBy(asc(schema.ifile.id));

  const obj = {
    files,
  };

  fs.writeFile('./db/files.json', JSON.stringify(obj, null, '\t'), err => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log('Saved!');
  });
}

main()
  .then(() => {
    db.$client.close();
  })
  .catch(e => {
    console.error(e);
    db.$client.close();
    process.exit(1);
  });
