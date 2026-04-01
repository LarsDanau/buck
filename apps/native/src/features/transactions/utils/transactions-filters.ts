/**
 * Supported date grouping options for the transactions overview.
 */
export const transactionPeriods = ["day", "week", "month", "year"] as const;

/**
 * Supported date grouping option value.
 */
export type TransactionPeriod = (typeof transactionPeriods)[number];

/**
 * Inclusive date range represented by the active transactions filter period.
 */
export interface TransactionPeriodRange {
  readonly startDate: Date;
  readonly endDate: Date;
}

/**
 * Options for shifting a transactions anchor date.
 */
export interface ShiftTransactionAnchorDateOptions {
  readonly anchorDate: Date;
  readonly period: TransactionPeriod;
  readonly direction: -1 | 1;
}

/**
 * Options for formatting the active transactions period label.
 */
export interface FormatTransactionPeriodLabelOptions {
  readonly anchorDate: Date;
  readonly period: TransactionPeriod;
  readonly locale: string;
}

const DEFAULT_FIRST_DAY_OF_WEEK = 1;
const DAYS_IN_WEEK = 7;
const SUNDAY_FIRST_DAY_REGIONS = new Set(["AU", "CA", "JP", "NZ", "PH", "US"]);

/**
 * Clones a date while normalizing it to a local calendar day boundary.
 *
 * @param date Source date.
 * @returns New date with the same year, month, and day components.
 */
function cloneLocalDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Returns the number of days in a month.
 *
 * @param year Calendar year.
 * @param monthIndex Zero-based month index.
 * @returns Number of days in the requested month.
 */
function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * Adds whole days without mutating the input date.
 *
 * @param date Source date.
 * @param amount Number of days to add.
 * @returns Shifted date.
 */
function addDays(date: Date, amount: number): Date {
  const nextDate = cloneLocalDate(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

/**
 * Moves a date by whole months while clamping to the target month's length.
 *
 * @param date Source date.
 * @param amount Number of months to add.
 * @returns Shifted date.
 */
function shiftMonth(date: Date, amount: number): Date {
  const currentDate = cloneLocalDate(date);
  const tentativeMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + amount, 1);
  const clampedDay = Math.min(
    currentDate.getDate(),
    getDaysInMonth(tentativeMonth.getFullYear(), tentativeMonth.getMonth()),
  );

  return new Date(tentativeMonth.getFullYear(), tentativeMonth.getMonth(), clampedDay);
}

/**
 * Moves a date by whole years while preserving the closest valid calendar day.
 *
 * @param date Source date.
 * @param amount Number of years to add.
 * @returns Shifted date.
 */
function shiftYear(date: Date, amount: number): Date {
  const currentDate = cloneLocalDate(date);
  const targetYear = currentDate.getFullYear() + amount;
  const clampedDay = Math.min(
    currentDate.getDate(),
    getDaysInMonth(targetYear, currentDate.getMonth()),
  );

  return new Date(targetYear, currentDate.getMonth(), clampedDay);
}

/**
 * Resolves the locale-specific first day of the week for range calculations.
 *
 * @param locale BCP 47 locale string.
 * @returns ISO weekday number where Monday is 1 and Sunday is 7.
 */
function getLocaleFirstDayOfWeek(locale: string): number {
  try {
    const localeInfo = new Intl.Locale(locale);
    const localeWithWeekInfo: Intl.Locale & {
      readonly weekInfo?: {
        readonly firstDay?: number;
      };
    } = localeInfo;

    if (localeWithWeekInfo.weekInfo?.firstDay) {
      return localeWithWeekInfo.weekInfo.firstDay;
    }

    if (
      localeInfo.language === "en" ||
      (localeInfo.region && SUNDAY_FIRST_DAY_REGIONS.has(localeInfo.region))
    ) {
      return 7;
    }

    return DEFAULT_FIRST_DAY_OF_WEEK;
  } catch {
    return DEFAULT_FIRST_DAY_OF_WEEK;
  }
}

/**
 * Returns the first day of the week containing the provided date.
 *
 * @param date Anchor date.
 * @param locale Locale used to resolve week boundaries.
 * @returns Start-of-week date.
 */
function getStartOfWeek(date: Date, locale: string): Date {
  const normalizedDate = cloneLocalDate(date);
  const firstDayOfWeek = getLocaleFirstDayOfWeek(locale);
  const currentDayOfWeek = normalizedDate.getDay() === 0 ? 7 : normalizedDate.getDay();
  const offset = (currentDayOfWeek - firstDayOfWeek + DAYS_IN_WEEK) % DAYS_IN_WEEK;

  return addDays(normalizedDate, -offset);
}

/**
 * Returns whether a string is a supported transactions period.
 *
 * @param value Candidate value to validate.
 * @returns True when the value matches a supported transactions period.
 */
export function isTransactionPeriod(value: string): value is TransactionPeriod {
  return transactionPeriods.some((period) => period === value);
}

/**
 * Shifts an anchor date by exactly one transactions period in the requested direction.
 *
 * @param options Anchor date, active period, and navigation direction.
 * @returns The shifted anchor date.
 */
export function shiftTransactionAnchorDate({
  anchorDate,
  period,
  direction,
}: ShiftTransactionAnchorDateOptions): Date {
  if (period === "day") {
    return addDays(anchorDate, direction);
  }

  if (period === "week") {
    return addDays(anchorDate, direction * DAYS_IN_WEEK);
  }

  if (period === "month") {
    return shiftMonth(anchorDate, direction);
  }

  return shiftYear(anchorDate, direction);
}

/**
 * Returns the inclusive date range represented by the current transactions period.
 *
 * @param anchorDate Current anchor date.
 * @param period Active transactions period.
 * @param locale Locale used for locale-specific week boundaries.
 * @returns Start and end dates for the active period.
 */
export function getTransactionPeriodRange(
  anchorDate: Date,
  period: TransactionPeriod,
  locale: string,
): TransactionPeriodRange {
  const normalizedDate = cloneLocalDate(anchorDate);

  if (period === "day") {
    return {
      startDate: normalizedDate,
      endDate: normalizedDate,
    };
  }

  if (period === "week") {
    const startDate = getStartOfWeek(normalizedDate, locale);

    return {
      startDate,
      endDate: addDays(startDate, DAYS_IN_WEEK - 1),
    };
  }

  if (period === "month") {
    return {
      startDate: new Date(normalizedDate.getFullYear(), normalizedDate.getMonth(), 1),
      endDate: new Date(normalizedDate.getFullYear(), normalizedDate.getMonth() + 1, 0),
    };
  }

  return {
    startDate: new Date(normalizedDate.getFullYear(), 0, 1),
    endDate: new Date(normalizedDate.getFullYear(), 11, 31),
  };
}

/**
 * Formats the visible label for the current transactions period using Intl.
 *
 * @param options Active anchor date, period, and locale.
 * @returns Locale-aware label for the active date filter.
 */
export function formatTransactionPeriodLabel({
  anchorDate,
  period,
  locale,
}: FormatTransactionPeriodLabelOptions): string {
  if (period === "day") {
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
    }).format(anchorDate);
  }

  if (period === "week") {
    const range = getTransactionPeriodRange(anchorDate, period, locale);
    const formatter = new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
    });

    return `${formatter.format(range.startDate)} – ${formatter.format(range.endDate)}`;
  }

  if (period === "month") {
    return new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    }).format(anchorDate);
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
  }).format(anchorDate);
}
