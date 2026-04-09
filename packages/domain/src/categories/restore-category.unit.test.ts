import { describe, expect, it } from "bun:test";

import type { Category } from "./category";
import type { CategoryCommandRepository } from "./category-repository";
import { CATEGORY_NOT_FOUND } from "./error-codes";
import { restoreCategory } from "./restore-category";
const restoredCategory = {
  id: 2,
  name: "Dining",
  kind: "expense" as const,
  emoji: "🍽️",
  color: "#f97316",
  sortOrder: 1,
  isArchived: false,
} satisfies Category;

function createRepositoryStub(
  overrides?: Partial<CategoryCommandRepository>,
): CategoryCommandRepository {
  return {
    create: async () => restoredCategory,
    update: async () => restoredCategory,
    archive: async () => restoredCategory,
    restore: async () => restoredCategory,
    ...overrides,
  };
}

describe("restoreCategory", () => {
  it("forwards the category id to the repository", async () => {
    let receivedId: number | null = null;
    const repository = createRepositoryStub({
      restore: async (id) => {
        receivedId = id;
        return restoredCategory;
      },
    });

    await restoreCategory(repository, 2);

    expect(receivedId).toBe(2);
  });

  it("throws when the category id is invalid", async () => {
    await expect(restoreCategory(createRepositoryStub(), 0)).rejects.toMatchObject({
      code: CATEGORY_NOT_FOUND,
    });
  });
});
