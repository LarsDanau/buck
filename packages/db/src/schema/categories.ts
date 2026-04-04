import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import {
  sqliteTimestampMs,
  sqliteUpdatedAt,
  transactionKindValues,
} from "./shared";

export const categories = sqliteTable(
  "categories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    kind: text("kind", { enum: transactionKindValues }).notNull(),
    emoji: text("emoji").notNull(),
    color: text("color"),
    sortOrder: integer("sort_order").notNull().default(0),
    isArchived: integer("is_archived", { mode: "boolean" })
      .default(false)
      .notNull(),
    createdAt: sqliteTimestampMs("created_at"),
    updatedAt: sqliteUpdatedAt("updated_at"),
  },
  (table) => [
    uniqueIndex("categories_kind_name_unique").on(table.kind, table.name),
  ],
);

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
