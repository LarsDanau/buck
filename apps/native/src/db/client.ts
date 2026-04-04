import type { SQLiteDatabase } from "expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { categories, metadata, transactions } from "@buck/db";
import { getOrCreateDatabaseKey } from "@/db/key";

const DATABASE_NAME = "buck.db";
const VERIFY_DATABASE_QUERY = "SELECT count(*) AS count FROM sqlite_master";

/**
 * Applies Buck's connection-level SQLite settings to an already-open database.
 *
 * @param sqlite Open SQLite connection.
 * @param keyHex Hex-encoded SQLCipher key.
 */
function configureDatabase(sqlite: SQLiteDatabase, keyHex: string): void {
  // SQLCipher must be configured before the first schema read or write.
  sqlite.execSync(`
    -- Unlock the encrypted database with Buck's persisted key.
    PRAGMA key = "x'${keyHex}'";
    -- Keep SQLite relational constraints enabled for all app queries.
    PRAGMA foreign_keys = ON;
  `);

  // Force an early schema read so an invalid key fails during startup.
  sqlite.getFirstSync<{ readonly count: number }>(VERIFY_DATABASE_QUERY);
}

/**
 * Opens a fresh SQLite handle for the shared Buck database file.
 *
 * @returns Open SQLite database handle.
 */
function openBuckDatabase(): SQLiteDatabase {
  return openDatabaseSync(DATABASE_NAME, {
    enableChangeListener: true,
  });
}

/**
 * Opens and keys the one Buck SQLite connection for the app runtime.
 *
 * The SQLCipher key must be applied before any schema read or write, so the
 * connection is prepared immediately after opening and before the Drizzle
 * client is created.
 *
 * @returns Ready-to-use SQLite database handle.
 */
function createDatabase(): SQLiteDatabase {
  const keyHex = getOrCreateDatabaseKey();
  const sqlite = openBuckDatabase();
  configureDatabase(sqlite, keyHex);
  return sqlite;
}

function createDrizzleClient(sqlite: SQLiteDatabase) {
  // Register the schema once so every import of `db` gets typed queries.
  return drizzle(sqlite, {
    schema: {
      categories,
      metadata,
      transactions,
    },
  });
}

export type BuckDb = ReturnType<typeof createDrizzleClient>;

export interface BuckDatabaseClient {
  readonly sqlite: SQLiteDatabase;
  readonly db: BuckDb;
}

/**
 * Single SQLite connection shared by the whole native app runtime.
 */
export const buckDb = createDatabase();

/**
 * Single typed Drizzle client shared by the whole native app runtime.
 */
export const db = createDrizzleClient(buckDb);

/**
 * Combined runtime database client exported for places that need both layers.
 */
export const databaseClient: BuckDatabaseClient = {
  sqlite: buckDb,
  db,
};
