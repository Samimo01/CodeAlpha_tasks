import { useEffect } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, FlatList, Text, ScrollView, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import { Feather } from "@expo/vector-icons";
import { useFavorites } from "@/hooks/useFavorites";
import { colors, typography } from "@/theme";

/**
 * Individual favorite quote card component.
 * Displays a quote with a remove button to delete it from favorites.
 * @param {Object} quote - The quote object to display
 * @param {Function} onRemove - Callback when the remove button is pressed
 */
function FavoriteQuoteCard({ quote, onRemove }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={onRemove}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Remove from favorites"
      >
        <Feather name="x" size={14} color={colors.muted} />
      </TouchableOpacity>
      <Text style={typography.quoteSmall}>{quote.content}</Text>
      <Text style={typography.author}>{quote.author}</Text>
    </View>
  );
}

/**
 * Screen component that displays all favorited quotes.
 * Shows a list of saved quotes with the ability to remove them from favorites.
 * Displays an empty state message when no quotes are favorited.
 */
export function FavoritesScreen() {
  const [fontsLoaded, fontError] = useFonts({ Lora_400Regular_Italic });
  const { favorites, toggleFavorite, refresh } = useFavorites();

  // Refresh favorites list when screen loads
  useEffect(() => {
    refresh();
  }, [refresh]);

  if (fontError) {
    console.error("[FavoritesScreen] Font loading error:", fontError);
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={favorites.length === 0 ? styles.emptyContainer : styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={typography.title}>Favorites</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Feather name="heart" size={28} color={colors.border} />
            <Text style={typography.emptyState}>
              Nothing saved yet. Tap the heart on a quote to keep it here.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <FavoriteQuoteCard
            quote={item}
            onRemove={() => toggleFavorite(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  emptyContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.favoriteCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    paddingRight: 40,
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    marginTop: 40,
  },
  separator: {
    height: 12,
  },
});