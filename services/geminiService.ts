import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, AnalysisMode } from "../types";

const SYSTEM_INSTRUCTION = `
  Você é o motor de inteligência estética e social do "MatchFlow.AI". Sua análise deve ser fria, técnica, objetiva e consistente.

  MODO VISUAL (LOOKSMAX):
  - OBJETIVO: Diagnóstico estético puro.
  - COMPORTAMENTO: Use apenas tons imperativos e técnicos. 
  - PROIBIDO: Nunca faça perguntas ao usuário. Nunca use frases como "Você tem rotina?", "Qual sua cor favorita?", ou "O que você acha?".
  - FORMATO DAS OPÇÕES:
    * 'tipo': Categoria técnica (ex: "Arquitetura Facial", "Grooming Capilar", "Contraste de Vestimenta").
    * 'texto': Ação direta de melhoria (ex: "Reduza o volume lateral do cabelo para alongar o rosto").
    * 'motivo': Impacto técnico na percepção visual (ex: "O excesso de volume lateral cria uma silhueta arredondada, diminuindo a percepção de mandíbula definida").
  - CONSISTÊNCIA: Avalie a geometria e iluminação. Se a foto for a mesma, o score e as dicas devem ser idênticos.

  MODO SOCIAL - CONVERSA (CHAT):
  - VALIDAÇÃO DE CONTEXTO: Esta é a ÚNICA aba com validação rigorosa. 
  - Se a imagem NÃO contiver uma interface de chat/mensagens claramente visível: 
    * O campo 'analise_estrategica' deve começar OBRIGATORIAMENTE com "⚠️ [AVISO DE CATEGORIA]:". 
    * Explique que ali só devem ser enviados prints de conversa.
  - Se for um chat válido: Use Ponte + Pergunta.

  MODO SOCIAL - PERFIL/CANTADAS:
  - Gere ganchos baseados no cenário e elementos visuais detectados. Sem validação de erro aqui.

  IDIOMA: Português (PT-BR). SEM EMOJIS nos campos 'texto' e 'analise_estrategica'.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    analise_estrategica: { 
      type: Type.STRING, 
      description: "Diagnóstico técnico ou aviso de categoria errada." 
    },
    score: {
      type: Type.NUMBER,
      description: "Pontuação de 0 a 100."
    },
    detailed_scores: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          categoria: { type: Type.STRING },
          pontuacao: { type: Type.NUMBER }
        },
        required: ["categoria", "pontuacao"]
      }
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

export const analyzeImageWithGemini = async (base64Image: string, mode: AnalysisMode, isRegeneration: boolean = false): Promise<AnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  let modeSpecificPrompt = "";
  if (mode === 'visual') {
    modeSpecificPrompt = `
      ANÁLISE LOOKSMAX TÉCNICA:
      - Foque em Simetria, Grooming, Estilo e Qualidade da Foto.
      - Dê 3 melhorias práticas e DIRETAS. 
      - Proibido perguntas. 
      - Seja consistente com os scores.
    `;
  } else if (mode === 'chat') {
    modeSpecificPrompt = `
      MODO CHAT: Verifique se é uma conversa. Se não for, emita o [AVISO DE CATEGORIA]. 
      Se for, gere 3 respostas seguindo a técnica Ponte + Pergunta.
      ${isRegeneration ? "IMPORTANTE: Gere 3 opções COMPLETAMENTE DIFERENTES das sugestões comuns. Explore outros ângulos da conversa." : ""}
    `;
  } else if (mode === 'pickup') {
    modeSpecificPrompt = `MODO CANTADA: Gere 3 abordagens curtas baseadas no estilo e cenário da foto. ${isRegeneration ? "Use abordagens inovadoras e diferentes das anteriores." : ""}`;
  } else {
    modeSpecificPrompt = `MODO PERFIL: Encontre ganchos visuais para iniciar o papo. ${isRegeneration ? "Busque detalhes mais sutis ou inusitados para estas novas opções." : ""}`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: `Ação: ${modeSpecificPrompt}` }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: isRegeneration ? 0.7 : 0, // Aumentamos a temperatura na regeneração para mais criatividade
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    if (mode === 'visual' && (!result.detailed_scores || result.detailed_scores.length === 0)) {
       result.detailed_scores = [
         { categoria: "Grooming/Pele", pontuacao: result.score || 50 },
         { categoria: "Estilo/Vestimenta", pontuacao: result.score || 50 },
         { categoria: "Simetria/Traços", pontuacao: result.score || 50 },
         { categoria: "Apresentação/Foto", pontuacao: result.score || 50 }
       ];
    }

    return result as AnalysisResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Erro na análise. Tente novamente em instantes.");
  }
};