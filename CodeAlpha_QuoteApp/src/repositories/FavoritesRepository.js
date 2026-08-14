import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage key for persisting favorites to device storage
// const STORAGE_KEY = "@quoteapp/favorites";

/**
 * Retrieve all favorite quotes from storage.
 * @returns {Promise<Array>} Array of favorite quote objects
 */
export async function getAll() {
  try {
    const stored = await AsyncStorage.getItem(process.env.EXPO_PUBLIC_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];

  } catch (error) {
    console.warn("[FavoritesRepository] Failed to get favorites:", error);
    return [];
  }
}

/**
 * Add a quote to favorites if it doesn't already exist.
 * @param {Object} quote - The quote object to add
 */
export async function add(quote) {
  try {
    const current = await getAll();
    const exists = current.some((q) => q.id === quote.id);

    // Only add if not already favorited
    if (!exists) {
      const updated = [...current, quote];
      await AsyncStorage.setItem(process.env.EXPO_PUBLIC_STORAGE_KEY, JSON.stringify(updated));
    }

  } catch (error) {
    console.warn("[FavoritesRepository] Failed to add favorite:", error);
  }
}

/**
 * Remove a quote from favorites by its ID.
 * @param {string} id - The ID of the quote to remove
 */
export async function remove(id) {
  try {
    const current = await getAll();
    const updated = current.filter((q) => q.id !== id);
    await AsyncStorage.setItem(process.env.EXPO_PUBLIC_STORAGE_KEY, JSON.stringify(updated));

  } catch (error) {
    console.warn("[FavoritesRepository] Failed to remove favorite:", error);
  }
}

/**
 * Check if a quote is in the favorites list.
 * @param {string} id - The ID of the quote to check
 * @returns {Promise<boolean>} True if the quote is favorited, false otherwise
 */
export async function isFavorite(id) {
  try {
    const current = await getAll();
    return current.some((q) => q.id === id);

  } catch (error) {
    console.warn("[FavoritesRepository] Failed to check favorite:", error);
    return false;
  }
}

/**
 * Toggle the favorite status of a quote (add if not favorited, remove if favorited).
 * @param {Object} quote - The quote object to toggle
 * @returns {Promise<boolean>} The new favorite state (true if now favorited, false if removed)
 */
export async function toggle(quote) {
  const favorite = await isFavorite(quote.id);

  // Toggle between add and remove
  favorite ? await remove(quote.id) : await add(quote);

  return !favorite;
}