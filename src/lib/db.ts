import { createDb } from '~/drizzle/client';
import { createSingleton } from '~/lib/utils';

const db = createSingleton('db', createDb);

export default db;
