'use server';

import prisma from '~/lib/prisma';
import { unstable_cache as cache } from 'next/cache';
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
  const res = await prisma.$transaction(
    names.map(name => prisma.tag.create({ data: { name } })),
  );

  return res;
}
