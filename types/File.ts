import { IFile } from '@prisma/client';

export interface IFileReturn {
  files: IFile[];
  page?: number;
  pages?: number;
}

export const isIFile = (value: unknown): value is IFile => {
  const file = value as IFile;

  return (
    typeof file.name === 'string' &&
    typeof file.description === 'string' &&
    typeof file.url === 'string' &&
    typeof file.size === 'number'
  );
};
