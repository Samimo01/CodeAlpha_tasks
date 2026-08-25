import { useEffect, useRef, useState } from "react";
import { Animated, View, StyleSheet, SafeAreaView, StatusBar, FlatList, Text, TouchableOpacity } from "react-native";
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

function FavoritesSnackbar({ onUndo, animation }) {
  // The snackbar stays mounted while its opacity and position are animated.
  return (
    <Animated.View
      style={[
        styles.snackbar,
        {
          opacity: animation,
          transform: [{ translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
        },
      ]}
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.snackbarText}>Quote removed from favorites</Text>
      <TouchableOpacity
        onPress={onUndo}
        style={styles.undoButton}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Undo removing quote"
      >
        <Text style={styles.undoText}>UNDO</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

/**
 * Screen component that displays all favorited quotes.
 * Shows a list of saved quotes with the ability to remove them from favorites.
 * Displays an empty state message when no quotes are favorited.
 */
export function FavoritesScreen() {
  const [fontsLoaded, fontError] = useFonts({ Lora_400Regular_Italic });
  const {
    favorites,
    refresh,
    removedFavorite,
    removeFavorite,
    undoFavorite,
    clearRemovedFavorite,
  } = useFavorites();
  const snackbarTimeout = useRef(null);
  const snackbarAnimation = useRef(new Animated.Value(0)).current;
  const dismissingSnackbar = useRef(false);

  // Refresh favorites list when screen loads
  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!removedFavorite) {
      return undefined;
    }

    dismissingSnackbar.current = false;
    // Animate each new snackbar into view and start its auto-dismiss timer.
    Animated.timing(snackbarAnimation, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();

    snackbarTimeout.current = setTimeout(dismissSnackbar, 4000);

    return () => clearTimeout(snackbarTimeout.current);
  }, [removedFavorite, snackbarAnimation]);

  const dismissSnackbar = (onDismiss) => {
    if (dismissingSnackbar.current) {
      return;
    }

    dismissingSnackbar.current = true;
    clearTimeout(snackbarTimeout.current);
    // Finish the exit animation before removing the snackbar from the tree.
    Animated.timing(snackbarAnimation, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        clearRemovedFavorite();
        dismissingSnackbar.current = false;
        onDismiss?.();
      }
    });
  };

  const handleRemove = async (quote) => {
    await removeFavorite(quote);
  };

  const handleUndo = async () => {
    if (!removedFavorite) {
      return;
    }

    dismissSnackbar(undoFavorite);
  };

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
            onRemove={() => handleRemove(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      {removedFavorite && <FavoritesSnackbar onUndo={handleUndo} animation={snackbarAnimation} />}
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
  snackbar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    minHeight: 52,
    paddingLeft: 16,
    paddingRight: 8,
    borderRadius: 8,
    backgroundColor: colors.favoriteCard,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  snackbarText: {
    color: colors.ink,
    fontSize: 14,
    flex: 1,
  },
  undoButton: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  undoText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
});