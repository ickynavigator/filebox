import { count, eq, like, or } from 'drizzle-orm';
import { unstable_cache as cache, revalidateTag } from 'next/cache';

import * as schema from '~/drizzle/schema';
import { TAGS } from '~/lib/constants';
import db from '~/lib/db';
import type { IFile, IFileReturn } from '~/types';

interface GetFilesOptions {
  pageSize?: number;
  page?: number;
  noPaginate?: boolean;
  param?: string;
  keyword?: string | null;
}

async function getFiles(options: GetFilesOptions) {
  const {
    pageSize = 10,
    page = 1,
    noPaginate = false,
    keyword = null,
  } = options;

  const result: IFileReturn = { files: [], noPaginate };

  let conditions = undefined;

  if (keyword != null) {
    const normalizedKeyword = `${keyword.toLocaleLowerCase()}`;

    conditions = or(
      like(schema.ifile.id, normalizedKeyword),
      like(schema.ifile.name, normalizedKeyword),
      like(schema.ifile.description, normalizedKeyword),
      like(schema.ifile.url, normalizedKeyword),
    );
  }

  let dirtyFiles;

  if (noPaginate) {
    dirtyFiles = await db.query.ifile.findMany({
      where: conditions,
      with: { tags: { with: { tag: true } } },
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    const [{ count: _count }] = await db
      .select({ count: count() })
      .from(schema.ifile)
      .where(conditions);

    result.page = page;
    result.pages = Math.ceil(_count / pageSize);
  } else {
    dirtyFiles = await db.query.ifile.findMany({
      where: conditions,
      with: { tags: { with: { tag: true } } },
    });
  }

  result.files = dirtyFiles.map(file => ({
    ...file,
    tags: file.tags.map(tag => tag.tag),
  }));

  return result;
}

export const getFilesCached = cache(getFiles, ['FILE_LIST'], {
  tags: [TAGS.FILES],
});

export async function createFile(
  file: typeof schema.ifile.$inferInsert,
  baseURL: string | URL,
  tags: string[] = [],
) {
  const res = await db.transaction(async client => {
    const [created] = await client
      .insert(schema.ifile)
      .values(file)
      .returning();

    if (tags?.length) {
      await client
        .insert(schema.ifileToTag)
        .values(tags.map(tagId => ({ a: created.id, b: tagId })))
        .onConflictDoNothing();
    }

    await client
      .update(schema.ifile)
      .set({ url: new URL(created.id, baseURL).toString() })
      .where(eq(schema.ifile.id, created.id));

    return created;
  });

  revalidateTag(TAGS.FILES);

  return res;
}

export async function deleteFile(id: IFile['id']) {
  const [file] = await db
    .select()
    .from(schema.ifile)
    .where(eq(schema.ifile.id, id))
    .limit(1);

  if (!file) throw new Error('File not found');

  await db.delete(schema.ifile).where(eq(schema.ifile.id, id));

  revalidateTag(TAGS.FILES);
}
