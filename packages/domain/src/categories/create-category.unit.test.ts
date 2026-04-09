import { describe, expect, it } from "bun:test";

import type { Category } from "./category";
import type { CategoryCommandRepository, CreateCategoryInput } from "./category-repository";
import { CATEGORY_EMOJI_REQUIRED, CATEGORY_NAME_REQUIRED } from "./error-codes";
import { createCategory } from "./create-category";

const createdCategory = {
  id: 1,
  name: "Groceries",
  kind: "expense" as const,
  emoji: "🛒",
  color: null,
  sortOrder: 0,
  isArchived: false,
} satisfies Category;

function createRepositoryStub(
  overrides?: Partial<CategoryCommandRepository>,
): CategoryCommandRepository {
  return {
    create: async () => createdCategory,
    update: async () => createdCategory,
    archive: async () => createdCategory,
    restore: async () => createdCategory,
    ...overrides,
  };
}

describe("createCategory", () => {
  it("trims fields before calling the repository", async () => {
    let receivedInput: CreateCategoryInput | null = null;
    const repository = createRepositoryStub({
      create: async (input) => {
        receivedInput = input;
        return createdCategory;
      },
    });

    await createCategory(repository, {
      name: "  Groceries  ",
      kind: "expense",
      emoji: "  🛒  ",
      color: undefined,
    });

    expect(receivedInput).toEqual({
      name: "Groceries",
      kind: "expense",
      emoji: "🛒",
      color: null,
    });
  });

  it("throws a validation error when the name is empty", async () => {
    const repository = createRepositoryStub();

    await expect(
      createCategory(repository, {
        name: "   ",
        kind: "expense",
        emoji: "🛒",
        color: null,
      }),
    ).rejects.toMatchObject({
      code: CATEGORY_NAME_REQUIRED,
    });
  });

  it("throws a validation error when the emoji is empty", async () => {
    const repository = createRepositoryStub();

    await expect(
      createCategory(repository, {
        name: "Groceries",
        kind: "expense",
        emoji: "   ",
        color: null,
      }),
    ).rejects.toMatchObject({
      code: CATEGORY_EMOJI_REQUIRED,
    });
  });
});
