export type TipoConsulta = {
  idConsulta: number;
  protocolo: string;
  dataConsulta: string; // ISO timestamp string 
  status: 'AGENDADA' | 'REAGENDADA' | 'CONCLUIDA' | 'CANCELADA';
  tipoAtendimento: 'PRESENCIAL' | 'TELECONSULTA';
  idPaciente: number;
  idMedico: number;
  idUnidade: number;
  idEspecialidade: number;
}