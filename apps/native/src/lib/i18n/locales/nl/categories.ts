const nlCategories = {
  overview: {
    title: "Categorieën",
    heading: "Categorieën beheren",
    subtitle: "Maak, bewerk, archiveer en herstel de categorieën die Buck gebruikt.",
  },
  filters: {
    alphabeticalSort: "A-Z",
    expense: "Uitgaven",
    income: "Inkomen",
    manualSort: "Handmatig",
  },
  form: {
    addCategory: "Categorie toevoegen",
    cancel: "Annuleren",
    colorPlaceholder: "Kleurcode (optioneel)",
    createTitle: "Nieuwe categorie",
    editTitle: "Categorie bewerken",
    emojiPlaceholder: "Emoji",
    namePlaceholder: "Categorienaam",
    noColor: "Geen kleur ingesteld",
    saveChanges: "Wijzigingen opslaan",
    subtitle: "Gebruik eerst één gedeeld CRUD-patroon voor categorieën voordat transacties volgen.",
  },
  list: {
    archived: "Gearchiveerd",
    empty: "Er zijn nog geen categorieën voor dit filter.",
    loading: "Categorieën laden...",
  },
  errors: {
    categoryEmojiRequired: "Kies een emoji voor de categorie.",
    categoryNameDuplicate: "Er bestaat al een categorie met deze naam.",
    categoryNotFound: "Deze categorie kon niet worden gevonden.",
    categoryNameRequired: "Voer een categorienaam in.",
    dbWriteFailed: "Er ging iets mis bij het opslaan van je wijzigingen.",
  },
} as const;

export default nlCategories;
