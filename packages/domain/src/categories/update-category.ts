import { CATEGORY_EMOJI_REQUIRED, CATEGORY_NAME_REQUIRED, CATEGORY_NOT_FOUND } from "./error-codes";
import { ValidationError } from "../shared/errors";
import type { CategoryCommandRepository } from "./category-repository";

export interface UpdateCategoryCommand {
  readonly id: number;
  readonly name: string;
  readonly kind: "income" | "expense";
  readonly emoji: string;
  readonly color?: string | null;
}

/**
 * Validates and updates an existing category through the category command repository.
 *
 * @param repository Category write adapter used by the domain layer.
 * @param input Updated category values from the app layer.
 * @returns Updated category from the repository.
 */
export async function updateCategory(
  repository: CategoryCommandRepository,
  input: UpdateCategoryCommand,
) {
  if (!Number.isInteger(input.id) || input.id <= 0) {
    throw new ValidationError(CATEGORY_NOT_FOUND, "Category does not exist.");
  }

  const name = input.name.trim();
  const emoji = input.emoji.trim();

  if (!name) {
    throw new ValidationError(CATEGORY_NAME_REQUIRED, "Category name is required.");
  }

  if (!emoji) {
    throw new ValidationError(CATEGORY_EMOJI_REQUIRED, "Category emoji is required.");
  }

  return repository.update({
    id: input.id,
    name,
    kind: input.kind,
    emoji,
    color: input.color ?? null,
  });
}
