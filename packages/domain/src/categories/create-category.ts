import { CATEGORY_EMOJI_REQUIRED, CATEGORY_NAME_REQUIRED } from "./error-codes";
import { ValidationError } from "../shared/errors";
import type { CategoryCommandRepository } from "./category-repository";

export interface CreateCategoryCommand {
  readonly name: string;
  readonly kind: "income" | "expense";
  readonly emoji: string;
  readonly color?: string | null;
}

/**
 * Validates and creates a category through the category command repository.
 *
 * @param repository Category write adapter used by the domain layer.
 * @param input New category values from the app layer.
 * @returns Created category from the repository.
 */
export async function createCategory(
  repository: CategoryCommandRepository,
  input: CreateCategoryCommand,
) {
  const name = input.name.trim();
  const emoji = input.emoji.trim();

  if (!name) {
    throw new ValidationError(CATEGORY_NAME_REQUIRED, "Category name is required.");
  }

  if (!emoji) {
    throw new ValidationError(CATEGORY_EMOJI_REQUIRED, "Category emoji is required.");
  }

  return repository.create({
    name,
    kind: input.kind,
    emoji,
    color: input.color ?? null,
  });
}
