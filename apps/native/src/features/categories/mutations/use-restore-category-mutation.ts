import { restoreCategory } from "@buck/domain/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { categoriesQueryKeys } from "../queries/keys";
import { getCategoryCommandRepository } from "./repository";

/**
 * Restores archived categories through the domain layer and invalidates category lists.
 */
export function useRestoreCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => restoreCategory(getCategoryCommandRepository(), id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoriesQueryKeys.all,
      });
    },
  });
}
