import { Angle, AngleCategory, CATEGORY_ORDER } from '../types';

export const angles: Angle[] = [

  // ============================
  // BASE ANGLES (8) – High-Leverage Core Rotation
  // These should be your default auto-checked angles.
  // They create real structural and psychological variation.
  // ============================

  {
    key: 'contrarian',
    name: 'Contrarian',
    category: 'base',
    description: 'Take a strong stance directly against mainstream advice',
  },
  {
    key: 'story',
    name: 'Story',
    category: 'base',
    description: 'Tell one specific real scenario in detail, then extract a single insight',
  },
  {
    key: 'checklist',
    name: 'Checklist',
    category: 'base',
    description: 'Provide a structured checklist with specific evaluation points',
  },
  {
    key: 'business-impact',
    name: 'Business Impact',
    category: 'base',
    description: 'Tie the topic directly to revenue, cost, or measurable outcomes',
  },
  {
    key: 'failure-story',
    name: 'Failure Story',
    category: 'base',
    description: 'Describe a real failure and what changed afterward',
  },
  {
    key: 'mental-model',
    name: 'Mental Model',
    category: 'base',
    description: 'Introduce a named framework that changes how the topic is viewed',
  },
  {
    key: 'who-not-for',
    name: 'Who This Is Not For',
    category: 'base',
    description: 'Define clear boundaries for who should ignore this advice',
  },
  {
    key: 'second-order',
    name: 'Second Order Effects',
    category: 'base',
    description: 'Explore long-term downstream consequences of a decision',
  },

  // ============================
  // EXTENDED ANGLES – Supporting Variations
  // These are useful but not required in default rotation.
  // ============================

  // Tactical & Practical
  {
    key: 'mistake',
    name: 'Common Mistake',
    category: 'tactical',
    description: 'Expose a specific mistake people repeatedly make and show the consequence',
  },
  {
    key: 'quick-tip',
    name: 'Quick Tip',
    category: 'tactical',
    description: 'Deliver one focused, tactical action that can be implemented immediately',
  },
  {
    key: 'tutorial',
    name: 'Step-by-Step',
    category: 'tactical',
    description: 'Break a process into structured steps with practical detail',
  },
  {
    key: 'sop-drop',
    name: 'SOP Drop',
    category: 'tactical',
    description: 'Share a repeatable internal process step by step',
  },
  {
    key: 'tool-stack',
    name: 'Tool Stack',
    category: 'tactical',
    description: 'Reveal specific tools and explain why each one exists',
  },
  {
    key: 'automation',
    name: 'Automation',
    category: 'tactical',
    description: 'Explain how to systematize or automate a defined workflow',
  },

  // Cognitive & Reframing
  {
    key: 'myth',
    name: 'Myth Buster',
    category: 'cognitive',
    description: 'Clearly label a common myth and dismantle it with direct evidence',
  },
  {
    key: 'misconception',
    name: 'Misconception',
    category: 'cognitive',
    description: 'Expose a partially true belief and explain why it is incomplete',
  },
  {
    key: 'expert-trap',
    name: 'Expert Trap',
    category: 'cognitive',
    description: 'Reveal a subtle error experienced professionals fall into',
  },
  {
    key: 'beginner-explanation',
    name: 'Beginner Explanation',
    category: 'cognitive',
    description: 'Simplify a complex concept without dumbing it down',
  },

  // Power & Positioning
  {
    key: 'industry-lie',
    name: 'Industry Lie',
    category: 'power',
    description: 'Call out a misleading narrative promoted in your space',
  },
  {
    key: 'prediction',
    name: 'Prediction',
    category: 'power',
    description: 'State a forward-looking view and justify it with reasoning',
  },
  {
    key: 'status-flip',
    name: 'Status Flip',
    category: 'power',
    description: 'Challenge who should be trusted or listened to on this topic',
  },

  // Narrative Expansion
  {
    key: 'origin-story',
    name: 'Origin Story',
    category: 'narrative',
    description: 'Explain how your perspective or method originally formed',
  },
  {
    key: 'turning-point',
    name: 'Turning Point',
    category: 'narrative',
    description: 'Highlight a defining moment that shifted your thinking',
  },
  {
    key: 'client-mirror',
    name: 'Client Mirror',
    category: 'narrative',
    description: 'Use an anonymized client scenario to reflect a common pattern',
  },

  // Social & Market Framing
  {
    key: 'trend-jack',
    name: 'Trend Jack',
    category: 'social',
    description: 'Connect your expertise to a current market shift',
  },
  {
    key: 'role-based',
    name: 'Role-Based',
    category: 'social',
    description: 'Tailor advice specifically for one defined role',
  },
  {
    key: 'career-angle',
    name: 'Career Angle',
    category: 'social',
    description: 'Relate the topic to long-term career positioning',
  },
  {
    key: 'competitive-teardown',
    name: 'Competitive Teardown',
    category: 'social',
    description: 'Analyze how top performers approach this differently',
  },
];

export const DEFAULT_ANGLE_KEYS = [
  'contrarian',
  'story',
  'checklist',
  'business-impact',
  'failure-story',
  'mental-model',
  'who-not-for',
  'second-order',
];

export function getAngleByKey(key: string): Angle | undefined {
  return angles.find(a => a.key === key);
}

export function getAnglesByCategory(): Record<AngleCategory, Angle[]> {
  const result: Partial<Record<AngleCategory, Angle[]>> = {};

  for (const category of CATEGORY_ORDER) {
    result[category] = angles.filter(a => a.category === category);
  }

  return result as Record<AngleCategory, Angle[]>;
}

export function getBaseAngles(): Angle[] {
  return angles.filter(a => a.category === 'base');
}

export function getExtendedAngles(): Angle[] {
  return angles.filter(a => a.category !== 'base');
}
