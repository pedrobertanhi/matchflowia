import type { AnalysisMode, AnalysisResponse } from '../types';

interface AnalysisRequest {
  base64Image: string;
  mimeType: string;
  mode: AnalysisMode;
  isRegeneration: boolean;
}

const getErrorMessage = (value: unknown) => {
  if (value && typeof value === 'object' && 'error' in value && typeof value.error === 'string') {
    return value.error;
  }

  return 'Não foi possível concluir a análise. Tente novamente.';
};

export const analyzeImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  mode: AnalysisMode,
  isRegeneration = false,
): Promise<AnalysisResponse> => {
  const payload: AnalysisRequest = {
    base64Image,
    mimeType,
    mode,
    isRegeneration,
  };

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data as AnalysisResponse;
};
