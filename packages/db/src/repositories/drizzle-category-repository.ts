import type {
  Category,
  CategoryCommandRepository,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@buck/domain/categories";
import { desc, eq } from "drizzle-orm";

import type { BuckDatabase } from "../database";
import { categories } from "../schema";
import { mapCategoryWriteError } from "./map-db-error";

/**
 * Drizzle-backed category write adapter for the domain layer.
 */
export class DrizzleCategoryRepository implements CategoryCommandRepository {
  constructor(private readonly db: BuckDatabase) {}

  /**
   * Creates a category at the end of its kind-specific ordering.
   *
   * @param input New category values from the domain action.
   * @returns Created category in the shared domain shape.
   */
  async create(input: CreateCategoryInput): Promise<Category> {
    let row: Category | undefined;

    try {
      row = await this.db.transaction(async (tx) => {
        const lastCategory = await tx.query.categories.findFirst({
          where: eq(categories.kind, input.kind),
          orderBy: [desc(categories.sortOrder), desc(categories.id)],
        });

        const [createdCategory] = await tx
          .insert(categories)
          .values({
            ...input,
            sortOrder: (lastCategory?.sortOrder ?? -1) + 1,
          })
          .returning();

        return createdCategory;
      });
    } catch (error) {
      throw mapCategoryWriteError(error);
    }

    if (!row) {
      throw mapCategoryWriteError(new Error("No category row returned."));
    }

    return row;
  }

  /**
   * Updates an existing category.
   *
   * @param input Updated category values from the domain action.
   * @returns Updated category in the shared domain shape.
   */
  async update(input: UpdateCategoryInput): Promise<Category> {
    let row: Category | undefined;

    try {
      row = await this.db.transaction(async (tx) => {
        const [updatedCategory] = await tx
          .update(categories)
          .set({
            name: input.name,
            kind: input.kind,
            emoji: input.emoji,
            color: input.color,
          })
          .where(eq(categories.id, input.id))
          .returning();

        return updatedCategory;
      });
    } catch (error) {
      throw mapCategoryWriteError(error);
    }

    if (!row) {
      throw mapCategoryWriteError(new Error("No category row returned."));
    }

    return row;
  }

  /**
   * Marks a category as archived.
   *
   * @param id Category identifier.
   * @returns Archived category in the shared domain shape.
   */
  async archive(id: number): Promise<Category> {
    return this.updateArchiveState(id, true);
  }

  /**
   * Restores an archived category.
   *
   * @param id Category identifier.
   * @returns Restored category in the shared domain shape.
   */
  async restore(id: number): Promise<Category> {
    return this.updateArchiveState(id, false);
  }

  private async updateArchiveState(id: number, isArchived: boolean): Promise<Category> {
    let row: Category | undefined;

    try {
      row = await this.db.transaction(async (tx) => {
        const [updatedCategory] = await tx
          .update(categories)
          .set({ isArchived })
          .where(eq(categories.id, id))
          .returning();

        return updatedCategory;
      });
    } catch (error) {
      throw mapCategoryWriteError(error);
    }

    if (!row) {
      throw mapCategoryWriteError(new Error("No category row returned."));
    }

    return row;
  }
}
