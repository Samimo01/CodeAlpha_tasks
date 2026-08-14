import { StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import CATEGORIES from "@/data/categories.json";
import { colors, typography } from "@/theme";

/**
 * Component that displays a horizontal scrollable list of category chips.
 * Allows users to select a category to filter quotes.
 * @param {string} activeCategory - The currently selected category
 * @param {Function} onSelect - Callback function called when a category is selected
 */
export function CategoryPicker({ activeCategory, onSelect }) {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category.key;
        return (
          <TouchableOpacity
            key={category.key}
            onPress={() => onSelect(category.key)}
            style={[
              styles.chip,
              isActive ? styles.chipActive : styles.chipInactive,
            ]}
          >
            <Text
              style={[
                typography.label,
                isActive ? styles.chipTextActive : styles.chipTextInactive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginBottom: 24,
    height: 44,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  chip: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  chipInactive: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },

  chipTextActive: {
    color: colors.background,
  },

  chipTextInactive: {
    color: colors.mutedDark,
  },
});