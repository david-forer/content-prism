import { HookStyle, DomainType } from '../types';
import { pickRandom } from '../lib/rng';

interface HookConfig {
  idea: string;
  audience: string;
  domain: DomainType;
  style: HookStyle;
  rng: () => number;
}

// Hook templates organized by style
const hookTemplates: Record<HookStyle, string[]> = {
  contrast: [
    'You do not have an AI problem.\n\nYou have a systems problem.',
    'Most {{audience}} think {{topic}} is the bottleneck.\n\nIt usually is not.',
    '{{topic}} is not broken.\n\nYour process is.',
    'The reason {{topic}} feels hard?\n\nYou built it on top of chaos.',
    'If {{topic}} feels overwhelming, it is not the tool.\n\nIt is the foundation.',
    'You are not behind on {{topic}}.\n\nYou are overloaded.',
    'Everyone talks about {{topic}}.\n\nBut nobody mentions this:',
    'The conventional wisdom on {{topic}} is wrong.\n\nHere is what actually works:',
    '{{topic}} in 2020: complicated.\n{{topic}} in 2025: simple, if you know this.',
    'I used to think {{topic}} required hours of effort.\n\nTurns out it takes 15 minutes.',
    'Most people overcomplicate {{topic}}.\n\nThe best approach is surprisingly simple.',
    'The difference between struggling with {{topic}} and mastering it?\n\nOne small shift.',
  ],
  curiosity: [
    'I audited a business drowning in {{topic}} last week.\n\nThe real issue surprised them.',
    'After reviewing dozens of {{audience}} setups, I noticed a pattern:',
    'There is a hidden cost inside {{topic}} nobody measures:',
    'The most expensive part of {{topic}} is not what you think.',
    'Something feels off about how {{audience}} approach {{topic}}.',
    'I kept seeing the same mistake around {{topic}} over and over:',
    'I spent 3 years studying {{topic}}.\n\nHere is what surprised me:',
    'What if everything you know about {{topic}} is backwards?',
    'I discovered something about {{topic}} that changed how I work:',
    'There is a pattern in {{topic}} that nobody talks about.',
    'After helping 100+ {{audience}} with {{topic}}, I noticed something:',
    'The question that transformed my understanding of {{topic}}:',
  ],
  contrarian: [
    'You probably should not invest more in {{topic}} right now.',
    'More {{topic}} will not fix your business.',
    'Stop optimizing {{common_focus}}.\n\nIt is distracting you from the real constraint.',
    '{{common_belief}} sounds smart.\n\nIt is usually wrong.',
    'The push to double down on {{topic}} is misguided.',
    'If you are adding more {{topic}}, you might be making things worse.',
    'Stop doing {{common_approach}}.\n\nIt is hurting your results.',
    'The {{topic}} advice you keep hearing is outdated.\n\nHere is the reality:',
    'I am going to say something unpopular about {{topic}}:',
    '{{common_belief}} is a myth.\n\nHere is what the data shows:',
    'Popular {{topic}} advice is optimizing for the wrong thing.',
    'Everyone is focused on {{common_focus}}.\n\nThey should focus on this instead:',
  ],
  story: [
    'Last week, I watched a founder lose 6 hours because of {{topic}}.',
    'A client showed me their {{topic}} setup.\n\nIt looked impressive.\n\nIt was a mess.',
    'I once built a stack around {{topic}} that looked brilliant on paper.',
    'A team told me {{topic}} was saving them time.\n\nIt was not.',
    'I thought adding more {{topic}} would create leverage.\n\nIt created friction.',
    'The moment I realized we were misusing {{topic}}:',
    'Last month, I made a mistake with {{topic}}.\n\nHere is what happened:',
    'A {{audience}} asked me about {{topic}} last week.\n\nMy answer surprised them.',
    '3 years ago, I had no idea how to approach {{topic}}.\n\nThen I discovered this:',
    'I lost an opportunity because I ignored {{topic}}.\n\nNever again.',
    'When I first started with {{topic}}, I got everything wrong.\n\nHere is what I learned:',
    'A conversation about {{topic}} changed my perspective completely:',
  ],
  'direct-benefit': [
    'If you want {{topic}} to actually work, start here:',
    'Here is how to simplify {{topic}} without losing momentum:',
    'A cleaner way to approach {{topic}}:',
    'If {{topic}} feels heavy, do this instead:',
    'How {{audience}} can reduce complexity around {{topic}}:',
    'The simplest way to make {{topic}} produce results:',
    'Want better results with {{topic}}?\n\nHere is exactly how:',
    '5 ways to improve your {{topic}} starting today:',
    'The fastest path to {{topic}} success:',
    'How {{audience}} can master {{topic}} in less time:',
    'A simple framework for {{topic}} that actually works:',
    '{{topic}} does not have to be hard.\n\nHere is your shortcut:',
  ],
};

// Common approaches/beliefs per domain for contrarian hooks
const domainCommonApproaches: Record<DomainType, string[]> = {
  ops: ['tracking everything', 'more meetings', 'complex systems', 'detailed documentation'],
  seo: ['keyword stuffing', 'link building at scale', 'content volume', 'chasing algorithms'],
  ai: ['using AI for everything', 'prompt templates', 'fine-tuning models', 'automation without oversight'],
  general: ['working harder', 'doing more', 'following best practices', 'copying what works for others'],
};

const domainCommonBeliefs: Record<DomainType, string[]> = {
  ops: ['More process means better results', 'You need expensive tools', 'Automation solves everything'],
  seo: ['Content is king', 'Backlinks are everything', 'Rankings equal revenue'],
  ai: ['AI will replace expertise', 'More data is always better', 'AI is plug and play'],
  general: ['Success requires sacrifice', 'You need to specialize early', 'Follow the proven path'],
};

const domainCommonFocus: Record<DomainType, string[]> = {
  ops: ['efficiency metrics', 'tool selection', 'process documentation'],
  seo: ['rankings', 'traffic numbers', 'keyword difficulty'],
  ai: ['model selection', 'prompt engineering', 'automation speed'],
  general: ['tactics', 'shortcuts', 'what others are doing'],
};

function cleanTopic(idea: string): string {
  return idea
    .replace(/^(how to |why |the |a |an )/i, '')
    .toLowerCase()
    .trim();
}

/**
 * Generate a hook based on style and context.
 */
export function generateHook(config: HookConfig): string {
  const { idea, audience, domain, style, rng } = config;

  const templates = hookTemplates[style];
  let template = pickRandom(templates, rng);

  const topic = cleanTopic(idea);
  const audienceLabel = audience || 'professionals';

  // Replace placeholders
  template = template.replace(/\{\{topic\}\}/g, topic);
  template = template.replace(/\{\{audience\}\}/g, audienceLabel);

  // Replace domain-specific placeholders
  if (template.includes('{{common_approach}}')) {
    const approaches = domainCommonApproaches[domain];
    template = template.replace('{{common_approach}}', pickRandom(approaches, rng));
  }

  if (template.includes('{{common_belief}}')) {
    const beliefs = domainCommonBeliefs[domain];
    template = template.replace('{{common_belief}}', pickRandom(beliefs, rng));
  }

  if (template.includes('{{common_focus}}')) {
    const focuses = domainCommonFocus[domain];
    template = template.replace('{{common_focus}}', pickRandom(focuses, rng));
  }

  return template;
}

/**
 * Get all available hook styles.
 */
export function getHookStyles(): HookStyle[] {
  return ['contrast', 'curiosity', 'contrarian', 'story', 'direct-benefit'];
}
