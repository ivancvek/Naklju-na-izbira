
import React, { useState, useCallback, useEffect } from 'react';
import { DecisionCard } from './components/DecisionCard';
import { ResultModal } from './components/ResultModal';
import { HRANA_OPTIONS, ZABAVA_OPTIONS } from './constants';
import { DecisionResult, CategoryType } from './types';
import { getAiSuggestion } from './services/geminiService';

const STORAGE_KEY = 'nakljucna_izbira_last_decision';

const App: React.FC = () => {
  const [loadingCategory, setLoadingCategory] = useState<CategoryType | null>(null);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [persistedResult, setPersistedResult] = useState<DecisionResult | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Preveri, če aplikacija že teče kot nameščena aplikacija
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPersistedResult(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved decision", e);
      }
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleDecision = useCallback(async (category: CategoryType) => {
    setLoadingCategory(category);
    await new Promise(r => setTimeout(r, 1500));

    const options = category === 'hrana' ? HRANA_OPTIONS : ZABAVA_OPTIONS;
    const randomOption = options[Math.floor(Math.random() * options.length)];
    
    const newResult: DecisionResult = {
      category,
      option: randomOption,
    };
    
    setResult(newResult);
    setLoadingCategory(null);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newResult));
    setPersistedResult(newResult);

    try {
      const suggestion = await getAiSuggestion(
        category === 'hrana' ? 'Kaj jesti?' : 'Kaj gledati?', 
        randomOption.label
      );
      const updatedResult = { ...newResult, aiSuggestion: suggestion };
      setResult(updatedResult);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResult));
      setPersistedResult(updatedResult);
    } catch (err) {
      const fallbackSuggestion = "Dobra izbira! Uživajte.";
      setResult(prev => prev ? { ...prev, aiSuggestion: fallbackSuggestion } : null);
    }
  }, []);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <div className="min-h-screen relative flex flex-col items-center p-6 sm:p-12 overflow-hidden bg-orange-50">
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-orange-200/50 blur-3xl -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-orange-100/50 blur-3xl -z-10"></div>
      
      <header className="text-center mb-8 animate-in slide-in-from-top duration-700 w-full flex flex-col items-center relative">
        {/* Install & Share Logic */}
        {!isStandalone && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {deferredPrompt ? (
              <button 
                onClick={handleInstallClick}
                className="bg-orange-600 text-white text-[10px] font-bold px-6 py-2 rounded-full animate-bounce shadow-lg uppercase tracking-widest"
              >
                Namesti aplikacijo 📱
              </button>
            ) : (
              <button 
                onClick={() => setShowInstallGuide(true)}
                className="bg-orange-200 text-orange-700 text-[9px] font-bold px-4 py-1 rounded-full opacity-80 hover:opacity-100 uppercase tracking-widest transition-opacity"
              >
                Navodila za namestitev ℹ️
              </button>
            )}
            
            <button 
              onClick={copyToClipboard}
              className={`${copyFeedback ? 'bg-green-500' : 'bg-orange-100'} text-orange-800 text-[9px] font-bold px-4 py-1 rounded-full uppercase tracking-widest transition-all`}
            >
              {copyFeedback ? 'KOPIRANO! ✓' : 'Kopiraj povezavo 🔗'}
            </button>
          </div>
        )}
        
        <h1 className="text-4xl sm:text-6xl font-black text-orange-600 uppercase tracking-tighter mb-2">
          Naključna Izbira
        </h1>
        <p className="text-orange-800/60 font-medium uppercase tracking-[0.2em] text-xs sm:text-sm mb-4">
          Generator odločitev
        </p>

        {persistedResult && (
          <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 px-4 py-2 rounded-full shadow-sm animate-in fade-in zoom-in duration-500 delay-300">
            <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">Zadnjič:</span>
            <span className="text-lg">{persistedResult.option.icon}</span>
            <span className="text-sm font-semibold text-orange-900">{persistedResult.option.label}</span>
          </div>
        )}
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start justify-items-center">
        <DecisionCard 
          title="Kaj jesti?" 
          options={HRANA_OPTIONS}
          onChoose={() => handleDecision('hrana')}
          isLoading={loadingCategory === 'hrana'}
          icon={(<div className="flex gap-1 text-white text-5xl opacity-80"><span>🍴</span></div>)}
        />
        <DecisionCard 
          title="Kaj gledati?" 
          options={ZABAVA_OPTIONS}
          onChoose={() => handleDecision('zabava')}
          isLoading={loadingCategory === 'zabava'}
          icon={(<div className="text-white text-5xl opacity-80"><span>🎬</span></div>)}
        />
      </main>

      {/* Manual Install Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setShowInstallGuide(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-orange-600 mb-4 uppercase tracking-tight">Postopek namestitve</h3>
            <div className="space-y-4 text-sm text-gray-600">
              <p className="font-bold text-red-500 text-xs uppercase tracking-wider">Pomembno:</p>
              <p>Če se stran odpira znotraj sporočil ali AI Studia, najprej kliknite <strong>"Kopiraj povezavo"</strong> in jo prilepite neposredno v {isIOS ? 'Safari' : 'Chrome'}.</p>
              
              <hr className="border-orange-100" />
              
              {isIOS ? (
                <>
                  <p>1. V Safariju pritisnite gumb <strong>Deli</strong> <span className="bg-gray-100 px-2 py-1 rounded">⎋</span>.</p>
                  <p>2. Izberite <strong>"Dodaj na domovni zaslon"</strong>.</p>
                </>
              ) : (
                <>
                  <p>1. V Chromu pritisnite tri pike <span className="font-bold">⋮</span>.</p>
                  <p>2. Izberite <strong>"Namesti aplikacijo"</strong>.</p>
                </>
              )}
            </div>
            <button 
              onClick={() => setShowInstallGuide(false)}
              className="w-full mt-6 bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors"
            >
              RAZUMEM
            </button>
          </div>
        </div>
      )}

      <footer className="mt-auto pt-16 flex flex-col items-center gap-2 opacity-50">
        <div className="w-8 h-8 flex items-center justify-center">
          <svg className="w-6 h-6 text-orange-800 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-orange-900">v1.4 PWA Optimized</span>
      </footer>

      <ResultModal result={result} onClose={() => setResult(null)} />

      {loadingCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-orange-500/20 backdrop-blur-[2px]">
           <div className="bg-white p-8 rounded-full shadow-2xl flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-8 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-bold text-orange-600 animate-pulse uppercase tracking-wider">Usoda izbira...</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
