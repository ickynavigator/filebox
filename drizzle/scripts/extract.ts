import fs from 'fs';
import { asc } from 'drizzle-orm';

import * as schema from '~/drizzle/schema';
import { createDb } from '../client';

const db = createDb();

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
