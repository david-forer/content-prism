import { hashString, combineHashes } from './hash';

/**
 * Mulberry32 - a fast, high-quality 32-bit PRNG.
 * Creates a seeded random number generator that produces
 * consistent sequences for the same seed.
 */
export function createRng(seed: number): () => number {
  let state = seed;
  return function(): number {
    let t = state += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Create a deterministic RNG seeded from an idea string.
 * Optionally add a salt for variation (e.g., angle key).
 */
export function createIdeaRng(idea: string, salt: string = ''): () => number {
  const seed = salt ? combineHashes(idea, salt) : hashString(idea);
  return createRng(seed);
}

/**
 * Create an RNG that varies based on spice mode.
 * When spice is enabled, adds timestamp-based variation.
 * When disabled, output is fully deterministic per idea.
 */
export function createSpicedRng(idea: string, spiceEnabled: boolean): () => number {
  if (spiceEnabled) {
    // Use minute-level timestamp for some variation but not chaotic
    const timeSalt = Math.floor(Date.now() / 60000).toString();
    return createIdeaRng(idea, timeSalt);
  }
  return createIdeaRng(idea);
}

/**
 * Pick a random item from an array using the provided RNG.
 */
export function pickRandom<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * Pick multiple unique random items from an array.
 */
export function pickMultiple<T>(arr: readonly T[], count: number, rng: () => number): T[] {
  const shuffled = shuffleArray([...arr], rng);
  return shuffled.slice(0, Math.min(count, arr.length));
}

/**
 * Shuffle an array deterministically using the provided RNG.
 */
export function shuffleArray<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate a random integer in range [min, max] inclusive.
 */
export function randomInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}
