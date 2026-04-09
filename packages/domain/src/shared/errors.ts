import type { CategoryErrorCode } from "../categories/error-codes";
import type { SharedErrorCode } from "./error-codes";
export * from "./error-codes";

export type AppErrorCode = CategoryErrorCode | SharedErrorCode;

interface AppErrorOptions {
  readonly cause?: unknown;
}

/**
 * Base error for domain and application failures.
 */
export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(code: AppErrorCode, message: string, options?: AppErrorOptions) {
    super(message, options);
    this.code = code;
    this.name = new.target.name;
  }
}

/**
 * Error thrown when user input is invalid.
 */
export class ValidationError extends AppError {}

/**
 * Error thrown when a write conflicts with existing data.
 */
export class ConflictError extends AppError {}

/**
 * Error thrown when database work fails unexpectedly.
 */
export class DatabaseError extends AppError {}

/**
 * Checks whether an unknown error is one of Buck's typed app errors.
 *
 * @param error Unknown thrown value.
 * @returns True when the error is a typed app error.
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
