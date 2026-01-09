
import React from 'react';
import { DecisionResult } from '../types';

interface ResultModalProps {
  result: DecisionResult | null;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-[3rem] p-10 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-5xl shadow-lg animate-bounce">
          {result.option.icon}
        </div>
        
        <h3 className="text-orange-600 font-bold uppercase tracking-widest text-sm mt-6 mb-2">Vaša odločitev je</h3>
        <h2 className="text-4xl font-black text-gray-800 mb-6">{result.option.label}</h2>
        
        <div className="bg-orange-50 p-6 rounded-2xl mb-8 border border-orange-100 italic text-gray-700">
          {result.aiSuggestion ? (
            <p>“{result.aiSuggestion}”</p>
          ) : (
            <div className="flex justify-center">
               <div className="w-6 h-6 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
        >
          HVALA!
        </button>
      </div>
    </div>
  );
};
