import { isAppError } from "@buck/domain/errors";
import type { TFunction } from "i18next";

/**
 * Maps a thrown category error to a localized user-facing message.
 *
 * @param tCategories Categories namespace translation function.
 * @param tCommon Common namespace translation function.
 * @param error Unknown mutation or query error.
 * @returns Localized message for the error.
 */
export function getCategoryErrorMessage(
  tCategories: TFunction<"categories">,
  tCommon: TFunction<"common">,
  error: unknown,
) {
  if (isAppError(error)) {
    switch (error.code) {
      case "CATEGORY_EMOJI_REQUIRED":
        return tCategories(($) => $.errors.categoryEmojiRequired);
      case "CATEGORY_NAME_DUPLICATE":
        return tCategories(($) => $.errors.categoryNameDuplicate);
      case "CATEGORY_NAME_REQUIRED":
        return tCategories(($) => $.errors.categoryNameRequired);
      case "CATEGORY_NOT_FOUND":
        return tCategories(($) => $.errors.categoryNotFound);
      case "DB_WRITE_FAILED":
        return tCategories(($) => $.errors.dbWriteFailed);
      default:
        return tCommon(($) => $.errors.unknown);
    }
  }

  return tCommon(($) => $.errors.unknown);
}
