import { useMemo, useState, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { IconButton } from "@/components/common/IconButton";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { BrandHeader } from "@/components/layout/BrandHeader";
import { SearchBar } from "@/components/collection/SearchBar";
import { EmptyState } from "@/components/collection/EmptyState";
import { CollectionList } from "@/components/collection/CollectionList";
import { ConfirmDeleteCollectionDialog } from "@/components/dialogs/ConfirmDeleteCollectionDialog";
import { useCollections } from "@/hooks/useCollections";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import type { CollectionWithCount } from "@/types";

export default function HomeScreen() {
  const router = useRouter();
  const { collections, remove, refresh } = useCollections();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CollectionWithCount | null>(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const showSearch = collections.length > 0;
  const filtered = useMemo(() => {
    if (!showSearch) return collections;
    const q = searchTerm.trim().toLowerCase();
    if (!q) return collections;
    return collections.filter((c) => c.name.toLowerCase().includes(q));
  }, [collections, searchTerm, showSearch]);

  const totalCards = collections.reduce((sum, c) => sum + c.cardCount, 0);

  const handleCreate = () => {
    router.push("/collection/new");
  };

  const handleOpenCollection = (id: number, _name: string) => {
    router.push(`/review/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/collection/${id}`);
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await remove(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <ScreenContainer>
      <BrandHeader />
      <Text style={styles.stats}>
        {collections.length} collection{collections.length > 1 ? "s" : ""} ·{" "}
        {totalCards} card{totalCards > 1 ? "s" : ""} total
      </Text>

      <View style={styles.sectionHead}>
        <Text style={styles.h2}>Collections</Text>
        <IconButton
          name="plus"
          color={colors.accentInk}
          style={styles.fab}
          onPress={handleCreate}
        />
      </View>

      {showSearch && (
        <SearchBar value={searchTerm} onChangeText={setSearchTerm} />
      )}

      {collections.length === 0 ? (
        <EmptyState
          title="Create your first collection"
          subtitle="It will appear here with its flashcards."
        />
      ) : filtered.length === 0 ? (
        <EmptyState title={`No results for “${searchTerm}”`} />
      ) : (
        <CollectionList
          collections={filtered}
          onOpen={handleOpenCollection}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
        />
      )}

      <ConfirmDeleteCollectionDialog
        visible={deleteTarget !== null}
        collectionName={deleteTarget?.name ?? ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  stats: {
    fontFamily: typography.body,
    fontSize: 12.5,
    color: colors.inkFaint,
    marginBottom: 22,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  h2: {
    fontFamily: typography.title,
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: 0.3,
    color: colors.inkSoft,
    textTransform: "uppercase",
  },
  fab: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    shadowColor: "#453DE0",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
