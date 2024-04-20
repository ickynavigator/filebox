import prisma from '~/lib/prisma';
import type { IFile } from '@prisma/client';
import type { BaseFile, IFileReturn } from '~/types';
import { unstable_cache as cache, revalidateTag } from 'next/cache';
import { TAGS } from '~/lib/constants';

interface GetFilesOptions {
  pageSize?: number;
  page?: number;
  noPaginate?: boolean;
  param?: string;
  keyword?: string | null;
}
export async function getFiles(options: GetFilesOptions) {
  const {
    pageSize = 10,
    page = 1,
    noPaginate = false,
    param = '',
    keyword = null,
  } = options;

  type KeyWord = { [k: string]: { contains: string } };
  const keywords: { OR?: KeyWord[] } = {};

  if (keyword) {
    const kwSearch = { contains: keyword };

    keywords.OR = [
      { id: kwSearch },
      { name: kwSearch },
      { description: kwSearch },
      { url: kwSearch },
    ];

    const specificQuery: { [k: string]: typeof kwSearch } = {};

    if (param) {
      specificQuery[param] = kwSearch;
      keywords.OR.push({ ...specificQuery });
    }
  }

  const result: IFileReturn = { files: [] };

  if (noPaginate) {
    result.files = await prisma.iFile.findMany({
      take: pageSize,
      skip: pageSize * (page - 1),
      where: { ...keywords },
      include: { tags: true },
    });

    const count = await prisma.iFile.count({ where: { ...keywords } });

    result.page = page;
    result.pages = Math.ceil(count / pageSize);
  } else {
    result.files = await prisma.iFile.findMany({
      where: { OR: keywords.OR },
      include: { tags: true },
    });
  }

  return result;
}

export const getFilesCached = cache(getFiles, ['FILE_LIST'], {
  tags: [TAGS.FILES],
});

export async function createFile(
  file: BaseFile,
  baseURL: string,
  tags: string[] = [],
) {
  const createdFile = await prisma.iFile.create({
    data: { ...file, tags: { connect: tags.map(tagId => ({ id: tagId })) } },
  });

  const res = prisma.iFile.update({
    where: { id: createdFile.id },
    data: { url: `${baseURL}${createdFile.id}` },
  });

  revalidateTag(TAGS.FILES);

  return res;
}

export async function deleteFile(id: IFile['id']) {
  const file = await prisma.iFile.findUnique({ where: { id } });

  if (!file) throw new Error('File not found');

  await prisma.iFile.delete({ where: { id } });

  revalidateTag(TAGS.FILES);
}
