
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

  // --- CAMADA DE SEGURANÇA ATIVA ---
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
    // @ts-ignore
    window.console.info = noop;
    // @ts-ignore
    window.console.debug = noop;

    return () => clearInterval(trap);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!image) return;
    setLoadingState(LoadingState.ANALYZING);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const activeMode = mainSection === 'visual' ? 'visual' : mode;
      const data = await analyzeImageWithGemini(base64Data, activeMode, isRegeneration);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoadingState(LoadingState.IDLE);
      if (!isRegeneration) {
        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setLoadingState(LoadingState.IDLE);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleModeChange = (newMode: AnalysisMode) => {
    if (newMode !== mode) {
      setMode(newMode);
      setResult(null);
      setError(null);
    }
  };

  const switchSection = (section: MainSection) => {
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

  const getActionButtonText = () => {
    if (loadingState === LoadingState.ANALYZING) return 'Processando...';
    if (mainSection === 'visual') return 'Análise de Upgrade Visual';
    if (mode === 'chat') return 'Extrair Respostas';
    if (mode === 'pickup') return 'Gerar Cantada';
    return 'Analisar Perfil';
  };

  const getRegenerationButtonText = () => {
    if (mainSection === 'visual') return 'Nova Análise de Imagem';
    if (mode === 'chat') return 'Tentar Outras Respostas';
    if (mode === 'pickup') return 'Novas Abordagens';
    return 'Novos Ganchos';
  };

  const theme = getThemeColors();
  const isWrongCategory = mode === 'chat' && result?.analise_estrategica.includes('[AVISO DE CATEGORIA]');

  if (view === 'home') {
    return <Home onStart={() => setView('app')} />;
  }

  return (
    <div className="min-h-screen bg-[#090B10] text-white selection:bg-pink-500/30 flex flex-col pb-28 md:pb-12 transition-colors duration-1000">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-full transition-all duration-1000" style={{ background: `radial-gradient(circle at 50% 0%, ${theme.glow}, transparent 70%)` }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center flex-grow">
        <header className="w-full flex justify-between items-center mb-12">
          <div className="text-2xl md:text-3xl font-black tracking-tighter cursor-pointer group flex items-center gap-2" onClick={() => setView('home')}>
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
          <button onClick={() => setView('home')} className="glass text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full border border-white/5 active:scale-95">Sair</button>
        </header>

        <div className="w-full flex flex-col items-center mb-12">
          {mainSection === 'social' && (
            <div className="glass p-1.5 rounded-[1.8rem] flex w-full max-w-sm shadow-2xl">
              {['profile', 'chat', 'pickup'].map((m) => (
                <button 
                  key={m}
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
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4 uppercase">Upgrade Visual</h2>
            </div>
          )}
        </div>

        <main className="w-full flex flex-col items-center gap-12">
          {!image ? (
            <section className="w-full max-w-2xl">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative overflow-hidden group w-full aspect-video glass rounded-[3rem] p-8 flex flex-col items-center justify-center cursor-pointer shadow-3xl border-2 border-dashed border-white/5 hover:border-white/20"
              >
                <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl border border-white/10 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 text-${theme.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-3 text-center tracking-tight uppercase">Upload da Imagem</h2>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            </section>
          ) : (
            <section className="w-full flex flex-col items-center gap-12">
              <div className={`flex flex-col ${result ? 'lg:flex-row lg:items-start' : 'items-center'} gap-12 w-full`}>
                
                {/* Image Preview & Action */}
                <div className={`${result ? 'w-full lg:w-1/3' : 'w-full max-w-2xl mx-auto'} flex flex-col items-center gap-8 lg:sticky lg:top-8`}>
                  <div className="relative group w-full">
                    <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-slate-900 shadow-3xl bg-slate-950">
                      <img src={image} alt="Preview" className="w-full h-auto max-h-[70vh] object-contain mx-auto" />
                      <button onClick={reset} className="absolute top-4 right-4 glass w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-white/20 transition-all z-10 border border-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  </div>

                  {!result && (
                    <Button 
                      onClick={() => handleAnalyze(false)} 
                      isLoading={loadingState === LoadingState.ANALYZING} 
                      className={`w-full h-20 text-2xl rounded-[1.5rem] font-black border-none shadow-2xl bg-gradient-to-r ${theme.primary} active:scale-95 transition-all uppercase tracking-tighter`}
                    >
                      {getActionButtonText()}
                    </Button>
                  )}
                </div>

                {/* Results Column */}
                {result && (
                  <div className="w-full lg:w-2/3 space-y-8 min-h-[400px]">
                    {loadingState === LoadingState.ANALYZING && (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-20">
                        <div className={`w-16 h-16 rounded-full border-4 border-white/5 border-t-${theme.accent} animate-spin`}></div>
                      </div>
                    )}

                    <div className="space-y-8">
                      {mainSection === 'visual' && !isWrongCategory && (
                        <div className="glass p-8 rounded-[3rem] border-cyan-500/20 shadow-2xl">
                          <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="relative w-40 h-40 flex-shrink-0">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle cx="50%" cy="50%" r="42%" className="stroke-slate-800/50 fill-none" strokeWidth="10" />
                                <circle cx="50%" cy="50%" r="42%" className="stroke-cyan-500 fill-none" strokeWidth="10" strokeDasharray="263" strokeDashoffset={263 - (263 * (result.score || 0)) / 100} strokeLinecap="round" />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-white">{result.score}%</span>
                              </div>
                            </div>
                            <div className="flex-grow grid grid-cols-2 gap-4 w-full">
                              {result.detailed_scores?.map((ds, i) => (
                                <div key={i} className="space-y-1.5">
                                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                    <span>{ds.categoria}</span>
                                    <span className="text-cyan-400">{ds.pontuacao}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500" style={{ width: `${ds.pontuacao}%` }}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className={`glass p-8 rounded-[2.5rem] relative overflow-hidden ${isWrongCategory ? 'border-amber-500/30' : 'border-white/5'}`}>
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3 ${isWrongCategory ? 'text-amber-400' : `text-${theme.accent}`}`}>
                          {isWrongCategory ? 'Contexto Inválido' : 'Análise do Especialista'}
                        </h3>
                        <p className="text-base md:text-xl font-semibold leading-relaxed text-slate-200">
                          {result.analise_estrategica}
                        </p>
                      </div>

                      {!isWrongCategory && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {result.opcoes.map((option, idx) => (
                            <ResultCard key={idx} option={option} />
                          ))}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 pb-20">
                        {!isWrongCategory && (
                          <button 
                            onClick={() => handleAnalyze(true)} 
                            className={`px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] bg-gradient-to-r ${theme.primary} text-white shadow-2xl active:scale-95 disabled:opacity-50`}
                          >
                            {getRegenerationButtonText()}
                          </button>
                        )}
                        <button onClick={reset} className="glass text-slate-500 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.25em] px-8 py-5 rounded-2xl border border-white/5 active:scale-95">
                          Nova Imagem
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

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[340px] px-4">
        <nav className="glass rounded-[2.2rem] p-2 flex justify-between items-center shadow-3xl border border-white/10">
          {[
            { id: 'social', label: 'Social' },
            { id: 'visual', label: 'Upgrade' }
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
