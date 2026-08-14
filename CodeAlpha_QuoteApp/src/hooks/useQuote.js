import { useState, useEffect, useCallback, useRef } from "react";
import { getRandomQuote } from "@/services/quoteService";

/**
 * Custom hook to manage quote fetching and refreshing.
 * Fetches a random quote based on the selected category and provides
 * a refresh function to get a new quote different from the current one.
 * @param {string} category - The category filter for quotes
 * @returns {Object} Object containing quote data, loading state, and refresh function
 */
export function useQuote(category) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentQuoteRef = useRef(null);

  // Fetch a quote from the service based on the category
  const fetchQuote = useCallback(async () => {
    setLoading(true);

    try {
      const newQuote = await getRandomQuote(category);
      setQuote(newQuote);
      currentQuoteRef.current = newQuote;
      
    } catch (error) {
      console.warn("[useQuote] Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      let newQuote = await getRandomQuote(category);
      let attempts = 0;

      // Keep fetching until we get a different quote
      while (newQuote.id === currentQuoteRef.current?.id && attempts < 5) {
        newQuote = await getRandomQuote(category);
        attempts++;
      }

      setQuote(newQuote);
      currentQuoteRef.current = newQuote;

    } catch (error) {
      console.warn("[useQuote] Error refreshing quote:", error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  return { quote, loading, refresh };
}