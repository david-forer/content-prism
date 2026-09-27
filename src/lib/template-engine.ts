import { TemplateContext, ExpandedInsight } from '../types';
import { pickRandom } from './rng';

interface InterpolateOptions {
  template: string;
  context: TemplateContext;
  rng: () => number;
}

/**
 * Interpolate a template string with context values.
 * Supports:
 * - {{variable}} - direct variable replacement
 * - {{insight.field}} - nested insight access
 * - {{pick:a|b|c}} - random selection from options
 * - {{bullets}} - formatted bullet list
 */
export function interpolate(options: InterpolateOptions): string {
  const { template, context, rng } = options;
  let result = template;

  // Replace {{pick:option1|option2|option3}} patterns first
  result = result.replace(/\{\{pick:([^}]+)\}\}/g, (_match, optionsStr: string) => {
    const choices = optionsStr.split('|').map(s => s.trim());
    return pickRandom(choices, rng);
  });

  // Replace {{bullets}} with formatted list
  result = result.replace(/\{\{bullets\}\}/g, () => {
    return context.insight.bullets.map(b => `- ${b}`).join('\n');
  });

  // Replace {{insight.field}} patterns
  result = result.replace(/\{\{insight\.(\w+)\}\}/g, (_match, field: string) => {
    const insight = context.insight as unknown as Record<string, unknown>;
    const value = insight[field];
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value || '');
  });

  // Replace {{variable}} patterns
  result = result.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    if (key === 'insight') return ''; // Skip, handled above
    const value = context[key as keyof TemplateContext];
    if (typeof value === 'object') return '';
    return String(value || '');
  });

  return cleanupText(result);
}

/**
 * Clean up generated text for readability.
 */
function cleanupText(text: string): string {
  return text
    // Remove multiple consecutive blank lines
    .replace(/\n{3,}/g, '\n\n')
    // Remove trailing whitespace on lines
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    // Trim overall
    .trim();
}

/**
 * Get a subset of insight for specific templates.
 */
export function formatInsightForAngle(
  insight: ExpandedInsight,
  angleKey: string
): Partial<ExpandedInsight> {
  // Different angles may emphasize different parts
  switch (angleKey) {
    case 'story':
    case 'failure-story':
    case 'origin-story':
      return { example: insight.example, thesis: insight.thesis };
    case 'mistake':
    case 'expert-trap':
      return { counterpoint: insight.counterpoint, bullets: insight.bullets };
    case 'quick-tip':
    case 'checklist':
      return { bullets: insight.bullets, nextStep: insight.nextStep };
    default:
      return insight;
  }
}
