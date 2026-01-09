
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- KONSTANTE ---
const HRANA = [
  { id: 'h1', label: 'Pizza / Italijanska', icon: '🍕' },
  { id: 'h2', label: 'Burger / Hitra hrana', icon: '🍔' },
  { id: 'h3', label: 'Suši / Azijska', icon: '🍣' },
  { id: 'h4', label: 'Domača kuhinja', icon: '🍲' },
  { id: 'h5', label: 'Solata / Zdravo', icon: '🥗' }
];

const ZABAVA = [
  { id: 'z1', label: 'Akcijski film', icon: '🎬' },
  { id: 'z2', label: 'Komedija / Serija', icon: '😂' },
  { id: 'z3', label: 'Video igre', icon: '🎮' },
  { id: 'z4', label: 'Sprehod v naravi', icon: '🌳' },
  { id: 'z5', label: 'Branje knjige', icon: '📖' }
];

// --- GLAVNA APLIKACIJA ---
const App = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const izberi = async (tip: string) => {
    setLoading(tip);
    const opcije = tip === 'hrana' ? HRANA : ZABAVA;
    const izbrana = opcije[Math.floor(Math.random() * opcije.length)];
    
    // Takojšnja vizualna povratna informacija
    setResult({ opcija: izbrana, ai: 'AI pripravlja nasvet...' });
    setLoading(null);

    // AI predlog v ozadju
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Uporabnik se ne more odločiti kaj bi ${tip === 'hrana' ? 'jedel' : 'delal'}. Izbral je "${izbrana.label}". Predlagaj eno specifično stvar v enem stavku v slovenščini z emojijem.`,
      });
      const text = response.text;
      setResult((prev: any) => prev ? { ...prev, ai: text } : null);
    } catch (err) {
      console.error(err);
      setResult((prev: any) => prev ? { ...prev, ai: "Odlična izbira! Uživaj! ✨" } : null);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center p-6 bg-[#FDFCFB] min-h-screen">
      <header className="text-center my-10 animate-fade-in">
        <h1 className="text-5xl font-black text-gray-900 leading-none uppercase tracking-tighter">
          KAJ NAJ<br/><span className="text-orange-500">IZBEREM?</span>
        </h1>
        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-4">AI Generator odločitev</p>
      </header>

      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* Hrana Kartica */}
        <div 
          onClick={() => !loading && izberi('hrana')} 
          className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center cursor-pointer active:scale-95 transition-all"
        >
          <div className="text-5xl mb-4 bg-orange-50 w-20 h-20 flex items-center justify-center rounded-3xl shadow-inner">🍕</div>
          <h2 className="text-2xl font-black uppercase text-gray-800 tracking-tight">Hrana</h2>
          <button className="mt-6 w-full bg-orange-500 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-orange-200">
            {loading === 'hrana' ? 'Izbiram...' : 'Odloči zame!'}
          </button>
        </div>

        {/* Zabava Kartica */}
        <div 
          onClick={() => !loading && izberi('zabava')} 
          className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center cursor-pointer active:scale-95 transition-all"
        >
          <div className="text-5xl mb-4 bg-blue-50 w-20 h-20 flex items-center justify-center rounded-3xl shadow-inner">🎬</div>
          <h2 className="text-2xl font-black uppercase text-gray-800 tracking-tight">Zabava</h2>
          <button className="mt-6 w-full bg-gray-900 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-gray-200">
            {loading === 'zabava' ? 'Izbiram...' : 'Odloči zame!'}
          </button>
        </div>
      </div>

      {/* Modal za prikaz rezultata */}
      {result && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-sm text-center shadow-2xl transform animate-in zoom-in-95 duration-300">
            <div className="text-7xl mb-6 drop-shadow-lg">{result.opcija.icon}</div>
            <h3 className="text-3xl font-black text-gray-900 uppercase mb-4 leading-none tracking-tighter">
              {result.opcija.label}
            </h3>
            <div className="bg-orange-50 p-6 rounded-2xl mb-8 min-h-[100px] flex items-center justify-center border border-orange-100">
              <p className="text-gray-700 italic text-sm leading-relaxed font-medium">
                {result.ai}
              </p>
            </div>
            <button 
              onClick={() => setResult(null)} 
              className="w-full bg-gray-900 text-white font-bold py-5 rounded-2xl uppercase text-xs tracking-[0.2em] active:bg-black transition-colors"
            >
              Zapri
            </button>
          </div>
        </div>
      )}
      
      <footer className="mt-auto py-8 text-gray-300 text-[10px] font-bold uppercase tracking-widest">
        Powered by Gemini AI
      </footer>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
