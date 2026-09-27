import { GoalType, DomainType, LengthType, HookStyle } from './template';

export type InputMode = 'idea' | 'content';

export interface HealthNote {
  type: 'warning' | 'info' | 'success';
  message: string;
  field?: string;
}

export interface Draft {
  id: string;
  angleKey: string;
  text: string;
  originalText: string;
  wordCount: number;
  readTime: number;
  healthNotes: HealthNote[];
  isEdited: boolean;
  hookStyle: HookStyle;
}

export interface Session {
  id: string;
  createdAt: string;
  updatedAt: string;
  idea: string;
  audience: string;
  voice: string;
  domain: DomainType;
  goal: GoalType;
  length: LengthType;
  inputMode: InputMode;
  selectedAngles: string[];
  drafts: Draft[];
  title?: string;
}

export interface SessionInput {
  idea: string;
  audience: string;
  voice: string;
  domain: DomainType;
  goal: GoalType;
  length: LengthType;
  inputMode: InputMode;
  selectedAngles: string[];
}

export function createEmptySessionInput(): SessionInput {
  return {
    idea: '',
    audience: '',
    voice: '',
    domain: 'general',
    goal: 'learn',
    length: 'medium',
    inputMode: 'idea',
    selectedAngles: [],
  };
}
