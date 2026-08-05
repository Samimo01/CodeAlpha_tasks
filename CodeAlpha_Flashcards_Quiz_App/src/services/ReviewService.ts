/**
 * Pure, framework-agnostic helpers for the review session.
 */

/** Fisher–Yates shuffle. Returns a new array, does not mutate the input. */
export function shuffle<T>(array: readonly T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Counts the number of correct answers stored in a results map
 * (cardId -> boolean).
 */
export function calculateScore(results: Record<string | number, boolean>): number {
  return Object.values(results).filter(Boolean).length;
}

/** Rounds a raw score to a whole percentage of `total`. */
export function calculatePercentage(score: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((score / total) * 100);
}
