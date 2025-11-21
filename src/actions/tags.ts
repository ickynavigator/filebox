'use server';

import { like } from 'drizzle-orm';
import { unstable_cache as cache, revalidateTag } from 'next/cache';

import * as schema from '~/drizzle/schema';
import { TAGS } from '~/lib/constants';
import db from '~/lib/db';
import { Tag } from '~/types';

interface GetTagsOpts {
  query?: Tag['name'];
}

async function getTags(opts?: GetTagsOpts) {
  const { query } = opts ?? {};

  return db
    .select()
    .from(schema.tag)
    .where(like(schema.tag.name, `%${query}%`));
}

export const getTagsCached = cache(getTags, ['tags'], {
  tags: [TAGS.TAGS],
});

export async function createBatchTags(names: Tag['name'][]) {
  if (!names.length || names.length === 0) {
    return [];
  }

  const res = await db.transaction(async client => {
    return await client
      .insert(schema.tag)
      .values(names.map(name => ({ name })))
      .returning();
  });

  revalidateTag(TAGS.TAGS);

  return res;
}
