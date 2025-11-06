export type TipoPaciente = {
  idPaciente: number;
  cpf: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  dataNascimento: string; // ISO date: "1990-05-15"
  cep: string | null;
}