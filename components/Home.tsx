
import React from 'react';
import { Button } from './Button';

interface HomeProps {
  onStart: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#0E1117] text-white flex flex-col items-center overflow-x-hidden font-inter">
      {/* Camada de Fundo Premium */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.1),transparent_40%)]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.1),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Hero Section */}
      <section className="w-full max-w-6xl px-4 md:px-6 pt-16 md:pt-32 pb-16 md:pb-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          IA de Carisma & Dinâmica Social
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black mb-6 md:mb-8 tracking-tighter leading-[1.1] md:leading-[0.95] animate-in fade-in slide-in-from-bottom-4 duration-700">
          Domine o Papo e <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-orange-400 via-rose-500 to-pink-500 bg-clip-text text-transparent">
            Dê o Match
          </span>
        </h1>

        <p className="text-slate-400 text-base md:text-2xl max-w-2xl mb-10 md:mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 px-2">
          Analisamos seus prints para criar abridores impossíveis de ignorar ou salvar conversas travadas no Instagram e Tinder.
        </p>

        <div className="flex flex-col items-center gap-6 w-full max-w-xs md:max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Button 
            onClick={onStart}
            className="w-full h-14 md:h-20 text-lg md:text-2xl rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 hover:scale-105 transition-transform border-none shadow-2xl shadow-orange-500/20 font-black"
          >
            🚀 Começar Agora
          </Button>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2">
              <svg className="w-3 h-3 md:w-4 md:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              Puxe Assunto
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-3 h-3 md:w-4 md:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              Salve Conversas
            </span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-6xl px-4 md:px-6 py-16 md:py-20 flex flex-col items-center">
        <h2 className="text-xl md:text-4xl font-black mb-12 md:mb-16 text-center italic">A ciência do desenrolo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
          {[
            { 
              step: "01",
              icon: "📸", 
              title: "Envie o Print", 
              desc: "Pode ser um story, o perfil ou aquele chat que parou de fluir no direct." 
            },
            { 
              step: "02",
              icon: "🧠", 
              title: "IA Estrategista", 
              desc: "Nossa IA lê a 'vibe' do momento e encontra a brecha perfeita para responder." 
            },
            { 
              step: "03",
              icon: "🔥", 
              title: "Resultado Real", 
              desc: "Receba 3 opções de respostas de alto nível. Escolha, copie e brilhe." 
            }
          ].map((feature, i) => (
            <div key={i} className="group relative bg-[#1a1f2e]/40 border border-white/5 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] hover:bg-slate-900/60 hover:border-orange-500/20 transition-all duration-300 overflow-hidden">
              <div className="absolute top-4 right-8 text-6xl md:text-7xl font-black text-white/[0.03] select-none group-hover:text-orange-500/5 transition-colors">{feature.step}</div>
              <div className="text-4xl md:text-5xl mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 text-white">{feature.title}</h3>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof / Trust Section */}
      <section className="w-full max-w-4xl px-4 md:px-6 py-16 md:py-20 flex flex-col items-center text-center">
        <div className="bg-gradient-to-br from-orange-500/10 to-pink-600/10 border border-white/10 p-8 md:p-20 rounded-[2.5rem] md:rounded-[3rem] w-full relative overflow-hidden backdrop-blur-sm flex flex-col items-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600"></div>
          <h2 className="text-2xl md:text-5xl font-black mb-8 md:mb-10 leading-tight">
            Pare de levar vácuo <br />
            <span className="italic">comece a levar encontros.</span>
          </h2>
          <div className="w-full flex justify-center">
            <Button 
              onClick={onStart}
              className="h-14 md:h-16 px-8 md:px-12 text-lg md:text-xl rounded-2xl bg-white text-black hover:bg-slate-100 border-none font-black shadow-2xl w-full max-w-xs md:max-w-md mx-auto"
            >
              Testar Gratuitamente
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl px-6 py-12 md:py-16 mt-auto border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <div className="text-xl md:text-2xl font-black bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
            MatchFlow.AI
          </div>
          <p className="text-slate-600 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em]">
            © 2026 Inteligência Social Aplicada
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Termos</a>
          <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          <a href="#" className="hover:text-white transition-colors">Contato</a>
        </div>
      </footer>
    </div>
  );
};
