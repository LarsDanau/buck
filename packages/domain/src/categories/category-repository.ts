import type { Category } from "./category";

export interface CreateCategoryInput {
  readonly name: string;
  readonly kind: Category["kind"];
  readonly emoji: string;
  readonly color: string | null;
}

export interface UpdateCategoryInput extends CreateCategoryInput {
  readonly id: Category["id"];
}

export interface CategoryCommandRepository {
  create(input: CreateCategoryInput): Promise<Category>;
  update(input: UpdateCategoryInput): Promise<Category>;
  archive(id: Category["id"]): Promise<Category>;
  restore(id: Category["id"]): Promise<Category>;
}
