import { DrizzleCategoryRepository } from "@buck/db/repositories";

import { db } from "@/db/client";

/**
 * Returns the shared category command repository for the native app runtime.
 */
export function getCategoryCommandRepository() {
  return new DrizzleCategoryRepository(db);
}
