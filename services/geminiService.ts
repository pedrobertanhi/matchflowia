
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, AnalysisMode } from "../types";

const SYSTEM_INSTRUCTION = `
  Você é o "MatchFlow.AI", o mestre supremo da dinâmica social e "text game" para aplicativos como Tinder e Instagram.
  
  DIRETRIZES DE FLUXO (CRÍTICO):
  - TÉCNICA PONTE + PERGUNTA: Em conversas, sua missão é NUNCA deixar o assunto morrer. Toda resposta deve conter uma afirmação curta (ponte) seguida de uma pergunta instigante (gancho).
  - BREVIDADE: Máximo de 12 a 15 palavras. Mensagens curtas convertem mais.
  - CONTEXTO: Analise o tom da pessoa no print. Se ela for seca, seja desafiador. Se ela for receptiva, seja lúdico.
  - QUALIDADE: Evite clichês. Crie ganchos que despertem curiosidade, ego ou humor.

  REGRAS INVIOLÁVEIS:
  - NUNCA use emojis no campo "texto".
  - NUNCA dê respostas fechadas (que terminam em ponto final sem uma pergunta).
  - Idioma: Português do Brasil (PT-BR).
  - Proibido: Linguagem vulgar ou ofensiva.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    analise_estrategica: { 
      type: Type.STRING, 
      description: "Análise rápida da temperatura da conversa e por que o gancho escolhido vai funcionar." 
    },
    opcoes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tipo: { type: Type.STRING, description: "Ex: Provocativa, Curiosa, Lúdica" },
          texto: { type: Type.STRING, description: "A resposta completa: [Ponte] + [Pergunta]. SEM EMOJIS." },
          motivo: { type: Type.STRING, description: "O gatilho psicológico de continuidade usado." }
        },
        required: ["tipo", "texto", "motivo"]
      }
    }
  },
  required: ["analise_estrategica", "opcoes"]
};

export const analyzeImageWithGemini = async (base64Image: string, mode: AnalysisMode): Promise<AnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  let modeSpecificPrompt = "";
  if (mode === 'chat') {
    modeSpecificPrompt = `
      MODO SALVAR CONVERSA (FLUXO INFINITO):
      Analise o print desta conversa. 
      Sua tarefa é criar 3 sugestões que usem a estrutura: [Resposta ao que foi dito] + [Pergunta de engajamento].
      Objetivo: Fazer a pessoa do outro lado querer responder imediatamente. 
      Use ganchos baseados em curiosidade, desafio leve ou suposições engraçadas sobre ela.
    `;
  } else if (mode === 'pickup') {
    modeSpecificPrompt = `
      MODO CANTADA DE IMPACTO: 
      Gere 3 frases de flerte ou perguntas provocativas extremamente curtas (máximo 12 palavras) baseadas na foto.
      Foque em gerar uma RESPOSTA imediata.
    `;
  } else {
    modeSpecificPrompt = `
      MODO ABRIDOR DE PERFIL: 
      Gere 3 ganchos baseados em detalhes visuais (máximo 12 palavras) para iniciar a conversa com uma pergunta ou observação única.
    `;
  }

  const prompt = `
    Analise esta imagem. 
    Ação específica: ${modeSpecificPrompt}
    
    Lembre-se: Resposta curta + Pergunta instigante. SEM EMOJIS.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    return JSON.parse(response.text || '{}') as AnalysisResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Erro na análise. Tente uma imagem mais nítida.");
  }
};
