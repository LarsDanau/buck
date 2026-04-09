import type { ListCategoriesQueryInput } from "@buck/db/queries";
import { listCategories } from "@buck/db/queries";
import { useQuery } from "@tanstack/react-query";

import { db } from "@/db/client";

import { categoriesQueryKeys } from "./keys";

/**
 * Reads categories from the local database through React Query.
 *
 * @param input Optional list filters for the categories query.
 * @returns React Query result for the requested category list.
 */
export function useCategoriesQuery(input: ListCategoriesQueryInput = {}) {
  return useQuery({
    queryKey: categoriesQueryKeys.list(input),
    queryFn: () => listCategories(db, input),
  });
}
