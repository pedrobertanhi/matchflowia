
import React from 'react';
import { Button } from './Button';

interface HomeProps {
  onStart: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#090B10] text-white flex flex-col items-center overflow-x-hidden font-inter selection:bg-orange-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.15),transparent_70%)] blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15),transparent_70%)] blur-3xl"></div>
        <div className="absolute inset-0 bg-slate-950/10"></div>
      </div>

      <nav className="w-full max-w-7xl px-6 py-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-pink-600 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">MatchFlow.AI</span>
        </div>
        <div className="hidden sm:flex gap-8 items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white cursor-pointer transition-colors">Social</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white cursor-pointer transition-colors">Looksmax</span>
          <Button onClick={onStart} variant="ghost" className="border border-white/10 px-4 py-2 rounded-xl text-[10px]">Acessar App</Button>
        </div>
      </nav>

      <section className="w-full max-w-6xl px-4 md:px-6 pt-12 md:pt-24 pb-16 md:pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-orange-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          Otimização Social e Estética
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-[9rem] font-black mb-8 tracking-tighter leading-[0.85] animate-in fade-in slide-in-from-bottom-4 duration-700">
          Atração <br />
          <div className="relative inline-block overflow-hidden whitespace-nowrap animate-typing border-r-[0.05em] border-orange-500 pr-1">
            <span className="bg-gradient-to-r from-orange-400 via-rose-500 to-pink-500 bg-clip-text text-transparent">
              Escalável.
            </span>
          </div>
        </h1>

        <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 px-4 font-medium">
          A primeira IA que une <span className="text-white">Dinâmica Social</span> e <span className="text-cyan-400">Looksmax</span>. Melhore sua imagem e nunca mais deixe uma conversa esfriar.
        </p>

        <div className="flex flex-col items-center gap-8 w-full max-w-xs md:max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Button 
            onClick={onStart}
            className="w-full h-16 md:h-20 text-2xl md:text-4xl rounded-[2rem] bg-gradient-to-r from-orange-500 to-pink-600 hover:scale-[1.02] transition-all border-none shadow-[0_20px_50px_rgba(249,115,22,0.3)] font-black uppercase tracking-tighter"
          >
            Começar Evolução 🚀
          </Button>
        </div>
      </section>

