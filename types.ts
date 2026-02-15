export interface IceBreakerOption {
  tipo: string;
  texto: string;
  motivo: string;
}

export interface DetailedScore {
  categoria: string;
  pontuacao: number; // 0-100
}

export interface AnalysisResponse {
  analise_estrategica: string;
  opcoes: IceBreakerOption[];
  score?: number; // Pontuação Geral 0-100
  detailed_scores?: DetailedScore[]; // Pontuações por categoria (Lookmax)
}

export type AnalysisMode = 'profile' | 'chat' | 'pickup' | 'visual';

export enum LoadingState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  ERROR = 'ERROR'
}