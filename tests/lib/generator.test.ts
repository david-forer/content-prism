import { generateDrafts, createSession } from '../../src/lib/generator';
import { SessionInput } from '../../src/types';

const createTestInput = (overrides: Partial<SessionInput> = {}): SessionInput => ({
  idea: 'How to write better documentation',
  audience: 'developers',
  voice: 'professional',
  domain: 'general',
  goal: 'learn',
  length: 'medium',
  selectedAngles: ['story', 'quick-tip', 'mistake'],
  ...overrides,
});

describe('generateDrafts', () => {
  it('generates drafts for all selected angles', () => {
    const input = createTestInput();
    const drafts = generateDrafts({ input, spiceEnabled: false });

    expect(drafts.length).toBe(input.selectedAngles.length);
    expect(drafts.map(d => d.angleKey)).toEqual(input.selectedAngles);
  });

  it('each draft has required fields', () => {
    const input = createTestInput();
    const drafts = generateDrafts({ input, spiceEnabled: false });

    for (const draft of drafts) {
      expect(draft.id).toBeDefined();
      expect(draft.angleKey).toBeDefined();
      expect(draft.text).toBeDefined();
      expect(draft.originalText).toBe(draft.text);
      expect(draft.wordCount).toBeGreaterThan(0);
      expect(draft.readTime).toBeGreaterThanOrEqual(1);
      expect(Array.isArray(draft.healthNotes)).toBe(true);
      expect(draft.isEdited).toBe(false);
      expect(draft.hookStyle).toBeDefined();
    }
  });

  it('produces deterministic output when spice is disabled', () => {
    const input = createTestInput();

    const drafts1 = generateDrafts({ input, spiceEnabled: false });
    const drafts2 = generateDrafts({ input, spiceEnabled: false });

    for (let i = 0; i < drafts1.length; i++) {
      expect(drafts1[i].text).toBe(drafts2[i].text);
    }
  });

  it('produces consistent output for same idea', () => {
    const input1 = createTestInput({ idea: 'specific idea about testing' });
    const input2 = createTestInput({ idea: 'specific idea about testing' });

    const drafts1 = generateDrafts({ input: input1, spiceEnabled: false });
    const drafts2 = generateDrafts({ input: input2, spiceEnabled: false });

    expect(drafts1[0].text).toBe(drafts2[0].text);
  });

  it('produces different output for different ideas', () => {
    const input1 = createTestInput({ idea: 'idea about cats' });
    const input2 = createTestInput({ idea: 'idea about dogs' });

    const drafts1 = generateDrafts({ input: input1, spiceEnabled: false });
    const drafts2 = generateDrafts({ input: input2, spiceEnabled: false });

    expect(drafts1[0].text).not.toBe(drafts2[0].text);
  });

  it('handles empty audience gracefully', () => {
    const input = createTestInput({ audience: '' });
    const drafts = generateDrafts({ input, spiceEnabled: false });

    expect(drafts.length).toBeGreaterThan(0);
    for (const draft of drafts) {
      expect(draft.text.length).toBeGreaterThan(0);
    }
  });

  it('generates different drafts for different angles', () => {
    const input = createTestInput({
      selectedAngles: ['story', 'quick-tip', 'myth', 'tutorial'],
    });
    const drafts = generateDrafts({ input, spiceEnabled: false });

    // All drafts should be unique
    const texts = new Set(drafts.map(d => d.text));
    expect(texts.size).toBe(drafts.length);
  });

  it('respects length constraints', () => {
    const shortInput = createTestInput({ length: 'short', selectedAngles: ['quick-tip'] });
    const longInput = createTestInput({ length: 'long', selectedAngles: ['quick-tip'] });

    const shortDrafts = generateDrafts({ input: shortInput, spiceEnabled: false });
    const longDrafts = generateDrafts({ input: longInput, spiceEnabled: false });

    // Short drafts should generally be shorter than long drafts
    expect(shortDrafts[0].wordCount).toBeLessThanOrEqual(200);
    // Long drafts should allow more content
    expect(longDrafts[0].wordCount).toBeGreaterThanOrEqual(1);
  });
});

describe('createSession', () => {
  it('creates a session with all required fields', () => {
    const input = createTestInput();
    const session = createSession(input, false);

    expect(session.id).toBeDefined();
    expect(session.createdAt).toBeDefined();
    expect(session.updatedAt).toBeDefined();
    expect(session.idea).toBe(input.idea);
    expect(session.audience).toBe(input.audience);
    expect(session.voice).toBe(input.voice);
    expect(session.domain).toBe(input.domain);
    expect(session.goal).toBe(input.goal);
    expect(session.length).toBe(input.length);
    expect(session.selectedAngles).toEqual(input.selectedAngles);
    expect(session.drafts.length).toBe(input.selectedAngles.length);
    expect(session.title).toBeDefined();
  });

  it('generates a title from the idea', () => {
    const input = createTestInput({ idea: 'This is a very long idea that should be truncated' });
    const session = createSession(input, false);

    expect(session.title).toBeDefined();
    expect(session.title!.length).toBeLessThanOrEqual(50);
  });

  it('produces deterministic sessions when spice is disabled', () => {
    const input = createTestInput();

    const session1 = createSession(input, false);
    const session2 = createSession(input, false);

    // IDs and timestamps will differ, but content should be same
    expect(session1.drafts.map(d => d.text)).toEqual(session2.drafts.map(d => d.text));
  });
});
