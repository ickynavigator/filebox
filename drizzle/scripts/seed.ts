import fs from 'fs';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod/v4';

import * as schema from '~/drizzle/schema';
import { createDb } from '../client';

const db = createDb();

async function main() {
  const insertSchema = z.object({
    files: createInsertSchema(schema.ifile).array(),
  });

  const path = './files.json';

  if (fs.existsSync(path)) {
    const input: unknown = await import(path);
    const { files } = insertSchema.parse(input);
    const response = await db.insert(schema.ifile).values(files);
    // eslint-disable-next-line no-console
    console.log(response);
  } else {
    console.error('File not found');
  }
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
