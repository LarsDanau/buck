import type { Category } from "@buck/domain/categories";
import { router } from "expo-router";
import { Button, Tabs, useThemeColor } from "heroui-native";
import { useCallback, useMemo, useState } from "react";
import { TextInput } from "react-native";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/container";
import { HStack, IconSymbol, Text, View, VStack } from "@/components/primitives";

import { getCategoryErrorMessage } from "../errors/get-category-error-message";
import { useArchiveCategoryMutation } from "../mutations/use-archive-category-mutation";
import { useCreateCategoryMutation } from "../mutations/use-create-category-mutation";
import { useRestoreCategoryMutation } from "../mutations/use-restore-category-mutation";
import { useUpdateCategoryMutation } from "../mutations/use-update-category-mutation";
import { useCategoriesQuery } from "../queries/use-categories-query";

type CategoryKind = Category["kind"];
type CategorySort = "manual" | "alphabetical";

interface CategoryDraft {
  readonly id: number | null;
  readonly kind: CategoryKind;
  readonly name: string;
  readonly emoji: string;
  readonly color: string;
}

function createDraft(kind: CategoryKind): CategoryDraft {
  return {
    id: null,
    kind,
    name: "",
    emoji: "",
    color: "",
  };
}

function CategoryKindSwitch({
  selectedKind,
  onSelectKind,
}: {
  readonly selectedKind: CategoryKind;
  readonly onSelectKind: (kind: CategoryKind) => void;
}) {
  const { t } = useTranslation("categories");
  const handleValueChange = useCallback(
    (nextValue: string) => {
      if (nextValue === "expense" || nextValue === "income") {
        onSelectKind(nextValue);
      }
    },
    [onSelectKind],
  );

  return (
    <Tabs
      value={selectedKind}
      onValueChange={handleValueChange}
      variant="primary"
      className="flex-row justify-start"
    >
      <Tabs.List className="bg-surface">
        <Tabs.Indicator />
        <Tabs.Trigger value="expense" className="rounded-full px-4 py-1">
          <Tabs.Label className="text-sm">{t(($) => $.filters.expense)}</Tabs.Label>
        </Tabs.Trigger>
        <Tabs.Trigger value="income" className="rounded-full px-4 py-1">
          <Tabs.Label className="text-sm">{t(($) => $.filters.income)}</Tabs.Label>
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs>
  );
}

function CategoryRow({
  category,
  isBusy,
  onArchive,
  onEdit,
  onRestore,
}: {
  readonly category: Category;
  readonly isBusy: boolean;
  readonly onArchive: (id: number) => void;
  readonly onEdit: (category: Category) => void;
  readonly onRestore: (id: number) => void;
}) {
  const { t } = useTranslation("categories");
  const [muted] = useThemeColor(["muted"]);
  const handleEdit = useCallback(() => {
    onEdit(category);
  }, [category, onEdit]);
  const handleRestore = useCallback(() => {
    onRestore(category.id);
  }, [category.id, onRestore]);
  const handleArchive = useCallback(() => {
    onArchive(category.id);
  }, [category.id, onArchive]);

  return (
    <View className="rounded-2xl border border-muted bg-background px-4 py-3">
      <HStack className="items-start justify-between" gap="3">
        <HStack gap="3" className="flex-1 items-start">
          <Text size="2xl">{category.emoji}</Text>
          <VStack className="flex-1" gap="1">
            <HStack gap="2" className="items-center">
              <Text weight="medium">{category.name}</Text>
              {category.isArchived ? (
                <View className="rounded-full bg-muted px-2 py-1">
                  <Text size="xs" tone="muted">
                    {t(($) => $.list.archived)}
                  </Text>
                </View>
              ) : null}
            </HStack>
            <Text size="sm" tone="muted">
              {category.color || t(($) => $.form.noColor)}
            </Text>
          </VStack>
        </HStack>

        <HStack gap="1">
          <Button isIconOnly variant="ghost" size="sm" onPress={handleEdit} isDisabled={isBusy}>
            <IconSymbol name="pencil" tintColor={muted} />
          </Button>
          {category.isArchived ? (
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              onPress={handleRestore}
              isDisabled={isBusy}
            >
              <IconSymbol name="arrow.uturn.backward" tintColor={muted} />
            </Button>
          ) : (
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              onPress={handleArchive}
              isDisabled={isBusy}
            >
              <IconSymbol name="archivebox" tintColor={muted} />
            </Button>
          )}
        </HStack>
      </HStack>
    </View>
  );
}

