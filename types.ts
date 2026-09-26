export interface IceBreakerOption {
  tipo: string;
  texto: string;
  motivo: string;
}

export interface DetailedScore {
  categoria: string;
  pontuacao: number;
}

export interface AnalysisResponse {
  analise_estrategica: string;
  opcoes: IceBreakerOption[];
  score?: number;
  detailed_scores?: DetailedScore[];
}

export type AnalysisMode = 'profile' | 'chat' | 'pickup' | 'visual';

export enum LoadingState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
}
