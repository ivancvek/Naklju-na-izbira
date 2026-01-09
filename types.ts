
export type CategoryType = 'hrana' | 'zabava';

export interface Option {
  id: string;
  label: string;
  icon: string; // Lucide icon name or emoji
}

export interface DecisionResult {
  category: CategoryType;
  option: Option;
  aiSuggestion?: string;
}
