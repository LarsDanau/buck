export type CategoryKind = "income" | "expense";
export type CategoryId = number;

export interface Category {
  readonly id: CategoryId;
  readonly name: string;
  readonly kind: CategoryKind;
  readonly emoji: string;
  readonly color: string | null;
  readonly sortOrder: number;
  readonly isArchived: boolean;
}
