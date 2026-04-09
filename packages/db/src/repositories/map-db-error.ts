import { CATEGORY_NAME_DUPLICATE } from "@buck/domain/categories";
import { ConflictError, DB_WRITE_FAILED, DatabaseError } from "@buck/domain/errors";

const SQLITE_CONSTRAINT_ERROR_CODES = new Set(["SQLITE_CONSTRAINT", "SQLITE_CONSTRAINT_UNIQUE"]);
const SQLITE_CONSTRAINT_ERRNOS = new Set([19, 2067]);
const UNIQUE_CONSTRAINT_MESSAGES = [
  "categories_kind_name_unique",
  "UNIQUE constraint failed: categories.kind, categories.name",
] as const;

interface SqliteConstraintError {
  readonly code?: string;
  readonly errno?: number;
  readonly message: string;
}

function isSqliteConstraintError(error: unknown): error is SqliteConstraintError {
  return error instanceof Error;
}

function isUniqueConstraintViolation(error: unknown): boolean {
  if (!isSqliteConstraintError(error)) {
    return false;
  }

  if (error.code && SQLITE_CONSTRAINT_ERROR_CODES.has(error.code)) {
    return true;
  }

  if (typeof error.errno === "number" && SQLITE_CONSTRAINT_ERRNOS.has(error.errno)) {
    return true;
  }

  return UNIQUE_CONSTRAINT_MESSAGES.some((messageFragment) =>
    error.message.includes(messageFragment),
  );
}

/**
 * Maps raw SQLite or Drizzle write failures into stable app errors.
 *
 * @param error Unknown database error.
 * @returns Typed app error with a stable reusable code.
 */
export function mapCategoryWriteError(error: unknown): Error {
  if (isUniqueConstraintViolation(error)) {
    return new ConflictError(
      CATEGORY_NAME_DUPLICATE,
      "Category name already exists for this kind.",
      { cause: error },
    );
  }

  return new DatabaseError(DB_WRITE_FAILED, "Failed to write category data.", { cause: error });
}
