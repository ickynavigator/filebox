import { HydratedDocument } from 'mongoose';

export interface IFile {
  name: string;
  description?: string;
  url: string;
}

export type HydratedFile = HydratedDocument<IFile>;

export interface IFileReturn {
  files: HydratedFile[];
  page?: number;
  pages?: number;
}
