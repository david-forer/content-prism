/**
 * Convert a string to a numeric seed for the RNG.
 * Uses a simple but effective hash function.
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Combine multiple strings into a single hash.
 * Useful for creating deterministic but varied seeds.
 */
export function combineHashes(...strings: string[]): number {
  return hashString(strings.join('|'));
}
