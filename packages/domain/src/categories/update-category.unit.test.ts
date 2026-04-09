import { describe, expect, it } from "bun:test";

import type { Category } from "./category";
import type { CategoryCommandRepository, UpdateCategoryInput } from "./category-repository";
import { CATEGORY_EMOJI_REQUIRED, CATEGORY_NAME_REQUIRED, CATEGORY_NOT_FOUND } from "./error-codes";
import { updateCategory } from "./update-category";
const updatedCategory = {
  id: 4,
  name: "Salary",
  kind: "income" as const,
  emoji: "💰",
  color: "#22c55e",
  sortOrder: 3,
  isArchived: false,
} satisfies Category;

function createRepositoryStub(
  overrides?: Partial<CategoryCommandRepository>,
): CategoryCommandRepository {
  return {
    create: async () => updatedCategory,
    update: async () => updatedCategory,
    archive: async () => updatedCategory,
    restore: async () => updatedCategory,
    ...overrides,
  };
}

describe("updateCategory", () => {
  it("trims fields before calling the repository", async () => {
    let receivedInput: UpdateCategoryInput | null = null;
    const repository = createRepositoryStub({
      update: async (input) => {
        receivedInput = input;
        return updatedCategory;
      },
    });

    await updateCategory(repository, {
      id: 4,
      name: "  Salary ",
      kind: "income",
      emoji: " 💰 ",
      color: undefined,
    });

    expect(receivedInput).toEqual({
      id: 4,
      name: "Salary",
      kind: "income",
      emoji: "💰",
      color: null,
    });
  });

  it("throws when the category id is invalid", async () => {
    await expect(
      updateCategory(createRepositoryStub(), {
        id: 0,
        name: "Salary",
        kind: "income",
        emoji: "💰",
        color: null,
      }),
    ).rejects.toMatchObject({
      code: CATEGORY_NOT_FOUND,
    });
  });

  it("throws when the name is empty", async () => {
    await expect(
      updateCategory(createRepositoryStub(), {
        id: 4,
        name: "   ",
        kind: "income",
        emoji: "💰",
        color: null,
      }),
    ).rejects.toMatchObject({
      code: CATEGORY_NAME_REQUIRED,
    });
  });

  it("throws when the emoji is empty", async () => {
    await expect(
      updateCategory(createRepositoryStub(), {
        id: 4,
        name: "Salary",
        kind: "income",
        emoji: "   ",
        color: null,
      }),
    ).rejects.toMatchObject({
      code: CATEGORY_EMOJI_REQUIRED,
    });
  });
});
