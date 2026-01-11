export enum SectionType {
  INTRO = 'INTRO',
  CANONICAL = 'CANONICAL',
  STRUCTURAL = 'STRUCTURAL',
  VERTICAL = 'VERTICAL',
  MISIDENTIFIED = 'MISIDENTIFIED',
  PROVISIONAL = 'PROVISIONAL',
  ANTHROPOMORPHIC = 'ANTHROPOMORPHIC',
  INTERACTIVE = 'INTERACTIVE',
  CLOSING = 'CLOSING'
}

export interface SpecimenData {
  id: string;
  glyph: string;
  name: string;
  latinName?: string;
  description: string;
  notes?: string;
  glyphClassName?: string;
  interactionType?: 'evasive' | 'anxious' | 'audio';
}

export interface SectionData {
  id: SectionType;
  title: string;
  preamble?: string;
  specimens: SpecimenData[];
}
