/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { HydratedDocument, Model, Schema } from 'mongoose';

export interface IFile {
  name: string;
  description?: string;
  url: string;
}

export type HydratedFile = HydratedDocument<IFile>;

export type FileSchemaType = Schema<
  IFile,
  Model<IFile, any, any, any, any>,
  {},
  {},
  any,
  {},
  'type',
  IFile
>;

export type FileModelType = Model<IFile, {}, {}, {}, FileSchemaType>;

export interface IFileReturn {
  files: HydratedFile[];
  page?: number;
  pages?: number;
}
