
import React from 'react';
export const ResultModal = ({ result, onClose }: any) => {
  if (!result) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl relative">
        <div className="text-6xl mb-4">{result.option.icon}</div>
        <h2 className="text-3xl font-black text-gray-800 mb-4">{result.option.label}</h2>
        <p className="text-gray-600 italic mb-8">{result.aiSuggestion || 'Pripravljam AI predlog...'}</p>
        <button onClick={onClose} className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl">ZAKLJUČI</button>
      </div>
    </div>
  );
};
