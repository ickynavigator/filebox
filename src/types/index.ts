import { IFile, Tag } from '@prisma/client';
import { z } from 'zod';

export enum Auth {
  Authorized = 0,
  Unauthorized = 1,
}

export type BaseFile = Pick<IFile, 'name' | 'size' | 'description' | 'url'>;

export interface IFileReturn {
  files: Array<IFile & { tags: Tag[] }>;
  page?: number;
  pages?: number;
}

export const timeSchema = z.object({
  updatedAt: z.date(),
  createdAt: z.date(),
});

export const tagSchema = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .merge(timeSchema);

export const iFileSchema = z
  .object({
    id: z.string().optional(),
    description: z.string().optional(),
    name: z.string(),
    url: z.string(),
    size: z.number().optional(),

    tags: z.array(tagSchema).default([]),
  })
  .merge(timeSchema);

export const isIFile = (value: unknown): value is IFile =>
  iFileSchema.safeParse(value).success;
