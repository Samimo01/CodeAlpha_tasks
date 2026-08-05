import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { IconButton } from "@/components/common/IconButton";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import type { CollectionWithCount } from "@/types/CollectionWithCount";

interface Props {
  collection: CollectionWithCount;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CollectionRow({ collection, onOpen, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const cardLabel =
    collection.cardCount > 1
      ? `${collection.cardCount} flashcards`
      : `${collection.cardCount} flashcard`;

  return (
    <View style={styles.row}>
      <Pressable style={styles.tap} onPress={onOpen}>
        <Text style={styles.title} numberOfLines={1}>
          {collection.name}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {cardLabel}
        </Text>
      </Pressable>

      <View style={styles.menuWrap}>
        <IconButton
          name="dots-vertical"
          size={18}
          onPress={() => setMenuOpen((o) => !o)}
        />
        {menuOpen && (
          <>
            <Pressable style={styles.scrim} onPress={() => setMenuOpen(false)} />
            <View style={styles.menu}>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
              >
                <Text style={styles.menuItemText}>Edit</Text>
              </Pressable>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
              >
                <Text style={[styles.menuItemText, styles.menuDanger]}>Delete</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  tap: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 4,
    justifyContent: "center",
    gap: 3,
  },
  title: {
    fontFamily: typography.title,
    fontWeight: "600",
    fontSize: 14,
    color: colors.ink,
  },
  sub: {
    fontFamily: typography.body,
    fontSize: 12.5,
    color: colors.inkSoft,
  },
  menuWrap: {
    position: "relative",
    justifyContent: "center",
    paddingRight: 8,
  },
  scrim: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: -300,
    right: -300,
  },
  menu: {
    position: "absolute",
    right: 8,
    top: 36,
    zIndex: 20,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    minWidth: 130,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.55,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  menuItemText: {
    fontFamily: typography.bodyMedium,
    fontWeight: "500",
    fontSize: 13,
    color: colors.ink,
  },
  menuDanger: {
    color: colors.danger,
  },
});
