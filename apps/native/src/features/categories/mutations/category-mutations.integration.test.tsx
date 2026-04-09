import { describe, expect, it, jest } from "@jest/globals";
import { act, waitFor } from "@testing-library/react-native";

import {
  createQueryClientWrapper,
  createTestQueryClient,
  renderHookWithProviders,
} from "@/test/test-utils";

import { useArchiveCategoryMutation } from "./use-archive-category-mutation";
import { useCreateCategoryMutation } from "./use-create-category-mutation";
import { useRestoreCategoryMutation } from "./use-restore-category-mutation";
import { useUpdateCategoryMutation } from "./use-update-category-mutation";
import { categoriesQueryKeys } from "../queries/keys";

const mockArchiveCategory = jest.fn<(...args: unknown[]) => Promise<{ id: number }>>();
const mockCreateCategory = jest.fn<(...args: unknown[]) => Promise<{ id: number }>>();
const mockRestoreCategory = jest.fn<(...args: unknown[]) => Promise<{ id: number }>>();
const mockUpdateCategory = jest.fn<(...args: unknown[]) => Promise<{ id: number }>>();
const mockRepository = { name: "repository" };

jest.mock("@buck/domain/categories", () => ({
  archiveCategory: (...args: unknown[]) => mockArchiveCategory(...args),
  createCategory: (...args: unknown[]) => mockCreateCategory(...args),
  restoreCategory: (...args: unknown[]) => mockRestoreCategory(...args),
  updateCategory: (...args: unknown[]) => mockUpdateCategory(...args),
}));

jest.mock("./repository", () => ({
  getCategoryCommandRepository: () => mockRepository,
}));

describe("category mutations", () => {
  it("creates categories and invalidates category queries", async () => {
    mockCreateCategory.mockResolvedValueOnce({ id: 1 });

    const queryClient = createTestQueryClient();
    const invalidateQueries = jest.spyOn(queryClient, "invalidateQueries");
    const wrapper = createQueryClientWrapper(queryClient);
    const { result, unmount } = renderHookWithProviders(() => useCreateCategoryMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync({
        color: null,
        emoji: "🛒",
        kind: "expense",
        name: "Groceries",
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockCreateCategory).toHaveBeenCalledWith(mockRepository, {
      color: null,
      emoji: "🛒",
      kind: "expense",
      name: "Groceries",
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: categoriesQueryKeys.all,
    });

    unmount();
    queryClient.clear();
  });

  it("updates categories and invalidates category queries", async () => {
    mockUpdateCategory.mockResolvedValueOnce({ id: 4 });

    const queryClient = createTestQueryClient();
    const invalidateQueries = jest.spyOn(queryClient, "invalidateQueries");
    const wrapper = createQueryClientWrapper(queryClient);
    const { result, unmount } = renderHookWithProviders(() => useUpdateCategoryMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync({
        id: 4,
        color: "#22c55e",
        emoji: "💰",
        kind: "income",
        name: "Salary",
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockUpdateCategory).toHaveBeenCalledWith(mockRepository, {
      id: 4,
      color: "#22c55e",
      emoji: "💰",
      kind: "income",
      name: "Salary",
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: categoriesQueryKeys.all,
    });

    unmount();
    queryClient.clear();
  });

  it("archives categories and invalidates category queries", async () => {
    mockArchiveCategory.mockResolvedValueOnce({ id: 4 });

    const queryClient = createTestQueryClient();
    const invalidateQueries = jest.spyOn(queryClient, "invalidateQueries");
    const wrapper = createQueryClientWrapper(queryClient);
    const { result, unmount } = renderHookWithProviders(() => useArchiveCategoryMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(4);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockArchiveCategory).toHaveBeenCalledWith(mockRepository, 4);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: categoriesQueryKeys.all,
    });

    unmount();
    queryClient.clear();
  });

  it("restores categories and invalidates category queries", async () => {
    mockRestoreCategory.mockResolvedValueOnce({ id: 4 });

    const queryClient = createTestQueryClient();
    const invalidateQueries = jest.spyOn(queryClient, "invalidateQueries");
    const wrapper = createQueryClientWrapper(queryClient);
    const { result, unmount } = renderHookWithProviders(() => useRestoreCategoryMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(4);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockRestoreCategory).toHaveBeenCalledWith(mockRepository, 4);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: categoriesQueryKeys.all,
    });

    unmount();
    queryClient.clear();
  });
});
