export type HookStyle =
  | 'contrast'
  | 'curiosity'
  | 'contrarian'
  | 'story'
  | 'direct-benefit';

export type GoalType =
  | 'learn'
  | 'save'
  | 'share'
  | 'follow'
  | 'dm'
  | 'buy';

export type DomainType = 'ops' | 'seo' | 'ai' | 'general';

export type LengthType = 'ultra-short' | 'short' | 'medium' | 'long';

export interface ExpandedInsight {
  thesis: string;
  bullets: [string, string, string];
  example: string;
  counterpoint: string;
  nextStep: string;
}

export interface TemplateContext {
  idea: string;
  audience: string;
  voice: string;
  domain: DomainType;
  goal: GoalType;
  length: LengthType;
  insight: ExpandedInsight;
  hook: string;
  cta: string;
}

export const HOOK_STYLE_LABELS: Record<HookStyle, string> = {
  contrast: 'Contrast',
  curiosity: 'Curiosity',
  contrarian: 'Contrarian',
  story: 'Story',
  'direct-benefit': 'Direct Benefit',
};

export const GOAL_LABELS: Record<GoalType, string> = {
  learn: 'Clarify Thinking',
  save: 'Reference Later',
  share: 'Spark Conversation',
  follow: 'Build Ongoing Trust',
  dm: 'Start a Conversation',
  buy: 'Take Action',
};

export const DOMAIN_LABELS: Record<DomainType, string> = {
  ops: 'Operations',
  seo: 'SEO',
  ai: 'AI',
  general: 'General',
};

export const LENGTH_LABELS: Record<LengthType, string> = {
  'ultra-short': 'Comment (~75 words)',
  short: 'Short (~150 words)',
  medium: 'Medium (~300 words)',
  long: 'Long (~450 words)',
};

export const LENGTH_TARGETS: Record<LengthType, { min: number; max: number }> = {
  'ultra-short': { min: 40, max: 100 },
  short: { min: 120, max: 200 },
  medium: { min: 220, max: 380 },
  long: { min: 350, max: 550 },
};
