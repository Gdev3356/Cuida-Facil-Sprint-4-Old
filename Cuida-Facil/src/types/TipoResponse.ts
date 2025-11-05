import type { TipoConsulta } from './TipoConsulta';
import type { TipoPaciente } from './TipoPaciente';

export type TipoConsultaCreate = Omit<TipoConsulta, 'idConsulta' | 'protocolo'>;

export type TipoPacienteCreate = Omit<TipoPaciente, 'idPaciente'>;

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export type ApiListResponse<T> = {
  success: boolean;
  data?: T[];
  total?: number;
  message?: string;
  error?: string;
};