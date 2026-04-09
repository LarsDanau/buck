import { describe, expect, it } from "bun:test";

import type { Category } from "./category";
import type { CategoryCommandRepository } from "./category-repository";
import { CATEGORY_NOT_FOUND } from "./error-codes";
import { archiveCategory } from "./archive-category";
const archivedCategory = {
  id: 2,
  name: "Dining",
  kind: "expense" as const,
  emoji: "🍽️",
  color: "#f97316",
  sortOrder: 1,
  isArchived: true,
} satisfies Category;

function createRepositoryStub(
  overrides?: Partial<CategoryCommandRepository>,
): CategoryCommandRepository {
  return {
    create: async () => archivedCategory,
    update: async () => archivedCategory,
    archive: async () => archivedCategory,
    restore: async () => archivedCategory,
    ...overrides,
  };
}

describe("archiveCategory", () => {
  it("forwards the category id to the repository", async () => {
    let receivedId: number | null = null;
    const repository = createRepositoryStub({
      archive: async (id) => {
        receivedId = id;
        return archivedCategory;
      },
    });

    await archiveCategory(repository, 2);

    expect(receivedId).toBe(2);
  });

  it("throws when the category id is invalid", async () => {
    await expect(archiveCategory(createRepositoryStub(), 0)).rejects.toMatchObject({
      code: CATEGORY_NOT_FOUND,
    });
  });
});
