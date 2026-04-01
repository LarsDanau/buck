import {
  formatTransactionPeriodLabel,
  getTransactionPeriodRange,
  isTransactionPeriod,
  shiftTransactionAnchorDate,
} from "./transactions-filters";

describe("transactions-filters", () => {
  describe("isTransactionPeriod", () => {
    it("accepts supported period values", () => {
      expect(isTransactionPeriod("day")).toBe(true);
      expect(isTransactionPeriod("week")).toBe(true);
      expect(isTransactionPeriod("month")).toBe(true);
      expect(isTransactionPeriod("year")).toBe(true);
    });

    it("rejects unsupported values", () => {
      expect(isTransactionPeriod("quarter")).toBe(false);
      expect(isTransactionPeriod("Month")).toBe(false);
      expect(isTransactionPeriod("")).toBe(false);
    });
  });

  describe("shiftTransactionAnchorDate", () => {
    it("shifts day and week periods without mutating the source date", () => {
      const anchorDate = new Date(2024, 0, 15);

      expect(
        shiftTransactionAnchorDate({
          anchorDate,
          period: "day",
          direction: 1,
        }),
      ).toEqual(new Date(2024, 0, 16));

      expect(
        shiftTransactionAnchorDate({
          anchorDate,
          period: "week",
          direction: -1,
        }),
      ).toEqual(new Date(2024, 0, 8));

      expect(anchorDate).toEqual(new Date(2024, 0, 15));
    });

    it("clamps forward month shifts at month boundaries", () => {
      expect(
        shiftTransactionAnchorDate({
          anchorDate: new Date(2023, 0, 31),
          period: "month",
          direction: 1,
        }),
      ).toEqual(new Date(2023, 1, 28));

      expect(
        shiftTransactionAnchorDate({
          anchorDate: new Date(2024, 0, 31),
          period: "month",
          direction: 1,
        }),
      ).toEqual(new Date(2024, 1, 29));
    });

    it("clamps reverse month shifts at month boundaries", () => {
      expect(
        shiftTransactionAnchorDate({
          anchorDate: new Date(2024, 2, 31),
          period: "month",
          direction: -1,
        }),
      ).toEqual(new Date(2024, 1, 29));

      expect(
        shiftTransactionAnchorDate({
          anchorDate: new Date(2023, 4, 30),
          period: "month",
          direction: -1,
        }),
      ).toEqual(new Date(2023, 3, 30));
    });

    it("clamps leap-day year shifts", () => {
      expect(
        shiftTransactionAnchorDate({
          anchorDate: new Date(2024, 1, 29),
          period: "year",
          direction: 1,
        }),
      ).toEqual(new Date(2025, 1, 28));

      expect(
        shiftTransactionAnchorDate({
          anchorDate: new Date(2024, 1, 29),
          period: "year",
          direction: -1,
        }),
      ).toEqual(new Date(2023, 1, 28));
    });
  });

  describe("getTransactionPeriodRange", () => {
    it("returns the same date for day ranges", () => {
      expect(getTransactionPeriodRange(new Date(2024, 0, 15), "day", "en-US")).toEqual({
        startDate: new Date(2024, 0, 15),
        endDate: new Date(2024, 0, 15),
      });
    });

    it("uses locale-specific week boundaries", () => {
      expect(getTransactionPeriodRange(new Date(2024, 0, 3), "week", "en-US")).toEqual({
        startDate: new Date(2023, 11, 31),
        endDate: new Date(2024, 0, 6),
      });

      expect(getTransactionPeriodRange(new Date(2024, 0, 3), "week", "en-BE")).toEqual({
        startDate: new Date(2024, 0, 1),
        endDate: new Date(2024, 0, 7),
      });
    });

    it("returns inclusive month and year ranges", () => {
      expect(getTransactionPeriodRange(new Date(2024, 1, 11), "month", "en-US")).toEqual({
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 29),
      });

      expect(getTransactionPeriodRange(new Date(2024, 5, 11), "year", "en-US")).toEqual({
        startDate: new Date(2024, 0, 1),
        endDate: new Date(2024, 11, 31),
      });
    });
  });

  describe("formatTransactionPeriodLabel", () => {
    it("formats stable labels for each supported period", () => {
      expect(
        formatTransactionPeriodLabel({
          anchorDate: new Date(2024, 0, 15),
          period: "day",
          locale: "en-US",
        }),
      ).toBe("Jan 15");

      expect(
        formatTransactionPeriodLabel({
          anchorDate: new Date(2024, 0, 3),
          period: "week",
          locale: "en-BE",
        }),
      ).toBe("1 Jan – 7 Jan");

      expect(
        formatTransactionPeriodLabel({
          anchorDate: new Date(2024, 0, 15),
          period: "month",
          locale: "en-US",
        }),
      ).toBe("January 2024");

      expect(
        formatTransactionPeriodLabel({
          anchorDate: new Date(2024, 0, 15),
          period: "year",
          locale: "en-US",
        }),
      ).toBe("2024");
    });
  });
});
