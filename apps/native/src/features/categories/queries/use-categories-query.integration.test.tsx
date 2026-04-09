import { describe, expect, it, jest } from "@jest/globals";
import { waitFor } from "@testing-library/react-native";

import {
  createQueryClientWrapper,
  createTestQueryClient,
  renderHookWithProviders,
} from "@/test/test-utils";

import { useCategoriesQuery } from "./use-categories-query";

interface MockListedCategory {
  readonly id: number;
  readonly name: string;
  readonly kind: "expense";
  readonly emoji: string;
  readonly color: null;
  readonly sortOrder: number;
  readonly isArchived: boolean;
}

const mockListCategories = jest.fn<(...args: unknown[]) => Promise<MockListedCategory[]>>();

jest.mock("@/db/client", () => ({
  db: { test: "db" },
}));

jest.mock("@buck/db/queries", () => ({
  listCategories: (...args: unknown[]) => mockListCategories(...args),
}));

describe("useCategoriesQuery", () => {
  it("loads categories through React Query and the shared db query helper", async () => {
    const categories = [
      {
        id: 1,
        name: "Groceries",
        kind: "expense" as const,
        emoji: "🛒",
        color: null,
        sortOrder: 0,
        isArchived: false,
      },
    ];

    mockListCategories.mockResolvedValueOnce(categories);

    const queryClient = createTestQueryClient();
    const wrapper = createQueryClientWrapper(queryClient);

    const { result, unmount } = renderHookWithProviders(
      () =>
        useCategoriesQuery({
          includeArchived: true,
          kind: "expense",
          sortBy: "manual",
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockListCategories).toHaveBeenCalledWith(
      { test: "db" },
      { includeArchived: true, kind: "expense", sortBy: "manual" },
    );
    expect(result.current.data).toEqual(categories);

    unmount();
    queryClient.clear();
  });
});
