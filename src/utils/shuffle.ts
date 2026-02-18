/**
 * Seeded random number generator using mulberry32 algorithm
 * Produces deterministic results given the same seed
 */
function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a numeric seed from a string
 */
function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Shuffle an array using Fisher-Yates algorithm with a seeded RNG
 * @param array The array to shuffle
 * @param seed A string seed for reproducible shuffling
 * @returns A new shuffled array (does not mutate original)
 */
export function shuffleWithSeed<T>(array: T[], seed: string): T[] {
  const result = [...array];
  const random = mulberry32(stringToSeed(seed));

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Generate a random seed string
 */
export function generateRandomSeed(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
