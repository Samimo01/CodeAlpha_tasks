import React from "react";
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
  return (
    <FlatList
      data={collections}
      keyExtractor={(c) => String(c.id)}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <CollectionRow
          collection={item}
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
