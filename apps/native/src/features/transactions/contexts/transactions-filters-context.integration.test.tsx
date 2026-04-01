import type { PropsWithChildren } from "react";
import { act } from "@testing-library/react-native";
import { renderHookWithProviders } from "@/src/test/test-utils";
import {
  TransactionsFiltersProvider,
  useTransactionsFilters,
} from "./transactions-filters-context";

function createWrapper({
  initialAnchorDate = new Date(2024, 0, 15),
}: {
  readonly initialAnchorDate?: Date;
}) {
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <TransactionsFiltersProvider initialAnchorDate={initialAnchorDate} initialPeriod="month">
        {children}
      </TransactionsFiltersProvider>
    );
  };
}

describe("TransactionsFiltersProvider", () => {
  it("exposes the default month state and updates the label through navigation", () => {
    const { result } = renderHookWithProviders(() => useTransactionsFilters(), {
      wrapper: createWrapper({}),
    });

    expect(result.current.period).toBe("month");
    expect(result.current.label).toBe("January 2024");

    act(() => {
      result.current.goToPrevious();
    });
    expect(result.current.label).toBe("December 2023");

    act(() => {
      result.current.goToNext();
    });
    expect(result.current.label).toBe("January 2024");
  });

  it("recomputes the label when the active period changes", () => {
    const { result } = renderHookWithProviders(() => useTransactionsFilters(), {
      wrapper: createWrapper({}),
    });

    act(() => {
      result.current.setPeriod("week");
    });
    expect(result.current.label).toBe("Jan 14 – Jan 20");

    act(() => {
      result.current.setPeriod("year");
    });
    expect(result.current.label).toBe("2024");
  });

  it("throws when the hook is used outside the provider", () => {
    expect(() => renderHookWithProviders(() => useTransactionsFilters())).toThrow(
      "useTransactionsFilters must be used within TransactionsFiltersProvider",
    );
  });
});
