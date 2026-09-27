export type AngleCategory =
  | 'base'
  | 'cognitive'
  | 'power'
  | 'tactical'
  | 'narrative'
  | 'strategic'
  | 'social';

export interface Angle {
  key: string;
  name: string;
  category: AngleCategory;
  description: string;
}

export interface AngleSelection {
  angleKey: string;
  selected: boolean;
}

export const CATEGORY_LABELS: Record<AngleCategory, string> = {
  base: 'Base Angles',
  cognitive: 'Cognitive',
  power: 'Power & Positioning',
  tactical: 'Tactical',
  narrative: 'Narrative',
  strategic: 'Strategic',
  social: 'Social & Market',
};

export const CATEGORY_ORDER: AngleCategory[] = [
  'base',
  'cognitive',
  'power',
  'tactical',
  'narrative',
  'strategic',
  'social',
];
