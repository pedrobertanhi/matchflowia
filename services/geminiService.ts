
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, AnalysisMode } from "../types";

const SYSTEM_INSTRUCTION = `
  Você é o "MatchFlow.AI", um especialista supremo em dinâmica social e comunicação para apps de relacionamento.
  
  MISSÃO DE DETECÇÃO AUTOMÁTICA:
  1. Identifique imediatamente se a imagem é um PERFIL (fotos, bio, stories) ou uma CONVERSA (balões de chat, mensagens).
  2. Se o usuário selecionou um modo (ex: Perfil) mas enviou outro (ex: Chat), ignore o erro de upload dele, identifique o que realmente é e processe conforme o conteúdo real.
  3. Na "analise_estrategica", comece validando o que você viu (ex: "Notei que você enviou um print de conversa..." ou "Analisando este perfil...").

  DIRETRIZES DE CONTEÚDO:
  - Idioma: Português do Brasil (PT-BR).
  - Tom: Natural, confiante, levemente humorado, sem ser robótico.
  - Regra de Ouro: NUNCA use emojis no campo "texto".
  - Proibido: Conteúdo sexual, agressivo ou comportamentos desesperados ("gado").
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    analise_estrategica: { 
      type: Type.STRING, 
      description: "Comece identificando se é perfil ou conversa e dê o contexto estratégico." 
    },
    opcoes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tipo: { type: Type.STRING },
          texto: { type: Type.STRING },
          motivo: { type: Type.STRING }
        },
        required: ["tipo", "texto", "motivo"]
      }
    }
  },
  required: ["analise_estrategica", "opcoes"]
};

export const analyzeImageWithGemini = async (base64Image: string, mode: AnalysisMode): Promise<AnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Analise esta imagem. 
    Usuário selecionou o modo: ${mode === 'profile' ? 'Perfil/Foto' : 'Conversa/Chat'}.
    
    Ação:
    1. Identifique se o conteúdo REAL é perfil ou conversa.
    2. Se for PERFIL: Crie 3 abridores baseados em detalhes visuais (cenário, pets, estilo).
    3. Se for CONVERSA: Crie 3 respostas para fazer o papo deslanchar, baseando-se no tom da última mensagem.
    4. Se houver divergência entre o que o usuário selecionou e o que a imagem é, cite isso educadamente na análise estratégica e siga com a análise correta para o conteúdo real.
    
    IMPORTANTE: Não use emojis nas frases sugeridas.
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
    throw new Error("Falha ao analisar a imagem. Tente novamente.");
  }
};
