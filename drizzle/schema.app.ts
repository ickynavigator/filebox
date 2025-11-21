import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const ifile = sqliteTable('IFile', {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  description: text(),
  name: text().notNull(),
  url: text().notNull(),
  size: integer(),
  updatedAt: integer({ mode: 'timestamp' })
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: integer({ mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  expiresAt: integer({ mode: 'timestamp' }),
});

export const tag = sqliteTable('Tag', {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  name: text().notNull(),
  updatedAt: integer({ mode: 'timestamp' })
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: integer({ mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const ifileToTag = sqliteTable(
  '_IFileToTag',
  {
    a: text('A')
      .notNull()
      .references(() => ifile.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    b: text('B')
      .notNull()
      .references(() => tag.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  },
  table => [
    index('_IFileToTag_B_index').on(table.b),
    uniqueIndex('_IFileToTag_AB_unique').on(table.a, table.b),
  ],
);

export const iFileRelations = relations(ifile, ({ many }) => ({
  tags: many(ifileToTag),
}));

export const tagRelations = relations(tag, ({ many }) => ({
  files: many(ifileToTag),
}));

export const iFileToTagRelations = relations(ifileToTag, ({ one }) => ({
  file: one(ifile, {
    fields: [ifileToTag.a],
    references: [ifile.id],
  }),
  tag: one(tag, {
    fields: [ifileToTag.b],
    references: [tag.id],
  }),
}));
