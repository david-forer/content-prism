import { checkHealth, countWords, calculateReadTime } from '../../src/lib/health-checker';

describe('countWords', () => {
  it('counts words correctly', () => {
    expect(countWords('hello world')).toBe(2);
    expect(countWords('one two three four five')).toBe(5);
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
  });

  it('handles multiple spaces', () => {
    expect(countWords('hello    world')).toBe(2);
    expect(countWords('  hello  world  ')).toBe(2);
  });

  it('handles newlines', () => {
    expect(countWords('hello\nworld')).toBe(2);
    expect(countWords('one\ntwo\nthree')).toBe(3);
  });
});

describe('calculateReadTime', () => {
  it('calculates read time based on word count', () => {
    // 200 words per minute
    expect(calculateReadTime('word '.repeat(200))).toBe(1);
    expect(calculateReadTime('word '.repeat(400))).toBe(2);
    expect(calculateReadTime('word '.repeat(50))).toBe(1); // minimum 1 minute
  });

  it('returns at least 1 minute', () => {
    expect(calculateReadTime('')).toBe(1);
    expect(calculateReadTime('short')).toBe(1);
  });
});

describe('checkHealth', () => {
  it('flags content that is too short', () => {
    const notes = checkHealth({
      text: 'This is very short.',
      targetLength: 'medium',
    });

    const warning = notes.find(n => n.type === 'warning' && n.field === 'length');
    expect(warning).toBeDefined();
    expect(warning?.message).toContain('short');
  });

  it('flags content that is too long', () => {
    const longText = 'word '.repeat(400); // 400 words
    const notes = checkHealth({
      text: longText,
      targetLength: 'short',
    });

    const warning = notes.find(n => n.type === 'warning' && n.field === 'length');
    expect(warning).toBeDefined();
    expect(warning?.message).toContain('long');
  });

  it('marks good length as success', () => {
    const mediumText = 'word '.repeat(300); // 300 words (within 220-380 range)
    const notes = checkHealth({
      text: mediumText,
      targetLength: 'medium',
    });

    const success = notes.find(n => n.type === 'success' && n.field === 'length');
    expect(success).toBeDefined();
  });

  it('detects banned phrases', () => {
    const textWithBannedPhrase = 'This is a game changer for your business.';
    const notes = checkHealth({
      text: textWithBannedPhrase,
      targetLength: 'medium',
    });

    const warning = notes.find(n => n.type === 'warning' && n.field === 'content');
    expect(warning).toBeDefined();
    expect(warning?.message).toContain('game changer');
  });

  it('suggests CTA when missing', () => {
    const textWithoutCTA = 'This is some content without any call to action. '.repeat(10);
    const notes = checkHealth({
      text: textWithoutCTA,
      targetLength: 'medium',
    });

    const info = notes.find(n => n.type === 'info' && n.field === 'cta');
    expect(info).toBeDefined();
  });

  it('does not flag CTA when present', () => {
    const textWithCTA = 'This is content. What do you think? Comment below and share your thoughts.';
    const notes = checkHealth({
      text: textWithCTA,
      targetLength: 'short',
    });

    const ctaNote = notes.find(n => n.field === 'cta');
    expect(ctaNote).toBeUndefined();
  });

  it('warns about long sentences', () => {
    const longSentence = 'This is a very long sentence that goes on and on and on without any punctuation or breaks and it just keeps going and going which makes it very hard to read and understand what the author is trying to say.';
    const notes = checkHealth({
      text: longSentence,
      targetLength: 'medium',
    });

    const warning = notes.find(n => n.type === 'warning' && n.field === 'readability');
    expect(warning).toBeDefined();
  });

  it('suggests bullet points for longer content', () => {
    const textWithoutBullets = 'word '.repeat(120);
    const notes = checkHealth({
      text: textWithoutBullets,
      targetLength: 'medium',
    });

    const info = notes.find(n => n.type === 'info' && n.field === 'structure');
    expect(info).toBeDefined();
    expect(info?.message).toContain('bullet');
  });

  it('does not suggest bullets when present', () => {
    const textWithBullets = 'Here are some points:\n- Point one\n- Point two\n- Point three';
    const notes = checkHealth({
      text: textWithBullets,
      targetLength: 'short',
    });

    const bulletNote = notes.find(n => n.field === 'structure');
    expect(bulletNote).toBeUndefined();
  });
});
