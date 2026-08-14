import { useState } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Text } from "react-native";
import { useFonts } from "expo-font";
import { Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import { useQuote } from "@/hooks/useQuote";
import { useFavorites } from "@/hooks/useFavorites";
import { QuoteCard } from "@/components/QuoteCard";
import { CategoryPicker } from "@/components/CategoryPicker";
import { NewQuoteButton } from "@/components/NewQuoteButton";
import { colors, typography } from "@/theme";

/**
 * Main home screen component.
 * Displays the daily quote, category filter, and option to get new quotes.
 * Users can view quotes by category and mark them as favorites.
 */
export function HomeScreen() {
  const [fontsLoaded, fontError] = useFonts({ Lora_400Regular_Italic });
  const [activeCategory, setActiveCategory] = useState("all");

  const { quote, loading, refresh } = useQuote(activeCategory);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Handle font loading errors
  if (fontError) console.error("[HomeScreen] Font loading error:", fontError);
  if (!fontsLoaded && !fontError) return null;

  // Update the active category when user selects a new one
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Toggle favorite status of the current quote
  const handleToggleFavorite = () => {
    if (quote) {
      toggleFavorite(quote);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={typography.title}>Quotidian</Text>
          <Text style={styles.subtitle}>DAILY QUOTES</Text>
        </View>

        <CategoryPicker activeCategory={activeCategory} onSelect={handleCategoryChange} />

        <View style={styles.quoteCardContainer}>
          <QuoteCard
            quote={quote}
            isFavorite={quote ? isFavorite(quote.id) : false}
            onToggleFavorite={handleToggleFavorite}
          />
          {loading && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingIndicator} />
            </View>
          )}
        </View>

        <NewQuoteButton onPress={refresh} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 10,
    letterSpacing: 2,
    color: colors.muted,
    textTransform: "uppercase",
    fontFamily: "System",
  },
  quoteCardContainer: {
    flex: 1,
    minHeight: 280,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginVertical: 16,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicator: {
    // ActivityIndicator is rendered inside
  },
});