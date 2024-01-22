import prisma from '~/lib/prisma';
import { BaseFile, IFile, IFileReturn } from '~/types';

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
    });

    const count = await prisma.iFile.count({ where: { ...keywords } });

    result.page = page;
    result.pages = Math.ceil(count / pageSize);
  } else {
    result.files = await prisma.iFile.findMany({ where: { OR: keywords.OR } });
  }

  return result;
}

export async function createFile(file: BaseFile) {
  return await prisma.iFile.create({ data: file });
}

export async function getFile(id: IFile['id']) {
  const file = await prisma.iFile.findUnique({ where: { id } });

  if (!file) throw new Error('File not found');

  return file;
}

export async function updateFile(id: IFile['id'], data: Partial<IFile>) {
  const file = await prisma.iFile.findUnique({ where: { id } });

  if (!file) throw new Error('File not found');

  const updatedFile = await prisma.iFile.update({ where: { id }, data });

  return updatedFile;
}

export async function deleteFile(id: IFile['id']) {
  const file = await prisma.iFile.findUnique({ where: { id } });

  if (!file) throw new Error('File not found');

  await prisma.iFile.delete({ where: { id } });
}
