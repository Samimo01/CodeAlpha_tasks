import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getAll, toggle } from "@/repositories/FavoritesRepository";

export const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

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
      if (newFavoriteState) {
        return prev.some((q) => q.id === quote.id) ? prev : [...prev, quote];
      }
      return prev.filter((q) => q.id !== quote.id);
    });
    
    return newFavoriteState;
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.some((q) => q.id === id),
    [favorites]
  );

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    refresh: loadFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavoritesContext must be used within a FavoritesProvider");
  }
  return context;
}