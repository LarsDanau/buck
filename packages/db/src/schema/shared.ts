import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";

export const transactionKindValues = ["income", "expense"] as const;

export const sqliteTimestampMs = (name: string) =>
  integer(name, { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`);

export const sqliteUpdatedAt = (name: string) =>
  integer(name, { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`)
    .$onUpdate(() => new Date());
