import { HealthNote, LengthType, LENGTH_TARGETS } from '../types';
import { bannedPhrases } from '../data/ban-list';

interface HealthCheckInput {
  text: string;
  targetLength: LengthType;
}

/**
 * Count words in text.
 */
export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length;
}

/**
 * Calculate estimated read time in minutes.
 * Average reading speed: ~200 words per minute.
 */
export function calculateReadTime(text: string): number {
  const words = countWords(text);
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Check draft health and return notes.
 */
export function checkHealth(input: HealthCheckInput): HealthNote[] {
  const { text, targetLength } = input;
  const notes: HealthNote[] = [];
  const wordCount = countWords(text);
  const lines = text.split('\n').filter(l => l.trim());
  const target = LENGTH_TARGETS[targetLength];

  // Length checks
  if (wordCount < target.min) {
    notes.push({
      type: 'warning',
      message: `Too short (${wordCount} words, target: ${target.min}-${target.max})`,
      field: 'length',
    });
  } else if (wordCount > target.max) {
    notes.push({
      type: 'warning',
      message: `Too long (${wordCount} words, target: ${target.min}-${target.max})`,
      field: 'length',
    });
  } else {
    notes.push({
      type: 'success',
      message: `Good length (${wordCount} words)`,
      field: 'length',
    });
  }

  // Hook check (first 2 lines should be under 210 chars for LinkedIn preview)
  if (lines.length >= 2) {
    const hookLength = lines.slice(0, 2).join(' ').length;
    if (hookLength > 210) {
      notes.push({
        type: 'info',
        message: 'Hook may be cut off in LinkedIn preview (>210 chars)',
        field: 'hook',
      });
    }
  }

  // Banned phrases check
  const lowerText = text.toLowerCase();
  const foundBanned: string[] = [];
  for (const { phrase, suggestion } of bannedPhrases) {
    if (lowerText.includes(phrase.toLowerCase())) {
      const msg = suggestion
        ? `Contains "${phrase}". Try: "${suggestion}"`
        : `Contains overused phrase: "${phrase}"`;
      foundBanned.push(msg);
    }
  }
  if (foundBanned.length > 0) {
    notes.push({
      type: 'warning',
      message: foundBanned.slice(0, 2).join('; '),
      field: 'content',
    });
  }

  // CTA check
  const lastPortion = text.slice(-300).toLowerCase();
  const hasCTA = /(\?|comment|share|follow|dm|message|link|save|download|try|start|join)/i.test(lastPortion);
  if (!hasCTA) {
    notes.push({
      type: 'info',
      message: 'Consider adding a clearer call-to-action',
      field: 'cta',
    });
  }

  // Readability check (avg sentence length)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 0) {
    const avgSentenceLength = wordCount / sentences.length;
    if (avgSentenceLength > 25) {
      notes.push({
        type: 'warning',
        message: 'Sentences may be too long. Try breaking them up.',
        field: 'readability',
      });
    }
  }

  // Check for bullet points (good for LinkedIn)
  const hasBullets = text.includes('- ') || text.includes('• ');
  if (!hasBullets && wordCount > 100) {
    notes.push({
      type: 'info',
      message: 'Consider adding bullet points for scannability',
      field: 'structure',
    });
  }

  return notes;
}
