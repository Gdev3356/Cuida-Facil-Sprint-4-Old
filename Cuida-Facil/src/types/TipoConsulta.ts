export type TipoConsulta = {
  idConsulta: number;
  cdProtocolo: string;
  dtConsulta: string; // ISO timestamp string
  flStatus: 'AGENDADA' | 'REAGENDADA' | 'CONCLUIDA' | 'CANCELADA';
  tpAtendimento: 'PRESENCIAL' | 'TELECONSULTA';
  idPaciente: number;
  idMedico: number;
  idUnidade: number;
  idEspecialidade: number;
}