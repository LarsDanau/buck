import { describe, expect, it, jest } from "@jest/globals";
import type { BuckDatabase } from "@buck/db/database";
import type { Metadata } from "@buck/db/schema";
import { categories, metadata } from "@buck/db/schema";

import { bootstrapDatabase, ensureDatabaseBootstrapped } from "./bootstrap";

type MockFunction = ReturnType<typeof jest.fn>;
type TransactionCallback<T> = (tx: never) => T;

function createDatabaseMock({
  metadataRow = null,
}: {
  readonly metadataRow?: Pick<Metadata, "key" | "value" | "updatedAt"> | null;
} = {}): {
  readonly database: BuckDatabase;
  readonly findFirst: MockFunction;
  readonly insert: MockFunction;
  readonly insertCategoryValues: MockFunction;
  readonly insertMetadataValues: MockFunction;
  readonly onConflictDoNothing: MockFunction;
} {
  const onConflictDoNothing = jest.fn(async () => null);
  const insertCategoryValues = jest.fn(() => ({
    onConflictDoNothing,
  }));
  const insertMetadataValues = jest.fn(async () => null);
  const insert = jest.fn((table) => {
    if (table === categories) {
      return {
        values: insertCategoryValues,
      };
    }

    if (table === metadata) {
      return {
        values: insertMetadataValues,
      };
    }

    throw new Error("Unexpected table insert.");
  });
  const findFirst = jest.fn(async () => metadataRow);
  const transaction: BuckDatabase["transaction"] = <T>(callback: TransactionCallback<T>) =>
    callback({
      insert,
      query: {
        metadata: {
          findFirst,
        },
      },
    } as never);

  return {
    database: {
      transaction,
    } as unknown as BuckDatabase,
    findFirst,
    insert,
    insertCategoryValues,
    insertMetadataValues,
    onConflictDoNothing,
  };
}

describe("ensureDatabaseBootstrapped", () => {
  it("seeds default categories and metadata when the marker is missing", async () => {
    const {
      database,
      findFirst,
      insert,
      insertCategoryValues,
      insertMetadataValues,
      onConflictDoNothing,
    } = createDatabaseMock();

    await ensureDatabaseBootstrapped(database);

    expect(findFirst).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledTimes(2);
    expect(insertCategoryValues).toHaveBeenCalledTimes(1);
    expect(onConflictDoNothing).toHaveBeenCalledWith({
      target: [categories.kind, categories.name],
    });
    expect(insertMetadataValues).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "default_categories_seeded_at",
      }),
    );
  });

  it("skips inserts when the bootstrap marker already exists", async () => {
    const { database, findFirst, insert } = createDatabaseMock({
      metadataRow: {
        key: "default_categories_seeded_at",
        value: "2026-01-01T00:00:00.000Z",
        updatedAt: new Date(),
      } as const,
    });

    await ensureDatabaseBootstrapped(database);

    expect(findFirst).toHaveBeenCalledTimes(1);
    expect(insert).not.toHaveBeenCalled();
  });
});

describe("bootstrapDatabase", () => {
  it("reuses the in-flight bootstrap promise for the same database", async () => {
    const bootstrapResolver: { current: null | (() => void) } = {
      current: null,
    };
    const deferredPromise = new Promise<void>((resolve) => {
      bootstrapResolver.current = resolve;
    });
    const transaction: BuckDatabase["transaction"] = <T>(_callback: TransactionCallback<T>) =>
      deferredPromise as T;
    const database = {
      transaction,
    } as unknown as BuckDatabase;

    const firstBootstrap = bootstrapDatabase(database);
    const secondBootstrap = bootstrapDatabase(database);

    expect(firstBootstrap).toBe(secondBootstrap);

    if (!bootstrapResolver.current) {
      throw new Error("Bootstrap resolver was not initialized.");
    }

    bootstrapResolver.current();

    await expect(firstBootstrap).resolves.toBeUndefined();
  });
});
