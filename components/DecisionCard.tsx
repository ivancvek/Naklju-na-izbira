
import React from 'react';
import { Option } from '../types';

export const DecisionCard = ({ title, icon, options, onChoose, isLoading }: any) => (
  <div className="bg-orange-400 rounded-[2.5rem] p-8 shadow-xl text-white flex flex-col items-center">
    <span className="text-5xl mb-4">{icon}</span>
    <h2 className="text-2xl font-bold uppercase mb-6">{title}</h2>
    <div className="flex gap-4 mb-8">
      {options.slice(0, 3).map((o: any) => <span key={o.id} className="text-2xl opacity-80">{o.icon}</span>)}
    </div>
    <button onClick={onChoose} disabled={isLoading} className="bg-white text-orange-600 font-black py-4 px-8 rounded-full shadow-lg active:scale-95 transition-all">
      {isLoading ? 'IZBIRAM...' : 'IZBERI ZAME!'}
    </button>
  </div>
);
