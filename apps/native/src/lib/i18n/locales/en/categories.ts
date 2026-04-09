const enCategories = {
  overview: {
    title: "Categories",
    heading: "Manage categories",
    subtitle: "Create, edit, archive, and restore the categories used across Buck.",
  },
  filters: {
    alphabeticalSort: "A-Z",
    expense: "Expense",
    income: "Income",
    manualSort: "Manual",
  },
  form: {
    addCategory: "Add category",
    cancel: "Cancel",
    colorPlaceholder: "Color hex (optional)",
    createTitle: "New category",
    editTitle: "Edit category",
    emojiPlaceholder: "Emoji",
    namePlaceholder: "Category name",
    noColor: "No color set",
    saveChanges: "Save changes",
    subtitle: "Use one shared pattern for category CRUD before moving on to transactions.",
  },
  list: {
    archived: "Archived",
    empty: "No categories match this filter yet.",
    loading: "Loading categories...",
  },
  errors: {
    categoryEmojiRequired: "Choose an emoji for the category.",
    categoryNameDuplicate: "A category with this name already exists.",
    categoryNotFound: "This category could not be found.",
    categoryNameRequired: "Enter a category name.",
    dbWriteFailed: "Something went wrong while saving your changes.",
  },
} as const;

export default enCategories;
