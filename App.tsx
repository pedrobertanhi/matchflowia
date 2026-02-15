
import React, { useState, useRef } from 'react';
import { Button } from './components/Button';
import { analyzeImageWithGemini } from './services/geminiService';
import { AnalysisResponse, LoadingState, AnalysisMode } from './types';
import { ResultCard } from './components/ResultCard';
import { Home } from './components/Home';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'app'>('home');
  const [mode, setMode] = useState<AnalysisMode>('profile');
  const [image, setImage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAnalyze = async () => {
    if (!image) return;
    setLoadingState(LoadingState.ANALYZING);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const data = await analyzeImageWithGemini(base64Data, mode);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoadingState(LoadingState.IDLE);
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
      reset();
    }
  };

  const getGradientByMode = () => {
    if (mode === 'profile') return 'bg-gradient-to-r from-orange-500 to-pink-500 shadow-orange-500/10';
    if (mode === 'chat') return 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-purple-500/10';
    return 'bg-gradient-to-r from-rose-500 to-red-600 shadow-red-500/10';
  };

  const getActiveTabStyle = (currentMode: AnalysisMode) => {
    if (mode !== currentMode) return 'text-slate-500 hover:text-slate-300';
    if (currentMode === 'profile') return 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg';
    if (currentMode === 'chat') return 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg';
    return 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg';
  };

  if (view === 'home') {
    return <Home onStart={() => setView('app')} />;
  }

  return (
    <div className="min-h-screen bg-[#0E1117] text-white selection:bg-pink-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.05),transparent_50%)]"></div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        {/* Header Compacto */}
        <header className="w-full flex justify-between items-center mb-8 md:mb-10">
          <div 
            className="text-xl md:text-2xl font-black bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent cursor-pointer"
            onClick={() => setView('home')}
          >
            MatchFlow.AI
          </div>
          <button 
            onClick={() => setView('home')}
            className="text-slate-500 hover:text-white transition-colors text-[9px] md:text-[10px] font-black uppercase tracking-widest"
          >
            Sair
          </button>
        </header>

        {/* Tab Switcher */}
        {!result && (
          <div className="flex p-1 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 mb-8 md:mb-12 w-full max-w-md relative overflow-x-auto no-scrollbar">
            <button 
              onClick={() => handleModeChange('profile')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${getActiveTabStyle('profile')}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Perfil
            </button>
            <button 
              onClick={() => handleModeChange('chat')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${getActiveTabStyle('chat')}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Conversa
            </button>
            <button 
              onClick={() => handleModeChange('pickup')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${getActiveTabStyle('pickup')}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Cantadas
            </button>
          </div>
        )}

        <main className="w-full flex flex-col items-center gap-6 md:gap-8">
          {!image ? (
            <section className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative overflow-hidden group w-full aspect-square sm:aspect-video bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-[2rem] p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/40 hover:bg-slate-900/60 transition-all duration-300 shadow-xl"
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                  {mode === 'profile' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                  {mode === 'chat' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                  {mode === 'pickup' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                </div>
                <h2 className="text-base md:text-lg font-bold text-white mb-2 text-center">
                  {mode === 'profile' && 'Envie o print do perfil/story'}
                  {mode === 'chat' && 'Envie o print da conversa travada'}
                  {mode === 'pickup' && 'Envie a foto do perfil para a cantada'}
                </h2>
                <p className="text-slate-500 text-center max-w-xs text-[10px] md:text-xs italic px-4">
                  {mode === 'chat' ? 'Geraremos respostas com ganchos para o papo nunca morrer.' : 'Nossa IA criará algo único baseado no cenário ou estilo da pessoa.'}
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
              </div>
            </section>
          ) : (
            <section className="w-full flex flex-col items-center gap-6 md:gap-8 animate-in zoom-in-95 duration-500">
              <div className="relative group w-full max-w-[260px] md:max-w-sm">
                <div className={`absolute -inset-1 rounded-[2.2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 ${getGradientByMode()}`}></div>
                <div className="relative">
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-full h-auto max-h-[35vh] md:max-h-[50vh] rounded-[2rem] object-contain bg-black border-4 border-slate-900 shadow-2xl" 
                  />
                  <button 
                    onClick={reset}
                    className="absolute -top-3 -right-3 bg-white text-black p-2 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {!result && (
                <div className="w-full flex justify-center">
                  <Button 
                    onClick={handleAnalyze} 
                    isLoading={loadingState === LoadingState.ANALYZING}
                    className={`w-full max-w-xs md:max-w-sm h-14 md:h-16 text-base md:text-lg rounded-2xl font-black border-none shadow-xl ${getGradientByMode()}`}
                  >
                    {loadingState === LoadingState.ANALYZING ? 'Gerando respostas...' : mode === 'chat' ? 'Manter Fluxo do Papo' : 'Analisar Inteligente'}
                  </Button>
                </div>
              )}

              {error && (
                <div className="w-full max-w-sm p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              {result && (
                <div className="w-full space-y-6 md:space-y-8 animate-in fade-in duration-700">
                  <div className="bg-slate-900/60 border border-white/5 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-xl">
                    <h3 className={`font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] mb-3 ${mode === 'profile' ? 'text-orange-400' : mode === 'chat' ? 'text-purple-400' : 'text-rose-400'}`}>
                      {mode === 'chat' ? 'Estratégia de Continuidade' : 'Análise Inteligente'}
                    </h3>
                    <p className="text-slate-200 text-sm md:text-lg leading-relaxed font-medium">
                      {result.analise_estrategica}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.opcoes.map((option, idx) => (
                      <ResultCard key={idx} option={option} />
                    ))}
                  </div>

                  <div className="flex justify-center pb-12">
                     <button onClick={reset} className="text-slate-500 hover:text-white transition-colors text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                       </svg>
                       Analisar outro print
                     </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
