
import React, { useState } from 'react';
import { IceBreakerOption } from '../types';

interface ResultCardProps {
  option: IceBreakerOption;
}

export const ResultCard: React.FC<ResultCardProps> = ({ option }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(option.texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLabelColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('observador')) return 'text-orange-400';
    if (lowerType.includes('engraçado') || lowerType.includes('ousado')) return 'text-pink-400';
    if (lowerType.includes('curioso') || lowerType.includes('profundo')) return 'text-purple-400';
    return 'text-rose-400';
  };

  return (
    <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[1.8rem] hover:bg-slate-900/60 transition-all group relative overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${getLabelColor(option.tipo)}`}>
          {option.tipo}
        </span>
        <button 
          onClick={handleCopy}
          className="p-2 -mr-2 text-slate-500 hover:text-white transition-colors"
          title="Copiar texto"
        >
          {copied ? (
            <span className="text-[10px] text-orange-400 font-bold uppercase animate-in fade-in zoom-in">Copiado!</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          )}
        </button>
      </div>
      
      <blockquote className="text-lg md:text-xl font-bold text-white leading-tight mb-6 flex-grow">
        "{option.texto}"
      </blockquote>
      
      <div className="pt-4 border-t border-white/5">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          <span className="font-black text-slate-400 uppercase tracking-tighter mr-2">Estratégia:</span> 
          {option.motivo}
        </p>
      </div>
    </div>
  );
};
