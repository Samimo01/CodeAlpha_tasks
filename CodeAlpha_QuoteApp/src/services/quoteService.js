import CATEGORIES from "@/data/categories.json";
import QUOTES from "@/data/quotes.json";

/**
 * Check if the provided category is valid.
 * @param {string} category - The category to validate
 * @returns {boolean} True if the category exists, false otherwise
 */
function isValidCategory(category) {
  return CATEGORIES.some((item) => item.key === category);
}

/**
 * Normalize a raw quote object to a consistent format.
 * @param {Object} raw - The raw quote object from data source
 * @returns {Object} Normalized quote object with id, content, author, and tags
 */
function normalizeQuote(raw) {
  return {
    id: raw._id || raw.id,
    content: raw.content,
    author: raw.author,
    tags: raw.tags || [],
  };
}

/**
 * Fetch a random quote from the specified category.
 * Falls back to all quotes if the category is invalid or has no quotes.
 * @param {string} category - The category filter (default: "all")
 * @returns {Promise<Object>} A normalized random quote object
 */
async function getRandomQuote(category = "all") {
  // Validate category and set to 'all' if invalid
  const safeCategory = isValidCategory(category) ? category : "all";

  // Filter quotes by category if not 'all'
  let pool = QUOTES;
  if (safeCategory !== "all") pool = QUOTES.filter((quote) => quote.tags.includes(safeCategory));

  // Fallback to all quotes if filtered pool is empty
  if (pool.length === 0) pool = QUOTES;

  const randomIndex = Math.floor(Math.random() * pool.length);
  return normalizeQuote(pool[randomIndex]);
}

export { getRandomQuote };