import type { TipoConsulta } from "./Consulta";
import type { TipoPaciente } from "./TipoPaciente";

export type TipoConsultaCreate = Omit<TipoConsulta, 'idConsulta' | 'cdProtocolo'>;

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