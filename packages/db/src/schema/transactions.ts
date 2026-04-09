import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { categories } from "./categories";
import { sqliteTimestampMs, sqliteUpdatedAt, transactionKindValues } from "./shared";

export const transactions = sqliteTable(
  "transactions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    amountMinor: integer("amount_minor").notNull(),
    currencyCode: text("currency_code").notNull(),

    kind: text("kind", { enum: transactionKindValues }).notNull(),

    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),

    note: text("note"),
    occurredAt: sqliteTimestampMs("occurred_at"),

    effectiveDate: text("effective_date").notNull(),

    createdAt: sqliteTimestampMs("created_at"),
    updatedAt: sqliteUpdatedAt("updated_at"),
  },
  (table) => [
    index("transactions_category_id_idx").on(table.categoryId),
    index("transactions_kind_idx").on(table.kind),
    index("transactions_occurred_at_idx").on(table.occurredAt),
    index("transactions_effective_date_idx").on(table.effectiveDate),
  ],
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;
