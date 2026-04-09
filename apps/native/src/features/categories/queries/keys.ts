export const categoriesQueryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoriesQueryKeys.all, "list"] as const,
  list: (input: { kind?: "income" | "expense"; includeArchived?: boolean; sortBy?: string }) =>
    [...categoriesQueryKeys.lists(), input] as const,
} as const;
