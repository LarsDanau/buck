import type { InferInsertModel } from "drizzle-orm";

import type { categories } from "../schema/categories";

type DefaultCategory = Omit<
  InferInsertModel<typeof categories>,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * Built-in categories inserted once for a new local database.
 */
export const defaultCategories = [
  {
    name: "Salary",
    kind: "income",
    emoji: "💰",
    color: "#84cc16",
    sortOrder: 0,
    isArchived: false,
  },
  {
    name: "Freelance",
    kind: "income",
    emoji: "💻",
    color: "#22c55e",
    sortOrder: 1,
    isArchived: false,
  },
  {
    name: "Gift",
    kind: "income",
    emoji: "🎁",
    color: "#10b981",
    sortOrder: 2,
    isArchived: false,
  },

  {
    name: "Groceries",
    kind: "expense",
    emoji: "🛒",
    color: "#22c55e",
    sortOrder: 0,
    isArchived: false,
  },
  {
    name: "Dining",
    kind: "expense",
    emoji: "🍽️",
    color: "#f97316",
    sortOrder: 1,
    isArchived: false,
  },
  {
    name: "Rent",
    kind: "expense",
    emoji: "🏠",
    color: "#3b82f6",
    sortOrder: 2,
    isArchived: false,
  },
  {
    name: "Transport",
    kind: "expense",
    emoji: "🚆",
    color: "#06b6d4",
    sortOrder: 3,
    isArchived: false,
  },
  {
    name: "Shopping",
    kind: "expense",
    emoji: "🛍️",
    color: "#ec4899",
    sortOrder: 4,
    isArchived: false,
  },
  {
    name: "Health",
    kind: "expense",
    emoji: "💊",
    color: "#ef4444",
    sortOrder: 5,
    isArchived: false,
  },
  {
    name: "Entertainment",
    kind: "expense",
    emoji: "🎬",
    color: "#8b5cf6",
    sortOrder: 6,
    isArchived: false,
  },
  {
    name: "Travel",
    kind: "expense",
    emoji: "✈️",
    color: "#0ea5e9",
    sortOrder: 7,
    isArchived: false,
  },
  {
    name: "Utilities",
    kind: "expense",
    emoji: "💡",
    color: "#eab308",
    sortOrder: 8,
    isArchived: false,
  },
] satisfies readonly DefaultCategory[];