      <section className="w-full max-w-5xl px-6 py-24">
        <div className="glass p-12 rounded-[4rem] border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04kM12 21.48l.342.106A11.957 11.957 0 0112 21.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-3xl font-black tracking-tight uppercase">Privacidade com transparência</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                A aplicação não mantém um banco de imagens. Ao solicitar uma análise, a foto é enviada ao provedor de IA configurado e processada conforme os termos desse serviço.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300">Chave protegida no servidor</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300">Sem persistência local</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300">Limite de requisições</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl px-6 py-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="glass aspect-[3/4] max-w-sm mx-auto rounded-[3rem] border-cyan-500/30 overflow-hidden relative group shadow-[0_0_50px_rgba(6,182,212,0.2)]">
               <img 
                 src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800" 
                 className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
                 alt="Exemplo de Análise Visual"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
               <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] animate-scan"></div>
               
               <div className="absolute bottom-8 left-8 right-8 space-y-4">
                 <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Nota Geral</div>
                      <div className="text-4xl font-black">8.4<span className="text-sm opacity-50">/10</span></div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Aparência</div>
                      <div className="text-xl font-black text-white">Excelente</div>
                    </div>
                 </div>
                 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-cyan-400 w-[84%]"></div>
                 </div>
               </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest">
              New: Looksmax Engine V2
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">
              A ciência da <br />
              <span className="text-cyan-400 italic">Primeira Impressão.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Não é sobre "ser bonito", é sobre <strong>potencializar seus traços</strong>. Nossa IA avalia sua simetria, qualidade de pele, corte de cabelo e estilo de vestimenta através de visão computacional.
            </p>
            <ul className="space-y-4">
              {[
                "Diagnóstico Geométrico Facial",
                "Dicas de Cuidados e Estilo de Barba",
                "Otimização de Fotogenia e Ângulos",
                "Análise de Contraste e Vestimenta"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-200 font-bold">
                  <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <span className="text-pink-500 font-black text-xs uppercase tracking-[0.4em]">O Grande Problema</span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">
            Matches infinitos, <br />
            <span className="text-slate-600">encontros zero?</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            Frases genéricas e fotos pouco cuidadas podem dificultar uma boa primeira impressão. <br /><br />
            Para se destacar, combine <strong>contexto, respeito e apresentação</strong>. O MatchFlow reúne essas análises em um só lugar.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="glass p-8 rounded-[2.5rem] border-red-500/20 bg-red-500/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-110 transition-transform">❌</div>
             <h4 className="text-red-400 font-black uppercase text-xs tracking-widest mb-2">Abordagem Comum</h4>
             <p className="text-slate-200 font-bold text-xl italic opacity-50">"Oi, você é muito linda! Tudo bem?"</p>
             <div className="mt-4 text-[10px] text-red-500/70 font-bold uppercase tracking-widest">Status: Ignorado</div>
          </div>
          <div className="glass p-8 rounded-[2.5rem] border-green-500/30 bg-green-500/5 relative overflow-hidden group scale-105 shadow-2xl z-10">
             <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl group-hover:scale-110 transition-transform">✅</div>
             <h4 className="text-green-400 font-black uppercase text-xs tracking-widest mb-2">Abordagem MatchFlow</h4>
             <p className="text-white font-black text-xl italic">"Vi que você tem uma edição do 'Sapiens' ali no canto... o que achou daquela teoria?"</p>
             <div className="mt-4 text-[10px] text-green-500 font-bold uppercase tracking-widest">Status: Contextual</div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl px-6 py-32 flex flex-col items-center">
        <h2 className="text-4xl md:text-6xl font-black mb-20 text-center tracking-tighter italic">O fluxo do resultado</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
          {[
            { 
              step: "01", 
              title: "Screenshot / Selfie", 
              desc: "Envie um print de perfil, conversa ou uma selfie para avaliação.",
              gradient: "from-blue-500 to-cyan-500"
            },
            { 
              step: "02", 
              title: "Análise IA", 
              desc: "Nossa IA faz o scan visual e detecta ganchos psicológicos ou melhorias estéticas.",
              gradient: "from-orange-500 to-pink-500"
            },
            { 
              step: "03", 
              title: "Evolução", 
              desc: "Aplique as melhorias visuais ou copie as frases de alto impacto.",
              gradient: "from-purple-500 to-indigo-500"
            }
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-6 relative group">
              <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-tr ${item.gradient} flex items-center justify-center text-3xl font-black shadow-2xl shadow-current/20 group-hover:scale-110 transition-transform duration-500`}>
                {item.step}
              </div>
              <h3 className="text-3xl font-black">{item.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              {i < 2 && <div className="hidden lg:block absolute top-10 -right-8 text-white/10 text-5xl">→</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="w-full max-w-4xl px-6 py-40 text-center flex flex-col items-center">
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-12">
          Domine o jogo <br />
          <span className="text-slate-700">visual e social.</span>
        </h2>
        <Button 
          onClick={onStart}
          className="h-20 px-12 text-2xl rounded-2xl bg-white text-black hover:bg-orange-500 hover:text-white transition-all font-black uppercase tracking-tighter shadow-3xl"
        >
          Usar MatchFlow Agora
        </Button>
      </section>

      <footer className="w-full max-w-6xl px-6 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
          <div className="text-2xl font-black tracking-tighter">
            MatchFlow.AI
          </div>
          <p className="max-w-xs text-slate-500 text-xs font-medium leading-relaxed">
            A ferramenta definitiva para otimização social e estética. Transformamos tecnologia em resultados reais nos apps.
          </p>
        </div>
        <div className="flex flex-col gap-2 items-center md:items-end">
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">Projeto experimental · use imagens autorizadas</p>
        </div>
      </footer>
    </div>
  );
};
