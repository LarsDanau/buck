import { eq } from "drizzle-orm";
import type { BuckDatabase } from "@buck/db/database";
import { defaultCategories } from "@buck/db/seed";
import { categories, metadata } from "@buck/db/schema";

const DEFAULT_CATEGORIES_SEEDED_KEY = "default_categories_seeded_at";
const bootstrapPromises = new WeakMap<BuckDatabase, Promise<void>>();

/**
 * Runs one-time bootstrap work after migrations complete.
 *
 * The metadata check and inserts share one transaction so the seed marker
 * cannot be written unless the default categories were inserted successfully.
 */
export async function ensureDatabaseBootstrapped(database: BuckDatabase) {
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
 * Returns the one in-flight bootstrap operation for a specific database
 * instance.
 *
 * Migrations run first via `useMigrations()`. After they succeed, the provider
 * suspends on this promise so bootstrap data is inserted exactly once without a
 * custom effect.
 */
export function bootstrapDatabase(database: BuckDatabase): Promise<void> {
  const inFlightBootstrap = bootstrapPromises.get(database);

  if (inFlightBootstrap) {
    return inFlightBootstrap;
  }

  const bootstrapPromise = ensureDatabaseBootstrapped(database).catch((error) => {
    bootstrapPromises.delete(database);
    throw error;
  });

  bootstrapPromises.set(database, bootstrapPromise);

  return bootstrapPromise;
}
