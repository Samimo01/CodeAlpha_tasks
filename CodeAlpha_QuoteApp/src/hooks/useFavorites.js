import { useState, useEffect, useCallback, useContext } from "react";
import { FavoritesContext } from "@/context/FavoritesContext";
import { getAll, toggle } from "@/repositories/FavoritesRepository";

/**
 * Custom hook to manage favorite quotes.
 * Provides functionality to load, toggle, and check favorite status of quotes.
 * Uses FavoritesContext if available, otherwise manages state locally.
 * @returns {Object} Object containing favorites array, toggle function, and isFavorite check
 */
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context) {
    return context;
  }

  const [favorites, setFavorites] = useState([]);

  // Load all favorites from storage
  const loadFavorites = useCallback(async () => {
    const data = await getAll();
    setFavorites(data);
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = useCallback(async (quote) => {
    const newFavoriteState = await toggle(quote);
    setFavorites((prev) => {
      // Add quote if it's now favorited, remove if unfavorited
      if (newFavoriteState) {
        return prev.some((q) => q.id === quote.id) ? prev : [...prev, quote];
      }
      return prev.filter((q) => q.id !== quote.id);
    });
    
    return newFavoriteState;
  }, []);

  // Check if a quote is in the favorites list
  const isFavorite = useCallback(
    (id) => favorites.some((q) => q.id === id),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, refresh: loadFavorites };
}