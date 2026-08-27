import { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { CollectionRow } from "./CollectionRow";
import type { CollectionWithCount } from "@/types";

interface Props {
  collections: CollectionWithCount[];
  onOpen: (id: number, name: string) => void;
  onEdit: (id: number) => void;
  onDelete: (collection: CollectionWithCount) => void;
}

export function CollectionList({ collections, onOpen, onEdit, onDelete }: Props) {
  
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <FlatList
      data={collections}
      keyExtractor={(c) => String(c.id)}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <CollectionRow
          collection={item}
          menuOpen={openMenuId === item.id}
          onToggleMenu={() =>
            setOpenMenuId((currentId) =>
              currentId === item.id ? null : item.id
            )
          }
          onCloseMenu={() => setOpenMenuId(null)}
          onOpen={() => onOpen(item.id, item.name)}
          onEdit={() => onEdit(item.id)}
          onDelete={() => onDelete(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
    paddingBottom: 20,
  },
});