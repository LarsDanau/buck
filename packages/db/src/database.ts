import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";

import { categories, metadata, transactions } from "./schema";

/**
 * Shared Drizzle schema used by the native runtime client and shared DB helpers.
 */
export const schema = {
  categories,
  metadata,
  transactions,
};

export type BuckSchema = typeof schema;
export type BuckRelationalSchema = ExtractTablesWithRelations<BuckSchema>;
export type BuckDatabase = BaseSQLiteDatabase<"sync", unknown, BuckSchema, BuckRelationalSchema>;
