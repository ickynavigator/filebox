'use server';

import prisma from '~/lib/prisma';
import { unstable_cache as cache, revalidateTag } from 'next/cache';
import { TAGS } from '~/lib/constants';
import type { Tag } from '@prisma/client';

interface GetTagsOpts {
  query?: Tag['name'];
}

export async function getTags(opts?: GetTagsOpts) {
  const { query } = opts || {};

  return prisma.tag.findMany({
    where: { name: { contains: query } },
  });
}

export const getTagsCached = cache(getTags, ['tags'], {
  tags: [TAGS.TAGS],
});

export async function createBatchTags(names: Tag['name'][]) {
  if (!names.length || names.length === 0) {
    return [];
  }

  const res = await prisma.$transaction(
    names.map(name => prisma.tag.create({ data: { name } })),
  );

  revalidateTag(TAGS.TAGS);

  return res;
}
