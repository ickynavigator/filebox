import type * as schema from '~/drizzle/schema';

export type IFile = typeof schema.ifile.$inferSelect;
export type Tag = typeof schema.tag.$inferSelect;

export type IFileReturn = {
  files: (IFile & { tags: Tag[] })[];
} & (
  | { noPaginate: false; page?: number; pages?: number }
  | { noPaginate: true; page?: never; pages?: never }
);
