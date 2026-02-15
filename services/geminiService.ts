
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, AnalysisMode } from "../types";

const SYSTEM_INSTRUCTION = `
  Você é o "MatchFlow.AI", o mestre do carisma digital e "text game".
  
  DIRETRIZES DE ESTILO (CRÍTICO):
  - BREVIDADE: Cantadas devem ter no MÁXIMO 12 palavras. Seja direto e cirúrgico.
  - CONTEXTO VISUAL: Use elementos da imagem (um detalhe na roupa, o lugar, um objeto ao fundo, a expressão). 
  - QUALIDADE: Fuja de clichês de internet ("seu pai é padeiro", etc). Crie algo que pareça que você acabou de pensar ao ver a foto.
  - TONS: 
    1. "Criativa": Observação inteligente sobre o cenário.
    2. "Ousada": Flerte direto mas elegante.
    3. "Engraçada": Quebra de gelo com humor autodepreciativo ou absurdo.

  REGRAS INVIOLÁVEIS:
  - NUNCA use emojis no campo "texto".
  - Idioma: Português do Brasil (PT-BR).
  - Proibido: Linguagem vulgar, sexual explícita ou ofensiva.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    analise_estrategica: { 
      type: Type.STRING, 
      description: "Explicação tática rápida do porquê essas abordagens funcionam neste contexto." 
    },
    opcoes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tipo: { type: Type.STRING, description: "Ex: Criativa, Ousada, Engraçada" },
          texto: { type: Type.STRING, description: "A cantada curta (máx 12 palavras). SEM EMOJIS." },
          motivo: { type: Type.STRING, description: "O gatilho psicológico usado." }
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
  if (mode === 'pickup') {
    modeSpecificPrompt = `
      MODO CANTADA DE IMPACTO: 
      Gere 3 frases de flerte extremamente curtas (máximo 12 palavras) baseadas em um detalhe específico desta foto. 
      A frase deve ser impossível de ignorar e parecer espontânea. 
      Não use perguntas genéricas. Use afirmações ou observações provocativas.
    `;
  } else if (mode === 'profile') {
    modeSpecificPrompt = `
      MODO ABRIDOR DE PERFIL: 
      Gere 3 perguntas ou comentários curtos sobre o estilo de vida ou interesses visíveis na foto para iniciar uma conversa.
    `;
  } else {
    modeSpecificPrompt = `
      MODO SALVAR CONVERSA: 
      Gere 3 respostas táticas para o print deste chat. Se a pessoa foi seca, provoque. Se o papo parou, mude o frame.
    `;
  }

  const prompt = `
    Analise esta imagem. 
    Ação solicitada: ${modeSpecificPrompt}
    
    Lembre-se da regra de ouro: SEM EMOJIS e texto muito curto.
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
