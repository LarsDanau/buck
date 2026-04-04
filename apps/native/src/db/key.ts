import type { SecureStoreOptions } from "expo-secure-store";
import { getItem, setItem, WHEN_UNLOCKED_THIS_DEVICE_ONLY } from "expo-secure-store";
import { getRandomBytes } from "expo-crypto";

const DATABASE_KEY_NAME = "buck.db.key";
const DATABASE_KEY_PATTERN = /^[\da-f]{64}$/i;

const secureStoreOptions: SecureStoreOptions = {
  keychainAccessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

const bytesToHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

function assertValidDatabaseKey(keyHex: string): void {
  if (!DATABASE_KEY_PATTERN.test(keyHex)) {
    throw new Error("Database key has an invalid format.");
  }
}

/**
 * Returns the single SQLCipher key used by Buck's local database.
 *
 * The key is generated once, persisted in SecureStore, and then read
 * synchronously so the SQLite client can be created at module load time.
 *
 * @returns Hex-encoded 32-byte SQLCipher key.
 */
export function getOrCreateDatabaseKey(): string {
  const existingKey = getItem(DATABASE_KEY_NAME, secureStoreOptions);
  if (existingKey) {
    assertValidDatabaseKey(existingKey);
    return existingKey;
  }

  const keyBytes = getRandomBytes(32);
  const keyHex = bytesToHex(keyBytes);
  assertValidDatabaseKey(keyHex);

  setItem(DATABASE_KEY_NAME, keyHex, secureStoreOptions);

  return keyHex;
}