function CategoryEditor({
  draft,
  errorMessage,
  isSaving,
  onCancel,
  onChange,
  onSubmit,
}: {
  readonly draft: CategoryDraft;
  readonly errorMessage: string | null;
  readonly isSaving: boolean;
  readonly onCancel: () => void;
  readonly onChange: (draft: CategoryDraft) => void;
  readonly onSubmit: () => void;
}) {
  const { t } = useTranslation("categories");
  const [foreground, muted] = useThemeColor(["foreground", "muted"]);
  const textInputStyle = useMemo(
    () => ({
      borderColor: muted,
      borderRadius: 16,
      borderWidth: 1,
      color: foreground,
      paddingHorizontal: 16,
      paddingVertical: 12,
    }),
    [foreground, muted],
  );
  const handleSelectKind = useCallback(
    (kind: CategoryKind) => {
      onChange({ ...draft, kind });
    },
    [draft, onChange],
  );
  const handleChangeName = useCallback(
    (name: string) => {
      onChange({ ...draft, name });
    },
    [draft, onChange],
  );
  const handleChangeEmoji = useCallback(
    (emoji: string) => {
      onChange({ ...draft, emoji });
    },
    [draft, onChange],
  );
  const handleChangeColor = useCallback(
    (color: string) => {
      onChange({ ...draft, color });
    },
    [draft, onChange],
  );

  return (
    <VStack gap="3" className="rounded-3xl border border-muted bg-background px-4 py-4">
      <VStack gap="1">
        <Text weight="semibold">
          {draft.id ? t(($) => $.form.editTitle) : t(($) => $.form.createTitle)}
        </Text>
        <Text size="sm" tone="muted">
          {t(($) => $.form.subtitle)}
        </Text>
      </VStack>

      <CategoryKindSwitch selectedKind={draft.kind} onSelectKind={handleSelectKind} />

      <TextInput
        style={textInputStyle}
        placeholder={t(($) => $.form.namePlaceholder)}
        placeholderTextColor={muted}
        value={draft.name}
        onChangeText={handleChangeName}
      />
      <TextInput
        style={textInputStyle}
        placeholder={t(($) => $.form.emojiPlaceholder)}
        placeholderTextColor={muted}
        value={draft.emoji}
        onChangeText={handleChangeEmoji}
      />
      <TextInput
        style={textInputStyle}
        placeholder={t(($) => $.form.colorPlaceholder)}
        placeholderTextColor={muted}
        value={draft.color}
        onChangeText={handleChangeColor}
        autoCapitalize="none"
      />

      {errorMessage ? (
        <View className="rounded-2xl bg-danger/10 px-3 py-3">
          <Text size="sm">{errorMessage}</Text>
        </View>
      ) : null}

      <HStack gap="2">
        <Button className="flex-1" onPress={onSubmit} isDisabled={isSaving}>
          <Button.Label>
            {draft.id ? t(($) => $.form.saveChanges) : t(($) => $.form.addCategory)}
          </Button.Label>
        </Button>
        <Button variant="ghost" className="flex-1" onPress={onCancel} isDisabled={isSaving}>
          <Button.Label>{t(($) => $.form.cancel)}</Button.Label>
        </Button>
      </HStack>
    </VStack>
  );
}

/**
 * Settings sub-screen used to manage local categories.
 *
 * @returns Categories management screen rendered under settings navigation.
 */
