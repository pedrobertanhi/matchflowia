
export interface IceBreakerOption {
  tipo: string;
  texto: string;
  motivo: string;
}

export interface AnalysisResponse {
  analise_estrategica: string;
  opcoes: IceBreakerOption[];
}

export type AnalysisMode = 'profile' | 'chat' | 'pickup';

export enum LoadingState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  ERROR = 'ERROR'
}
