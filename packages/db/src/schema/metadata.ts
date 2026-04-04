import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { sqliteUpdatedAt } from "./shared";

/**
 * Internal key-value records that track database lifecycle state.
 */
export const metadata = sqliteTable("metadata", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: sqliteUpdatedAt("updated_at"),
});

export type Metadata = typeof metadata.$inferSelect;
export type InsertMetadata = typeof metadata.$inferInsert;
