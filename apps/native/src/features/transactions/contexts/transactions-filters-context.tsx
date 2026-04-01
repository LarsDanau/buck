import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { getAppLocale } from "@/src/lib/i18n/locale";
import type { TransactionPeriod } from "../utils/transactions-filters";

import {
  formatTransactionPeriodLabel,
  shiftTransactionAnchorDate,
} from "../utils/transactions-filters";

/**
 * Shared transactions filter state exposed to transactions feature consumers.
 */
export interface TransactionsFiltersContextValue {
  readonly period: TransactionPeriod;
  readonly anchorDate: Date;
  readonly label: string;
  setPeriod: (period: TransactionPeriod) => void;
  setAnchorDate: (date: Date) => void;
  goToPrevious: () => void;
  goToNext: () => void;
}

interface TransactionsFiltersProviderProps {
  readonly children: ReactNode;
  readonly initialPeriod?: TransactionPeriod;
  readonly initialAnchorDate?: Date;
}

const TransactionsFiltersContext = createContext<TransactionsFiltersContextValue | undefined>(
  undefined,
);

/**
 * Clones dates before storing them in state to avoid external mutation leaks.
 *
 * @param date Source date.
 * @returns Cloned date.
 */
function cloneDate(date: Date): Date {
  return new Date(date.getTime());
}

/**
 * Formats the visible date-filter label from the current period, date, and i18n state.
 *
 * @param params Current filter inputs and i18n language values.
 * @returns Locale-aware filter label.
 */
function getLabel({
  anchorDate,
  period,
  language,
  resolvedLanguage,
}: {
  readonly anchorDate: Date;
  readonly period: TransactionPeriod;
  readonly language?: string | null;
  readonly resolvedLanguage?: string | null;
}): string {
  return formatTransactionPeriodLabel({
    anchorDate,
    period,
    locale: getAppLocale(resolvedLanguage, language),
  });
}

/**
 * Provides transactions filter state to the transactions feature subtree.
 *
 * @param props Provider children and optional initial filter values.
 * @returns Context provider with shared transactions filter state.
 */
export function TransactionsFiltersProvider({
  children,
  initialPeriod = "month",
  initialAnchorDate = new Date(),
}: TransactionsFiltersProviderProps) {
  const { i18n } = useTranslation();
  const [period, setPeriod] = useState<TransactionPeriod>(initialPeriod);
  const [anchorDate, setAnchorDateState] = useState<Date>(() => cloneDate(initialAnchorDate));

  const label = useMemo(
    () =>
      getLabel({
        anchorDate,
        language: i18n.language,
        period,
        resolvedLanguage: i18n.resolvedLanguage,
      }),
    [anchorDate, i18n.language, i18n.resolvedLanguage, period],
  );

  const setAnchorDate = useCallback((nextAnchorDate: Date) => {
    setAnchorDateState(cloneDate(nextAnchorDate));
  }, []);

  const shiftAnchorDate = useCallback(
    (direction: -1 | 1) => {
      setAnchorDateState((currentAnchorDate) =>
        shiftTransactionAnchorDate({
          anchorDate: currentAnchorDate,
          direction,
          period,
        }),
      );
    },
    [period],
  );

  const goToPrevious = useCallback(() => {
    shiftAnchorDate(-1);
  }, [shiftAnchorDate]);

  const goToNext = useCallback(() => {
    shiftAnchorDate(1);
  }, [shiftAnchorDate]);

  const value = useMemo(
    () => ({
      period,
      anchorDate,
      label,
      setPeriod,
      setAnchorDate,
      goToPrevious,
      goToNext,
    }),
    [anchorDate, goToNext, goToPrevious, label, period, setAnchorDate],
  );

  return (
    <TransactionsFiltersContext.Provider value={value}>
      {children}
    </TransactionsFiltersContext.Provider>
  );
}

/**
 * Reads the shared transactions filter state from context.
 *
 * @returns Transactions filter state and navigation actions.
 */
export function useTransactionsFilters(): TransactionsFiltersContextValue {
  const context = useContext(TransactionsFiltersContext);

  if (!context) {
    throw new Error("useTransactionsFilters must be used within TransactionsFiltersProvider");
  }

  return context;
}
