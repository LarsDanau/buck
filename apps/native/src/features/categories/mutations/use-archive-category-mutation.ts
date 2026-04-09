import { archiveCategory } from "@buck/domain/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { categoriesQueryKeys } from "../queries/keys";
import { getCategoryCommandRepository } from "./repository";

/**
 * Archives categories through the domain layer and invalidates category lists.
 */
export function useArchiveCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => archiveCategory(getCategoryCommandRepository(), id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoriesQueryKeys.all,
      });
    },
  });
}
