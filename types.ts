
export type CategoryType = 'hrana' | 'zabava';
export interface Option { id: string; label: string; icon: string; }
export interface DecisionResult { category: CategoryType; option: Option; aiSuggestion?: string; }
