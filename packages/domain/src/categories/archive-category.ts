import { CATEGORY_NOT_FOUND } from "./error-codes";
import { ValidationError } from "../shared/errors";
import type { CategoryCommandRepository } from "./category-repository";

/**
 * Archives a category through the category command repository.
 *
 * @param repository Category write adapter used by the domain layer.
 * @param id Category identifier.
 * @returns Archived category from the repository.
 */
export async function archiveCategory(repository: CategoryCommandRepository, id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError(CATEGORY_NOT_FOUND, "Category does not exist.");
  }

  return repository.archive(id);
}
