import { and, asc, eq } from "drizzle-orm";
import type { Category, CategoryId } from "@buck/domain/categories";

import type { BuckDatabase } from "../database";
import { categories } from "../schema";

export interface ListCategoriesQueryInput {
  readonly kind?: Category["kind"];
  readonly includeArchived?: boolean;
  readonly sortBy?: "manual" | "alphabetical";
}

/**
 * Lists categories from SQLite using the given filters.
 *
 * @param db Shared database executor.
 * @param input Optional category list filters.
 * @returns Categories returned in the shared domain shape.
 */
export async function listCategories(
  db: BuckDatabase,
  input: ListCategoriesQueryInput = {},
): Promise<readonly Category[]> {
  const rows = await db.query.categories.findMany({
    where: and(
      input.kind ? eq(categories.kind, input.kind) : undefined,
      input.includeArchived ? undefined : eq(categories.isArchived, false),
    ),
    orderBy:
      input.sortBy === "alphabetical"
        ? [asc(categories.name), asc(categories.sortOrder)]
        : [asc(categories.sortOrder), asc(categories.name)],
  });

  return rows;
}

/**
 * Returns a single category by id when it exists.
 *
 * @param db Shared database executor.
 * @param id Category identifier.
 * @returns Matching category row or null.
 */
export async function getCategoryById(db: BuckDatabase, id: CategoryId): Promise<Category | null> {
  const row = await db.query.categories.findFirst({
    where: eq(categories.id, id),
  });

  return row ?? null;
}
