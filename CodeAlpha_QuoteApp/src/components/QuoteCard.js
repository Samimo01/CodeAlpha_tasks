import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography } from "@/theme";

/**
 * Component to display a quote card with author and favorite button.
 * Shows the quote content, author name, and a heart icon to toggle favorite status.
 * @param {Object} quote - The quote object containing content and author
 * @param {boolean} isFavorite - Whether the quote is currently favorited
 * @param {Function} onToggleFavorite - Callback function to toggle favorite status
 * @param {Object} style - Additional styles to apply to the container
 */
export function QuoteCard({ quote, isFavorite, onToggleFavorite, style }) {
  if (!quote) return null;

  return (
    <View style={[styles.container, style]}>
      <Text style={typography.quote}>{quote.content}</Text>

      <View style={styles.authorContainer}>
        <View style={styles.divider} />
        <Text style={typography.author}>{quote.author}</Text>
        <View style={styles.divider} />
      </View>
      
      <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={30}
          color={isFavorite ? colors.accent : colors.muted}
          style={{ opacity: isFavorite ? 1 : 0.7 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  divider: {
    width: 24,
    height: 1,
    backgroundColor: colors.accent,
  },
  favoriteButton: {
    position: "absolute",
    bottom: 8,
    right: 4,
  },
});