export function SettingsCategoriesScreen() {
  const { t } = useTranslation("categories");
  const { t: tCommon } = useTranslation("common");
  const [foreground] = useThemeColor(["foreground"]);
  const [selectedKind, setSelectedKind] = useState<CategoryKind>("expense");
  const [sortBy, setSortBy] = useState<CategorySort>("manual");
  const [showArchived, setShowArchived] = useState(false);
  const [draft, setDraft] = useState<CategoryDraft>(() => createDraft("expense"));

  const categoriesQuery = useCategoriesQuery({
    kind: selectedKind,
    includeArchived: showArchived,
    sortBy,
  });
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const archiveMutation = useArchiveCategoryMutation();
  const restoreMutation = useRestoreCategoryMutation();

  const categories = categoriesQuery.data ?? [];
  const activeError =
    createMutation.error ??
    updateMutation.error ??
    archiveMutation.error ??
    restoreMutation.error ??
    categoriesQuery.error;
  const errorMessage = activeError ? getCategoryErrorMessage(t, tCommon, activeError) : null;
  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    archiveMutation.isPending ||
    restoreMutation.isPending;

  const handleSelectKind = useCallback((kind: CategoryKind) => {
    setSelectedKind(kind);
    setDraft((currentDraft) => (currentDraft.id ? currentDraft : createDraft(kind)));
  }, []);

  const handleEditCategory = useCallback((category: Category) => {
    setSelectedKind(category.kind);
    setDraft({
      id: category.id,
      kind: category.kind,
      name: category.name,
      emoji: category.emoji,
      color: category.color ?? "",
    });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setDraft(createDraft(selectedKind));
  }, [selectedKind]);

  const handleSubmit = useCallback(async () => {
    try {
      await (draft.id
        ? updateMutation.mutateAsync({
            id: draft.id,
            name: draft.name,
            kind: draft.kind,
            emoji: draft.emoji,
            color: draft.color || null,
          })
        : createMutation.mutateAsync({
            name: draft.name,
            kind: draft.kind,
            emoji: draft.emoji,
            color: draft.color || null,
          }));

      setDraft(createDraft(selectedKind));
    } catch {
      // Mutation errors are surfaced through React Query state and rendered above the form.
    }
  }, [createMutation, draft, selectedKind, updateMutation]);
  const handleToggleSort = useCallback(() => {
    setSortBy((currentSort) => (currentSort === "manual" ? "alphabetical" : "manual"));
  }, []);
  const handleToggleArchived = useCallback(() => {
    setShowArchived((currentValue) => !currentValue);
  }, []);
  const handleArchiveCategory = useCallback(
    (id: number) => {
      archiveMutation.mutate(id);
    },
    [archiveMutation],
  );
  const handleRestoreCategory = useCallback(
    (id: number) => {
      restoreMutation.mutate(id);
    },
    [restoreMutation],
  );

  return (
    <Container className="px-6 pt-safe-offset-2">
      <VStack gap="6" className="pb-6">
        <HStack className="items-center justify-between">
          <Button isIconOnly variant="ghost" onPress={router.back}>
            <IconSymbol name="chevron.left" tintColor={foreground} />
          </Button>

          <Text weight="semibold" size="lg">
            {t(($) => $.overview.title)}
          </Text>

          <HStack gap="1">
            <Button isIconOnly variant="ghost" onPress={handleToggleSort}>
              <IconSymbol name="arrow.up.arrow.down" tintColor={foreground} />
            </Button>
            <Button isIconOnly variant="ghost" onPress={handleToggleArchived}>
              <IconSymbol name={showArchived ? "eye" : "eye.slash"} tintColor={foreground} />
            </Button>
          </HStack>
        </HStack>

        <VStack gap="2">
          <Text size="2xl" weight="semibold">
            {t(($) => $.overview.heading)}
          </Text>
          <Text tone="muted">{t(($) => $.overview.subtitle)}</Text>
        </VStack>

        <CategoryEditor
          draft={draft}
          errorMessage={errorMessage}
          isSaving={isSaving}
          onCancel={handleCancelEdit}
          onChange={setDraft}
          onSubmit={handleSubmit}
        />

        <VStack gap="3">
          <HStack className="items-center justify-between">
            <CategoryKindSwitch selectedKind={selectedKind} onSelectKind={handleSelectKind} />
            <Text size="sm" tone="muted">
              {sortBy === "manual"
                ? t(($) => $.filters.manualSort)
                : t(($) => $.filters.alphabeticalSort)}
            </Text>
          </HStack>

          {categoriesQuery.isLoading ? (
            <View className="rounded-2xl border border-muted bg-background px-4 py-6">
              <Text tone="muted">{t(($) => $.list.loading)}</Text>
            </View>
          ) : null}

          {!categoriesQuery.isLoading && categories.length === 0 ? (
            <View className="rounded-2xl border border-muted bg-background px-4 py-6">
              <Text tone="muted">{t(($) => $.list.empty)}</Text>
            </View>
          ) : null}

          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              isBusy={isSaving}
              onArchive={handleArchiveCategory}
              onEdit={handleEditCategory}
              onRestore={handleRestoreCategory}
            />
          ))}
        </VStack>
      </VStack>
    </Container>
  );
}
