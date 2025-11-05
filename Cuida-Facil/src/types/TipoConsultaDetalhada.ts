import type { TipoConsulta } from './TipoConsulta'; 

export type TipoConsultaDetalhada = TipoConsulta & {
  nmPaciente?: string;
  nmMedico?: string;
  cdUnidade?: string;
  nmEspecialidade?: string;
}