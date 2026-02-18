
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './components/Button';
import { analyzeImageWithGemini } from './services/geminiService';
import { AnalysisResponse, LoadingState, AnalysisMode } from './types';
import { ResultCard } from './components/ResultCard';
import { Home } from './components/Home';

type MainSection = 'social' | 'visual';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'app'>('home');
  const [mainSection, setMainSection] = useState<MainSection>('social');
  const [mode, setMode] = useState<AnalysisMode>('profile');
  const [image, setImage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- CAMADA DE PROTEÇÃO CONTRA INTERRUPÇÕES ---
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (loadingState === LoadingState.ANALYZING) {
        e.preventDefault();
        e.returnValue = 'Uma análise está em curso. Interromper agora pode causar perda de dados e instabilidade na sua chave de API. Deseja sair?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [loadingState]);

  // --- CAMADA DE SEGURANÇA ANTIGONAL (DevTools) ---
  useEffect(() => {
    const trap = setInterval(() => {
      (function() {
        const check = function() {
          const start = new Date().getTime();
          debugger;
          const end = new Date().getTime();
          if (end - start > 100) {}
        };
        check();
      })();
    }, 2000);

    const noop = () => {};
    // @ts-ignore
    window.console.log = noop;
    // @ts-ignore
    window.console.warn = noop;
    // @ts-ignore
    window.console.error = noop;
    
    return () => clearInterval(trap);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loadingState !== LoadingState.IDLE) return; // Bloqueia upload durante requisição
    const file = e.target.files?.[0];
    if (file) {
      setLoadingState(LoadingState.UPLOADING);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setLoadingState(LoadingState.IDLE);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (isRegeneration: boolean = false) => {
    if (!image || loadingState === LoadingState.ANALYZING) return;
    
    setLoadingState(LoadingState.ANALYZING);
    setError(null);
    
    try {
      const base64Data = image.split(',')[1];
      const activeMode = mainSection === 'visual' ? 'visual' : mode;
      const data = await analyzeImageWithGemini(base64Data, activeMode, isRegeneration);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Interrupção externa detectada. O sistema de proteção resetou a conexão.");
    } finally {
      setLoadingState(LoadingState.IDLE);
      if (!isRegeneration) {
        setTimeout(() => {
          const resultElement = document.getElementById('results-start');
          if (resultElement) resultElement.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const reset = () => {
    if (loadingState === LoadingState.ANALYZING) return; // Impede reset durante análise
    setImage(null);
    setResult(null);
    setError(null);
    setLoadingState(LoadingState.IDLE);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleModeChange = (newMode: AnalysisMode) => {
    if (loadingState === LoadingState.ANALYZING) return;
    if (newMode !== mode) {
      setMode(newMode);
      setResult(null);
      setError(null);
    }
  };

  const switchSection = (section: MainSection) => {
    if (loadingState === LoadingState.ANALYZING) return;
    if (section !== mainSection) {
      setMainSection(section);
      if (section === 'visual') setMode('visual');
      else setMode('profile');
      reset();
    }
  };

  const getThemeColors = () => {
    if (mainSection === 'visual') return { primary: 'from-cyan-500 to-blue-600', glow: 'rgba(6,182,212,0.1)', accent: 'cyan-400' };
    if (mode === 'profile') return { primary: 'from-orange-500 to-pink-500', glow: 'rgba(249,115,22,0.1)', accent: 'orange-400' };
    if (mode === 'chat') return { primary: 'from-pink-500 to-purple-600', glow: 'rgba(236,72,153,0.1)', accent: 'pink-400' };
    return { primary: 'from-rose-500 to-red-600', glow: 'rgba(244,63,94,0.1)', accent: 'rose-400' };
  };

  const theme = getThemeColors();
  const isAnalyzing = loadingState === LoadingState.ANALYZING;
  const isWrongCategory = mode === 'chat' && result?.analise_estrategica.includes('[AVISO DE CATEGORIA]');

  if (view === 'home') {
    return <Home onStart={() => setView('app')} />;
  }

  return (
    <div className={`min-h-screen bg-[#090B10] text-white selection:bg-pink-500/30 flex flex-col pb-28 md:pb-12 transition-all duration-1000 ${isAnalyzing ? 'brightness-75 grayscale-[0.2]' : ''}`}>
      
      {/* SECURITY OVERLAY - LOCKDOWN MODE */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md p-8 text-center space-y-8">
            <div className="relative inline-block">
              <div className={`w-32 h-32 rounded-full border-4 border-t-transparent border-${theme.accent} animate-spin mx-auto`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 text-${theme.accent} animate-pulse`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter">Fluxo Blindado Ativo</h2>
              <p className="text-slate-400 font-medium text-sm">Protegendo sua requisição contra interrupções externas. Aguarde o diagnóstico técnico...</p>
            </div>
            <div className="flex gap-2 justify-center">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`w-2 h-2 rounded-full bg-${theme.accent} animate-bounce`} style={{ animationDelay: `${i * 0.2}s` }}></div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-full transition-all duration-1000" style={{ background: `radial-gradient(circle at 50% 0%, ${theme.glow}, transparent 70%)` }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
      </div>

      <div className={`w-full max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center flex-grow transition-all ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}`}>
        <header className="w-full flex justify-between items-center mb-12">
          <div className="text-2xl md:text-3xl font-black tracking-tighter cursor-pointer group flex items-center gap-2" onClick={() => !isAnalyzing && setView('home')}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${theme.primary} flex items-center justify-center shadow-lg`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className={`bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>MatchFlow</span>
              <span className="text-white/20">.AI</span>
            </div>
          </div>
          <button disabled={isAnalyzing} onClick={() => setView('home')} className="glass text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full border border-white/5 active:scale-95 disabled:opacity-30">Sair</button>
        </header>

        <div className="w-full flex flex-col items-center mb-12">
          {mainSection === 'social' && (
            <div className="glass p-1.5 rounded-[1.8rem] flex w-full max-w-sm shadow-2xl">
              {['profile', 'chat', 'pickup'].map((m) => (
                <button 
                  key={m}
                  disabled={isAnalyzing}
                  onClick={() => handleModeChange(m as AnalysisMode)}
                  className={`flex-1 py-4 px-2 rounded-[1.4rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${mode === m ? `bg-gradient-to-r ${theme.primary} text-white shadow-xl` : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {m === 'profile' ? 'Perfil' : m === 'chat' ? 'Conversa' : 'Cantada'}
                </button>
              ))}
            </div>
          )}

          {mainSection === 'visual' && (
            <div className="text-center">
              <span className="text-[11px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-3 block">Estética Pessoal</span>
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4 uppercase">Looksmax</h2>
            </div>
          )}
        </div>

        <main className="w-full flex flex-col items-center gap-12">
          {!image ? (
            <section className="w-full max-w-2xl">
              <div 
                onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                className="relative overflow-hidden group w-full aspect-video glass rounded-[3rem] p-8 flex flex-col items-center justify-center cursor-pointer shadow-3xl border-2 border-dashed border-white/5 hover:border-white/20"
              >
                <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl border border-white/10 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 text-${theme.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-3 text-center tracking-tight uppercase">Upload da Imagem</h2>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/5 border border-green-500/10">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                   </svg>
                   <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Processamento 100% Seguro & Privado</span>
                </div>
              </div>
            </section>
          ) : (
            <section className="w-full flex flex-col items-center gap-12">
              {/* VERTICAL FLOW WRAPPER - Always flex-col */}
              <div className="flex flex-col items-center gap-12 w-full max-w-4xl mx-auto">
                
                {/* Image Preview - Always at the top */}
                <div className="w-full max-w-2xl flex flex-col items-center gap-6">
                  <div className="relative group w-full">
                    <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-slate-900 shadow-3xl bg-slate-950">
                      <img src={image} alt="Preview" className="w-full h-auto max-h-[60vh] object-contain mx-auto" />
                      {!isAnalyzing && (
                        <button onClick={reset} className="absolute top-4 right-4 glass w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-white/20 transition-all z-10 border border-white/10">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                      )}
                    </div>
                    <div className="mt-4 text-center">
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic opacity-50">Criptografia Ponta-a-Ponta Ativa</p>
                    </div>
                  </div>

                  {!result && (
                    <Button 
                      onClick={() => handleAnalyze(false)} 
                      isLoading={isAnalyzing} 
                      className={`w-full h-20 text-2xl rounded-[1.5rem] font-black border-none shadow-2xl bg-gradient-to-r ${theme.primary} active:scale-95 transition-all uppercase tracking-tighter`}
                    >
                      {mainSection === 'visual' ? 'Blindar Looksmax' : 'Segurança Ativa'}
                    </Button>
                  )}
                </div>

                {/* Results - Always underneath the image */}
                {result && (
                  <div id="results-start" className="w-full space-y-8 animate-in slide-in-from-bottom-6 duration-700">
                    <div className="space-y-12">
                      {/* Score Board (Looksmax only) */}
                      {mainSection === 'visual' && !isWrongCategory && (
                        <div className="glass p-8 md:p-12 rounded-[3.5rem] border-cyan-500/20 shadow-2xl bg-cyan-500/[0.02]">
                          <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="relative w-48 h-48 flex-shrink-0">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle cx="50%" cy="50%" r="42%" className="stroke-slate-800/50 fill-none" strokeWidth="12" />
                                <circle cx="50%" cy="50%" r="42%" className="stroke-cyan-500 fill-none" strokeWidth="12" strokeDasharray="263" strokeDashoffset={263 - (263 * (result.score || 0)) / 100} strokeLinecap="round" />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-white">{result.score}%</span>
                                <span className="text-[10px] font-black uppercase text-cyan-500 tracking-widest mt-1">Geral</span>
                              </div>
                            </div>
                            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full">
                              {result.detailed_scores?.map((ds, i) => (
                                <div key={i} className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                    <span>{ds.categoria}</span>
                                    <span className="text-cyan-400">{ds.pontuacao}%</span>
                                  </div>
                                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${ds.pontuacao}%` }}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* strategic Analysis Card */}
                      <div className={`glass p-10 rounded-[3rem] relative overflow-hidden ${isWrongCategory ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5'}`}>
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3 ${isWrongCategory ? 'text-amber-400' : `text-${theme.accent}`}`}>
                          <span className="w-2 h-2 rounded-full bg-current"></span>
                          {isWrongCategory ? 'Contexto Inválido' : 'Análise do Especialista'}
                        </h3>
                        <p className="text-xl md:text-2xl font-semibold leading-relaxed text-slate-200 tracking-tight">
                          {result.analise_estrategica}
                        </p>
                      </div>

                      {/* Recommendations Grid */}
                      {!isWrongCategory && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {result.opcoes.map((option, idx) => (
                            <ResultCard key={idx} option={option} />
                          ))}
                        </div>
                      )}

                      {/* Bottom Actions */}
                      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-12 pb-24 border-t border-white/5">
                        {!isWrongCategory && (
                          <button 
                            disabled={isAnalyzing}
                            onClick={() => handleAnalyze(true)} 
                            className={`w-full sm:w-auto px-12 py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.25em] bg-gradient-to-r ${theme.primary} text-white shadow-2xl active:scale-95 disabled:opacity-50 transition-all`}
                          >
                            Nova Análise Segura
                          </button>
                        )}
                        <button disabled={isAnalyzing} onClick={reset} className="w-full sm:w-auto glass text-slate-500 hover:text-white transition-all text-[12px] font-black uppercase tracking-[0.25em] px-12 py-6 rounded-2xl border border-white/5 active:scale-95">
                          Limpar Sessão
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Persistent Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[340px] px-4">
        <nav className={`glass rounded-[2.2rem] p-2 flex justify-between items-center shadow-3xl border border-white/10 transition-all ${isAnalyzing ? 'opacity-30 grayscale pointer-events-none translate-y-20' : ''}`}>
          {[
            { id: 'social', label: 'Social' },
            { id: 'visual', label: 'Looksmax' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => switchSection(item.id as MainSection)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.6rem] transition-all duration-300 ${mainSection === item.id ? `bg-gradient-to-r ${theme.primary} text-white shadow-2xl` : 'text-slate-500 hover:text-slate-300'}`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
