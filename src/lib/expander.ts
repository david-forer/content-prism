import { ExpandedInsight, DomainType } from '../types';
import { pickRandom } from './rng';

interface ExpanderConfig {
  idea: string;
  audience: string;
  voice: string;
  domain: DomainType;
  rng: () => number;
}

// Thesis patterns that transform the idea into a strong statement
const thesisPatterns = [
  (idea: string) => `The key to ${idea} is simpler than most people think`,
  (idea: string) => `Most professionals approach ${idea} completely wrong`,
  (idea: string) => `${capitalize(idea)} changes everything when you understand this`,
  (idea: string) => `The real secret behind ${idea} is counterintuitive`,
  (idea: string) => `${capitalize(idea)} is not about what you think`,
  (idea: string) => `The fastest path to ${idea} is often the least obvious`,
];

// Domain-specific bullet patterns
const domainBulletPatterns: Record<DomainType, string[][]> = {
  ops: [
    ['Automate the repetitive parts first', 'Document as you go', 'Build feedback loops into every process'],
    ['Start with your biggest bottleneck', 'Measure before you optimize', 'Small wins compound into big results'],
    ['Systems beat willpower', 'Reduce decisions by creating defaults', 'Review and iterate weekly'],
  ],
  seo: [
    ['Focus on search intent over keywords', 'Quality links beat quantity every time', 'Technical foundations enable content success'],
    ['User experience directly impacts rankings', 'Content clusters outperform single pages', 'Data drives better decisions'],
    ['Speed matters more than you think', 'Mobile-first is non-negotiable', 'Authority builds over time'],
  ],
  ai: [
    ['Start with the problem, not the technology', 'Data quality determines output quality', 'Human oversight remains essential'],
    ['Prompt engineering is the new skill to master', 'Iteration beats perfection', 'Start small and scale what works'],
    ['AI augments, it does not replace expertise', 'Test assumptions with real users', 'Build guardrails early'],
  ],
  general: [
    ['Start before you feel ready', 'Consistency beats intensity', 'Learn from those ahead of you'],
    ['Focus on fundamentals first', 'Measure what matters', 'Share your progress publicly'],
    ['Remove friction wherever possible', 'Build in public for accountability', 'Compound effects take time'],
  ],
};

// Example patterns
const examplePatterns = [
  (idea: string, audience: string) => `Last quarter, I helped a ${audience || 'client'} implement ${idea}. Within 30 days, they saw measurable improvement`,
  (idea: string, audience: string) => `A ${audience || 'team'} I worked with struggled with ${idea} for months. One simple change turned it around`,
  (idea: string) => `I spent 6 months getting ${idea} wrong before I figured out the real approach`,
  (idea: string, audience: string) => `When I first taught ${idea} to a ${audience || 'beginner'}, their questions revealed what actually matters`,
];

// Counterpoint patterns
const counterpointPatterns = [
  (idea: string) => `The common advice about ${idea} focuses on tactics. But strategy matters more`,
  (idea: string) => `Many think ${idea} requires massive effort. The opposite is true when done right`,
  (idea: string) => `Some argue ${idea} is outdated. They are missing the bigger picture`,
  (idea: string) => `The popular approach to ${idea} optimizes for the wrong outcome`,
  (idea: string) => `Experts often overcomplicate ${idea}. Simplicity wins`,
];

// Next step patterns (audience-aware)
const nextStepPatterns = [
  (idea: string, audience: string) => `${audience ? capitalize(audience) + ', try' : 'Try'} this: spend 15 minutes today auditing your current approach to ${idea}`,
  (idea: string, audience: string) => `Your action item: identify one area where ${idea} could improve your ${audience ? audience + ' work' : 'results'} this week`,
  (idea: string) => `Start small: pick one aspect of ${idea} and focus on it for the next 7 days`,
  (idea: string, audience: string) => `${audience ? 'For ' + audience + ': ' : ''}Write down your current ${idea} process. The gaps will become obvious`,
];

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function cleanIdea(idea: string): string {
  // Remove common prefixes and clean up the idea for templates
  return idea
    .replace(/^(how to |why |the |a |an )/i, '')
    .toLowerCase()
    .trim();
}

/**
 * Expand a simple idea into structured components for template generation.
 */
export function expandInsight(config: ExpanderConfig): ExpandedInsight {
  const { idea, audience, domain, rng } = config;
  const cleanedIdea = cleanIdea(idea);

  // Generate thesis
  const thesisPattern = pickRandom(thesisPatterns, rng);
  const thesis = thesisPattern(cleanedIdea);

  // Generate bullets from domain-specific patterns
  const bulletSets = domainBulletPatterns[domain];
  const bullets = pickRandom(bulletSets, rng) as [string, string, string];

  // Generate example
  const examplePattern = pickRandom(examplePatterns, rng);
  const example = examplePattern(cleanedIdea, audience);

  // Generate counterpoint
  const counterpointPattern = pickRandom(counterpointPatterns, rng);
  const counterpoint = counterpointPattern(cleanedIdea);

  // Generate next step
  const nextStepPattern = pickRandom(nextStepPatterns, rng);
  const nextStep = nextStepPattern(cleanedIdea, audience);

  return {
    thesis,
    bullets,
    example,
    counterpoint,
    nextStep,
  };
}
