export type TipoChatbot = {
  idAtendimento: number;
  idPaciente: number;
  horaInteracao: string; // ISO timestamp
  intencaoUsuario: string;
  textoResposta: string;
}