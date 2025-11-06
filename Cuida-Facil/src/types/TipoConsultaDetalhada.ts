import type { TipoConsulta } from "./TipoConsulta";

export type TipoConsultaDetalhada = TipoConsulta & {
  nomePaciente?: string;
  nomeMedico?: string;
  nomeUnidade?: string;
  nomeEspecialidade?: string;
}
