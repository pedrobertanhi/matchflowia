import { GoogleGenAI, Type } from '@google/genai';

const allowedModes = new Set(['profile', 'chat', 'pickup', 'visual']);
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maxImageBytes = 5 * 1024 * 1024;

const systemInstruction = `
Você é o motor de inteligência estética e social do MatchFlow.AI. Produza análises objetivas, respeitosas e consistentes.

MODO VISUAL:
- Avalie apresentação, iluminação, estilo e cuidados pessoais observáveis.
- Não faça inferências sobre saúde, etnia, orientação sexual, personalidade ou valor pessoal.
- Gere três melhorias práticas e diretas.
- Use pontuações apenas como referência visual, sem tratá-las como medida objetiva de beleza.

MODO CONVERSA:
- Se a imagem não mostrar uma conversa, inicie analise_estrategica com "[AVISO DE CATEGORIA]:".
- Em uma conversa válida, gere três respostas usando contexto e uma pergunta aberta.

MODO PERFIL E CANTADA:
- Gere abordagens respeitosas com base apenas em elementos visíveis.
- Evite conteúdo sexual explícito, manipulação, assédio ou linguagem ofensiva.

Responda em português do Brasil e não use emojis nos campos de texto.
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    analise_estrategica: { type: Type.STRING },
    score: { type: Type.NUMBER },
    detailed_scores: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          categoria: { type: Type.STRING },
          pontuacao: { type: Type.NUMBER },
        },
        required: ['categoria', 'pontuacao'],
      },
    },
    opcoes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tipo: { type: Type.STRING },
          texto: { type: Type.STRING },
          motivo: { type: Type.STRING },
        },
        required: ['tipo', 'texto', 'motivo'],
      },
    },
  },
  required: ['analise_estrategica', 'opcoes'],
};

export class RequestError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'RequestError';
    this.statusCode = statusCode;
  }
}

const estimateDecodedBytes = (base64) => {
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
};

const validatePayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw new RequestError(400, 'Corpo da requisição inválido.');
  }

  const { base64Image, mimeType, mode, isRegeneration } = payload;

  if (typeof base64Image !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(base64Image)) {
    throw new RequestError(400, 'Imagem inválida.');
  }

  if (!allowedMimeTypes.has(mimeType)) {
    throw new RequestError(415, 'Use uma imagem JPEG, PNG ou WebP.');
  }

  if (!allowedModes.has(mode)) {
    throw new RequestError(400, 'Modo de análise inválido.');
  }

  if (estimateDecodedBytes(base64Image) > maxImageBytes) {
    throw new RequestError(413, 'A imagem deve ter no máximo 5 MB.');
  }

  return {
    base64Image,
    mimeType,
    mode,
    isRegeneration: isRegeneration === true,
  };
};

const getModePrompt = (mode, isRegeneration) => {
  const variation = isRegeneration
    ? 'Gere alternativas diferentes das mais óbvias, mantendo relevância e respeito.'
    : '';

  if (mode === 'visual') {
    return `Analise apresentação, iluminação, enquadramento, cabelo, pele e vestimenta. Gere três melhorias aplicáveis. ${variation}`;
  }

  if (mode === 'chat') {
    return `Confirme se a imagem mostra uma conversa. Se mostrar, gere três respostas contextuais. ${variation}`;
  }

  if (mode === 'pickup') {
    return `Gere três abordagens curtas, respeitosas e relacionadas ao cenário visível. ${variation}`;
  }

  return `Encontre detalhes visuais úteis para iniciar uma conversa respeitosa. ${variation}`;
};

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const runWithRetry = async (operation, remainingAttempts = 2, delay = 1000) => {
  try {
    return await operation();
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : '';
    const canRetry = remainingAttempts > 0 && (message.includes('429') || message.includes('too many requests'));

    if (!canRetry) {
      throw error;
    }

    await sleep(delay);
    return runWithRetry(operation, remainingAttempts - 1, delay * 2);
  }
};

const normalizeScore = (value, fallback = 50) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(Math.min(100, Math.max(0, number))) : fallback;
};

const normalizeResponse = (value, mode) => {
  if (!value || typeof value !== 'object' || !Array.isArray(value.opcoes)) {
    throw new RequestError(502, 'O provedor de IA retornou uma resposta inválida.');
  }

  const score = normalizeScore(value.score);
  const options = value.opcoes
    .filter((item) => item && typeof item === 'object')
    .slice(0, 3)
    .map((item) => ({
      tipo: String(item.tipo ?? '').trim(),
      texto: String(item.texto ?? '').trim(),
      motivo: String(item.motivo ?? '').trim(),
    }))
    .filter((item) => item.tipo && item.texto && item.motivo);

  if (options.length === 0) {
    throw new RequestError(502, 'O provedor de IA não retornou sugestões utilizáveis.');
  }

  const response = {
    analise_estrategica: String(value.analise_estrategica ?? '').trim(),
    opcoes: options,
  };

  if (mode === 'visual') {
    const categories = Array.isArray(value.detailed_scores) ? value.detailed_scores : [];
    response.score = score;
    response.detailed_scores = categories.length > 0
      ? categories.slice(0, 6).map((item) => ({
          categoria: String(item?.categoria ?? '').trim(),
          pontuacao: normalizeScore(item?.pontuacao, score),
        })).filter((item) => item.categoria)
      : [
          { categoria: 'Cuidados pessoais', pontuacao: score },
          { categoria: 'Estilo e vestimenta', pontuacao: score },
          { categoria: 'Iluminação', pontuacao: score },
          { categoria: 'Enquadramento', pontuacao: score },
        ];
  }

  return response;
};

export const analyzeImage = async (input) => {
  const payload = validatePayload(input);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new RequestError(503, 'A integração com a IA não está configurada.');
  }

  const client = new GoogleGenAI({ apiKey });
  const response = await runWithRetry(() => client.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: payload.mimeType, data: payload.base64Image } },
        { text: getModePrompt(payload.mode, payload.isRegeneration) },
      ],
    },
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema,
      temperature: payload.isRegeneration ? 0.7 : 0.2,
    },
  }));

  let parsed;

  try {
    parsed = JSON.parse(response.text ?? '{}');
  } catch {
    throw new RequestError(502, 'O provedor de IA retornou uma resposta inválida.');
  }

  return normalizeResponse(parsed, payload.mode);
};
