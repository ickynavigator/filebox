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

export async function createTag(name: Tag['name']) {
  return prisma.tag.create({ data: { name } });
}

export async function deleteTag(id: Tag['id']) {
  return prisma.tag.delete({ where: { id } });
}
