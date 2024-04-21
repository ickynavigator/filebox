import { IFile, Tag } from '@prisma/client';

export type BaseFile = BetterOmit<IFile, 'id' | 'createdAt' | 'updatedAt'>;

export interface IFileReturn {
  files: Array<IFile & { tags: Tag[] }>;
  page?: number;
  pages?: number;
}
