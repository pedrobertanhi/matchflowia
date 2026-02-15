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

  const getTheme = () => {
    const lowerType = option.tipo.toLowerCase();
    if (lowerType.includes('estilo') || lowerType.includes('arquitetura') || lowerType.includes('visual')) 
      return { color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/5', dot: 'bg-cyan-400' };
    if (lowerType.includes('grooming') || lowerType.includes('observador') || lowerType.includes('pele')) 
      return { color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5', dot: 'bg-orange-400' };
    if (lowerType.includes('ousada') || lowerType.includes('impacto') || lowerType.includes('pele')) 
      return { color: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-orange-500/5', dot: 'bg-rose-400' };
    return { color: 'text-pink-400', border: 'border-pink-500/20', bg: 'bg-pink-500/5', dot: 'bg-pink-400' };
  };

  const theme = getTheme();

  const isMelhoriaTecnica = 
    option.tipo.toLowerCase().includes('grooming') ||
    option.tipo.toLowerCase().includes('pele') ||
    option.tipo.toLowerCase().includes('estética') ||
    option.tipo.toLowerCase().includes('vestimenta') ||
    option.tipo.toLowerCase().includes('visual') ||
    option.tipo.toLowerCase().includes('simetria') ||
    option.tipo.toLowerCase().includes('capilar') ||
    option.tipo.toLowerCase().includes('arquitetura') ||
    option.tipo.toLowerCase().includes('estilo');

  return (
    <div className={`glass relative p-6 rounded-[2rem] hover:translate-y-[-4px] transition-all duration-500 group overflow-hidden flex flex-col h-full shadow-2xl ${theme.border} hover:border-white/20`}>
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] -z-10 opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${theme.bg}`}></div>
      
      <div className="flex items-center justify-between mb-5">
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${theme.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${theme.dot} shadow-[0_0_8px_currentColor]`}></span>
          {option.tipo}
        </span>
        {!isMelhoriaTecnica && (
          <button 
            onClick={handleCopy}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </button>
        )}
      </div>
      
      <div className="text-xl md:text-2xl font-black text-white leading-[1.15] mb-6 flex-grow flex items-center tracking-tight">
        <span className="bg-gradient-to-br from-white via-white to-slate-500 bg-clip-text text-transparent group-hover:to-white transition-all duration-500">
          {isMelhoriaTecnica ? option.texto : `"${option.texto}"`}
        </span>
      </div>
      
      <div className="pt-5 border-t border-white/5 mt-auto">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic opacity-60">Análise de Impacto</span>
          <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
            {option.motivo}
          </p>
        </div>
      </div>
    </div>
  );
};