import { Pressable, StyleSheet, Text, View } from "react-native";
import { IconButton } from "@/components/common/IconButton";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import type { CollectionWithCount } from "@/types/CollectionWithCount";

interface Props {
  collection: CollectionWithCount;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CollectionRow({
  collection,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onOpen,
  onEdit,
  onDelete,
}: Props) {

  const cardLabel =
    collection.cardCount > 1
      ? `${collection.cardCount} flashcards`
      : `${collection.cardCount} flashcard`;

  return (
    <View style={[styles.row, menuOpen && styles.rowOpen]}>
      <Pressable
        style={styles.tap}
        onPress={() => {
          onCloseMenu();
          onOpen();
        }}
      >
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
          onPress={onToggleMenu}
        />

        {menuOpen && (
          <View style={styles.menu}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                onCloseMenu();
                onEdit();
              }}
            >
              <Text style={styles.menuItemText}>Edit</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                onCloseMenu();
                onDelete();
              }}
            >
              <Text style={[styles.menuItemText, styles.menuDanger]}>
                Delete
              </Text>
            </Pressable>
          </View>
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

  rowOpen: {
    zIndex: 100,
    elevation: 12,
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