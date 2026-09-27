import { createRng, createIdeaRng, pickRandom, shuffleArray, randomInt } from '../../src/lib/rng';
import { hashString, combineHashes } from '../../src/lib/hash';

describe('hashString', () => {
  it('produces consistent hash for same input', () => {
    expect(hashString('test idea')).toBe(hashString('test idea'));
    expect(hashString('another idea')).toBe(hashString('another idea'));
  });

  it('produces different hashes for different inputs', () => {
    expect(hashString('test idea')).not.toBe(hashString('different idea'));
    expect(hashString('abc')).not.toBe(hashString('cba'));
  });

  it('handles empty string', () => {
    expect(hashString('')).toBe(0);
  });

  it('handles special characters', () => {
    const hash = hashString('test with spaces and !@#$%');
    expect(typeof hash).toBe('number');
    expect(hash).toBeGreaterThanOrEqual(0);
  });
});

describe('combineHashes', () => {
  it('combines multiple strings into a hash', () => {
    const hash = combineHashes('idea', 'angle', 'salt');
    expect(typeof hash).toBe('number');
    expect(hash).toBeGreaterThanOrEqual(0);
  });

  it('produces different results for different orders', () => {
    expect(combineHashes('a', 'b')).not.toBe(combineHashes('b', 'a'));
  });
});

describe('createRng (Mulberry32)', () => {
  it('produces same sequence for same seed', () => {
    const rng1 = createRng(12345);
    const rng2 = createRng(12345);

    const seq1 = [rng1(), rng1(), rng1(), rng1(), rng1()];
    const seq2 = [rng2(), rng2(), rng2(), rng2(), rng2()];

    expect(seq1).toEqual(seq2);
  });

  it('produces different sequences for different seeds', () => {
    const rng1 = createRng(12345);
    const rng2 = createRng(54321);

    expect(rng1()).not.toBe(rng2());
  });

  it('produces numbers between 0 and 1', () => {
    const rng = createRng(42);
    for (let i = 0; i < 100; i++) {
      const n = rng();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });

  it('produces good distribution', () => {
    const rng = createRng(999);
    const buckets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < 10000; i++) {
      const bucket = Math.floor(rng() * 10);
      buckets[bucket]++;
    }

    // Each bucket should have roughly 1000 items (10% tolerance)
    for (const count of buckets) {
      expect(count).toBeGreaterThan(800);
      expect(count).toBeLessThan(1200);
    }
  });
});

describe('createIdeaRng', () => {
  it('produces consistent RNG for same idea', () => {
    const rng1 = createIdeaRng('my test idea');
    const rng2 = createIdeaRng('my test idea');

    expect([rng1(), rng1(), rng1()]).toEqual([rng2(), rng2(), rng2()]);
  });

  it('produces different RNG for different ideas', () => {
    const rng1 = createIdeaRng('idea one');
    const rng2 = createIdeaRng('idea two');

    expect(rng1()).not.toBe(rng2());
  });

  it('salt changes the sequence', () => {
    const rng1 = createIdeaRng('my idea');
    const rng2 = createIdeaRng('my idea', 'salt');

    expect(rng1()).not.toBe(rng2());
  });

  it('same salt produces same sequence', () => {
    const rng1 = createIdeaRng('my idea', 'story');
    const rng2 = createIdeaRng('my idea', 'story');

    expect([rng1(), rng1()]).toEqual([rng2(), rng2()]);
  });
});

describe('pickRandom', () => {
  it('picks from array', () => {
    const rng = createRng(42);
    const arr = ['a', 'b', 'c', 'd', 'e'];
    const picked = pickRandom(arr, rng);

    expect(arr).toContain(picked);
  });

  it('is deterministic with same RNG', () => {
    const arr = ['apple', 'banana', 'cherry'];

    const rng1 = createRng(123);
    const rng2 = createRng(123);

    expect(pickRandom(arr, rng1)).toBe(pickRandom(arr, rng2));
  });

  it('distributes evenly over many picks', () => {
    const rng = createRng(1000);
    const arr = ['a', 'b', 'c'];
    const counts: Record<string, number> = { a: 0, b: 0, c: 0 };

    for (let i = 0; i < 9000; i++) {
      counts[pickRandom(arr, rng)]++;
    }

    // Each should be picked roughly 3000 times
    expect(counts.a).toBeGreaterThan(2500);
    expect(counts.b).toBeGreaterThan(2500);
    expect(counts.c).toBeGreaterThan(2500);
  });
});

describe('shuffleArray', () => {
  it('returns array of same length', () => {
    const rng = createRng(42);
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr, rng);

    expect(shuffled.length).toBe(arr.length);
  });

  it('contains all original elements', () => {
    const rng = createRng(42);
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr, rng);

    expect(shuffled.sort()).toEqual(arr.sort());
  });

  it('does not modify original array', () => {
    const rng = createRng(42);
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    shuffleArray(arr, rng);

    expect(arr).toEqual(original);
  });

  it('is deterministic with same RNG', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const rng1 = createRng(777);
    const rng2 = createRng(777);

    expect(shuffleArray(arr, rng1)).toEqual(shuffleArray(arr, rng2));
  });
});

describe('randomInt', () => {
  it('produces integers in range', () => {
    const rng = createRng(42);

    for (let i = 0; i < 100; i++) {
      const n = randomInt(5, 10, rng);
      expect(n).toBeGreaterThanOrEqual(5);
      expect(n).toBeLessThanOrEqual(10);
      expect(Number.isInteger(n)).toBe(true);
    }
  });

  it('is deterministic', () => {
    const rng1 = createRng(42);
    const rng2 = createRng(42);

    expect(randomInt(1, 100, rng1)).toBe(randomInt(1, 100, rng2));
  });
});
