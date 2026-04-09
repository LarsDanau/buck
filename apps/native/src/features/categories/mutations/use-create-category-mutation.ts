import { createCategory } from "@buck/domain/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { categoriesQueryKeys } from "../queries/keys";
import { getCategoryCommandRepository } from "./repository";

/**
 * Creates categories through the domain layer and invalidates category lists.
 */
export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof createCategory>[1]) =>
      createCategory(getCategoryCommandRepository(), input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoriesQueryKeys.all,
      });
    },
  });
}
