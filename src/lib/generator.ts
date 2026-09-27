import { Draft, Session, SessionInput, HookStyle, ExpandedInsight, TemplateContext, LengthType } from '../types';
import { angles, getAngleByKey } from '../data/angles';
import { angleTemplates } from '../data/templates';
import { generateHook } from '../data/hooks';
import { generateCTA } from '../data/ctas';
import { createSpicedRng, createIdeaRng } from './rng';
import { expandInsight } from './expander';
import { interpolate } from './template-engine';
import { checkHealth, countWords, calculateReadTime } from './health-checker';

function generateId(): string {
  return crypto.randomUUID();
}

interface GenerateOptions {
  input: SessionInput;
  spiceEnabled: boolean;
  hookStyle?: HookStyle;
}

/**
 * Generate drafts for all selected angles.
 */
export function generateDrafts(options: GenerateOptions): Draft[] {
  const { input, spiceEnabled, hookStyle } = options;

  // Create base RNG from idea
  const baseRng = createSpicedRng(input.idea, spiceEnabled);

  // Expand insight once (used by all angles)
  const insight = expandInsight({
    idea: input.idea,
    audience: input.audience,
    voice: input.voice,
    domain: input.domain,
    rng: baseRng,
  });

  // Generate draft for each selected angle
  return input.selectedAngles.map(angleKey => {
    return generateSingleDraft({
      input,
      angleKey,
      insight,
      spiceEnabled,
      hookStyle,
    });
  });
}

interface SingleDraftOptions {
  input: SessionInput;
  angleKey: string;
  insight: ExpandedInsight;
  spiceEnabled: boolean;
  hookStyle?: HookStyle;
}

/**
 * Generate a single draft for a specific angle.
 */
export function generateSingleDraft(options: SingleDraftOptions): Draft {
  const { input, angleKey, insight, spiceEnabled, hookStyle } = options;

  // Create angle-specific RNG
  const angleRng = spiceEnabled
    ? createSpicedRng(input.idea + angleKey, true)
    : createIdeaRng(input.idea, angleKey);

  // Determine hook style
  const selectedHookStyle = hookStyle || selectHookStyle(angleKey, angleRng);

  // Generate hook
  const hook = generateHook({
    idea: input.idea,
    audience: input.audience,
    domain: input.domain,
    style: selectedHookStyle,
    rng: angleRng,
  });

  // Generate CTA
  const cta = generateCTA({
    goal: input.goal,
    audience: input.audience,
    rng: angleRng,
  });

  // Build template context
  const context: TemplateContext = {
    idea: input.idea,
    audience: input.audience,
    voice: input.voice,
    domain: input.domain,
    goal: input.goal,
    length: input.length,
    insight,
    hook,
    cta,
  };

  // Get angle template
  const template = angleTemplates[angleKey] || angleTemplates['quick-tip'];

  // Interpolate template
  let text = interpolate({ template, context, rng: angleRng });

  // Apply length constraints
  text = applyLengthConstraints(text, input.length);

  // Check health
  const healthNotes = checkHealth({ text, targetLength: input.length });

  return {
    id: generateId(),
    angleKey,
    text,
    originalText: text,
    wordCount: countWords(text),
    readTime: calculateReadTime(text),
    healthNotes,
    isEdited: false,
    hookStyle: selectedHookStyle,
  };
}

/**
 * Select an appropriate hook style based on angle.
 */
function selectHookStyle(angleKey: string, rng: () => number): HookStyle {
  // Some angles naturally fit certain hook styles
  const angleHookMap: Record<string, HookStyle[]> = {
    'story': ['story', 'curiosity'],
    'failure-story': ['story', 'contrast'],
    'origin-story': ['story'],
    'mistake': ['contrast', 'story'],
    'myth': ['contrarian', 'contrast'],
    'contrarian': ['contrarian'],
    'industry-lie': ['contrarian', 'contrast'],
    'quick-tip': ['direct-benefit', 'curiosity'],
    'tutorial': ['direct-benefit', 'curiosity'],
    'checklist': ['direct-benefit'],
    'before-after': ['contrast', 'story'],
  };

  const preferredStyles = angleHookMap[angleKey] || ['contrast', 'curiosity', 'direct-benefit'];
  const index = Math.floor(rng() * preferredStyles.length);
  return preferredStyles[index];
}

/**
 * Apply length constraints to generated text.
 */
function applyLengthConstraints(text: string, length: LengthType): string {
  const words = text.split(/\s+/);
  const targets: Record<LengthType, number> = {
    'ultra-short': 75,
    short: 150,
    medium: 300,
    long: 450,
  };

  const targetWords = targets[length];

  if (words.length <= targetWords) {
    return text;
  }

  // Truncate at sentence boundary near target
  let currentCount = 0;
  const sentences = text.split(/(?<=[.!?])\s+/);
  const keptSentences: string[] = [];

  for (const sentence of sentences) {
    const sentenceWords = sentence.split(/\s+/).length;
    if (currentCount + sentenceWords > targetWords && keptSentences.length > 0) {
      break;
    }
    keptSentences.push(sentence);
    currentCount += sentenceWords;
  }

  return keptSentences.join(' ');
}

/**
 * Create a new session with generated drafts.
 */
export function createSession(input: SessionInput, spiceEnabled: boolean): Session {
  const drafts = generateDrafts({ input, spiceEnabled });
  const now = new Date().toISOString();

  return {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    ...input,
    drafts,
    title: generateSessionTitle(input.idea),
  };
}

/**
 * Generate a short title from the idea.
 */
function generateSessionTitle(idea: string): string {
  const words = idea.split(/\s+/).slice(0, 5);
  let title = words.join(' ');
  if (idea.split(/\s+/).length > 5) {
    title += '...';
  }
  return title;
}

/**
 * Regenerate a single draft with a new hook style.
 */
export function regenerateDraft(
  session: Session,
  draftId: string,
  spiceEnabled: boolean,
  newHookStyle?: HookStyle
): Draft | null {
  const draft = session.drafts.find(d => d.id === draftId);
  if (!draft) return null;

  // Re-expand insight
  const baseRng = createSpicedRng(session.idea, spiceEnabled);
  const insight = expandInsight({
    idea: session.idea,
    audience: session.audience,
    voice: session.voice,
    domain: session.domain,
    rng: baseRng,
  });

  return generateSingleDraft({
    input: {
      idea: session.idea,
      audience: session.audience,
      voice: session.voice,
      domain: session.domain,
      goal: session.goal,
      length: session.length,
      inputMode: session.inputMode || 'idea',
      selectedAngles: session.selectedAngles,
    },
    angleKey: draft.angleKey,
    insight,
    spiceEnabled,
    hookStyle: newHookStyle || draft.hookStyle,
  });
}

/**
 * Get all available angles.
 */
export function getAvailableAngles() {
  return angles;
}

export { getAngleByKey };
