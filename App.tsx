
import React, { useState, useCallback } from 'react';
import { DecisionCard } from './components/DecisionCard';
import { ResultModal } from './components/ResultModal';
import { HRANA_OPTIONS, ZABAVA_OPTIONS } from './constants';
import { DecisionResult, CategoryType } from './types';
import { getAiSuggestion } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState<CategoryType | null>(null);
  const [result, setResult] = useState<DecisionResult | null>(null);

  const handleDecision = useCallback(async (category: CategoryType) => {
    setLoading(category);
    const options = category === 'hrana' ? HRANA_OPTIONS : ZABAVA_OPTIONS;
    const randomOption = options[Math.floor(Math.random() * options.length)];
    
    setResult({ category, option: randomOption });
    setLoading(null);

    const suggestion = await getAiSuggestion(category, randomOption.label);
    setResult(prev => prev ? { ...prev, aiSuggestion: suggestion } : null);
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-black text-orange-600 uppercase mb-2">Naključna Izbira</h1>
        <p className="text-orange-800/60 font-bold uppercase tracking-widest text-xs">Generator odločitev</p>
      </header>
      <main className="grid gap-8 w-full max-w-4xl">
        <DecisionCard title="Kaj jesti?" icon="🍴" options={HRANA_OPTIONS} onChoose={() => handleDecision('hrana')} isLoading={loading === 'hrana'} />
        <DecisionCard title="Kaj gledati?" icon="🎬" options={ZABAVA_OPTIONS} onChoose={() => handleDecision('zabava')} isLoading={loading === 'zabava'} />
      </main>
      <ResultModal result={result} onClose={() => setResult(null)} />
    </div>
  );
};
export default App;
