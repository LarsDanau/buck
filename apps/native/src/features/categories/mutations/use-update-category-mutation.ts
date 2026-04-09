import { updateCategory } from "@buck/domain/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { categoriesQueryKeys } from "../queries/keys";
import { getCategoryCommandRepository } from "./repository";

/**
 * Updates categories through the domain layer and invalidates category lists.
 */
export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof updateCategory>[1]) =>
      updateCategory(getCategoryCommandRepository(), input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoriesQueryKeys.all,
      });
    },
  });
}
