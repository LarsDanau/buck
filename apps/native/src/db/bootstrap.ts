import { eq } from "drizzle-orm";
import { categories, defaultCategories, metadata } from "@buck/db";

import { db } from "@/db/client";
import type { BuckDb } from "@/db/client";

const DEFAULT_CATEGORIES_SEEDED_KEY = "default_categories_seeded_at";
let bootstrapPromise: Promise<void> | null = null;

/**
 * Runs one-time bootstrap work after migrations complete.
 *
 * The metadata check and inserts share one transaction so the seed marker
 * cannot be written unless the default categories were inserted successfully.
 */
export async function ensureDatabaseBootstrapped(database: BuckDb) {
  await database.transaction(async (tx) => {
    // The metadata row is the single source of truth for whether seeding already ran.
    const metadataRow = await tx.query.metadata.findFirst({
      where: eq(metadata.key, DEFAULT_CATEGORIES_SEEDED_KEY),
    });

    if (metadataRow) {
      return;
    }

    // Default categories are product bootstrap data, not schema-level migration data.
    await tx
      .insert(categories)
      .values(defaultCategories)
      .onConflictDoNothing({
        target: [categories.kind, categories.name],
      });

    await tx.insert(metadata).values({
      key: DEFAULT_CATEGORIES_SEEDED_KEY,
      value: new Date().toISOString(),
    });
  });
}

/**
 * Returns the one in-flight bootstrap operation for the app runtime.
 *
 * Migrations run first via `useMigrations()`. After they succeed, the provider
 * suspends on this promise so bootstrap data is inserted exactly once without a
 * custom effect.
 */
export function bootstrapDatabase(): Promise<void> {
  if (!bootstrapPromise) {
    // Reuse one in-flight bootstrap so concurrent renders do not seed twice.
    bootstrapPromise = ensureDatabaseBootstrapped(db).catch((error) => {
      bootstrapPromise = null;
      throw error;
    });
  }

  return bootstrapPromise;
}
