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
  // Keep the last removed quote available for the snackbar's undo action.
  const [removedFavorite, setRemovedFavorite] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Load all favorites from storage
  const loadFavorites = useCallback(async () => {
    const data = await getAll();
    setFavorites(data);
  }, []);

  useEffect(() => {
    if (!context) {
      loadFavorites();
    }
  }, [context, loadFavorites]);

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

  const removeFavorite = useCallback(async (quote) => {
    await toggleFavorite(quote);
    // Store the quote only after the removal has been persisted successfully.
    setRemovedFavorite(quote);
  }, [toggleFavorite]);

  const undoFavorite = useCallback(async () => {
    if (!removedFavorite) {
      return;
    }

    await toggleFavorite(removedFavorite);
    // Clear the pending undo once the quote has been restored.
    setRemovedFavorite(null);
  }, [removedFavorite, toggleFavorite]);

  if (context) {
    const removeFavorite = async (quote) => {
      await context.toggleFavorite(quote);
      setRemovedFavorite(quote);
    };

    const undoFavorite = async () => {
      if (!removedFavorite) {
        return;
      }

      await context.toggleFavorite(removedFavorite);
      setRemovedFavorite(null);
    };

    return {
      ...context,
      removedFavorite,
      removeFavorite,
      undoFavorite,
      clearRemovedFavorite: () => setRemovedFavorite(null),
    };
  }

  // Check if a quote is in the favorites list
  const isFavorite = useCallback(
    (id) => favorites.some((q) => q.id === id),
    [favorites]
  );

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    refresh: loadFavorites,
    removedFavorite,
    removeFavorite,
    undoFavorite,
    clearRemovedFavorite: () => setRemovedFavorite(null),
  };
}