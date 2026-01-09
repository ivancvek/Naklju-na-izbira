
import React from 'react';
import { Option } from '../types';

interface DecisionCardProps {
  title: string;
  icon: React.ReactNode;
  options: Option[];
  onChoose: () => void;
  isLoading: boolean;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ title, icon, options, onChoose, isLoading }) => {
  return (
    <div className="bg-orange-400 rounded-[3rem] p-8 shadow-xl flex flex-col items-center text-white w-full max-w-sm transition-transform hover:scale-[1.02]">
      <div className="mb-4">
        {icon}
      </div>
      <h2 className="text-2xl font-bold uppercase tracking-wider mb-8 text-center">{title}</h2>
      
      <div className="grid grid-cols-3 gap-6 mb-10 w-full">
        {options.map((opt) => (
          <div key={opt.id} className="flex flex-col items-center gap-2 group cursor-default">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl group-hover:bg-white/40 transition-colors">
              {opt.icon}
            </div>
            <span className="text-[10px] uppercase font-semibold text-center leading-tight opacity-90">
              {opt.label}
            </span>
          </div>
        ))}
      </div>

      <button 
        onClick={onChoose}
        disabled={isLoading}
        className="bg-white text-orange-600 font-black py-4 px-10 rounded-full text-lg shadow-lg hover:bg-orange-50 active:scale-95 transition-all disabled:opacity-50"
      >
        {isLoading ? 'IZBIRAM...' : 'IZBERI ZA MENE!'}
      </button>
    </div>
  );
};
