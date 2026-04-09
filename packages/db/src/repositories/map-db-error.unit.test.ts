import { describe, expect, it } from "bun:test";

import { CATEGORY_NAME_DUPLICATE } from "@buck/domain/categories";
import { ConflictError, DB_WRITE_FAILED, DatabaseError } from "@buck/domain/errors";

import { mapCategoryWriteError } from "./map-db-error";

describe("mapCategoryWriteError", () => {
  it("maps SQLite unique constraint codes to a conflict error", () => {
    const error = mapCategoryWriteError(
      Object.assign(new Error("constraint failed"), {
        code: "SQLITE_CONSTRAINT_UNIQUE",
      }),
    );

    expect(error instanceof ConflictError).toBe(true);
    expect((error as ConflictError).code).toBe(CATEGORY_NAME_DUPLICATE);
  });

  it("maps SQLite unique constraint errno values to a conflict error", () => {
    const error = mapCategoryWriteError(
      Object.assign(new Error("UNIQUE constraint failed: categories.kind, categories.name"), {
        errno: 2067,
      }),
    );

    expect(error instanceof ConflictError).toBe(true);
    expect((error as ConflictError).code).toBe(CATEGORY_NAME_DUPLICATE);
  });

  it("maps unknown write failures to a database error", () => {
    const error = mapCategoryWriteError(new Error("boom"));

    expect(error instanceof DatabaseError).toBe(true);
    expect((error as DatabaseError).code).toBe(DB_WRITE_FAILED);
  });
});
