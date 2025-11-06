export type TipoUnidade = {
  idUnidade: number;
  cdUnidade: string;       
  codigo?: string;         
  endereco: string;       
  telefone: string | null; 
  horario: string | null;  
  cep: string | null;     
  urlImagemUnidades: string | null; 
  urlImagem?: string | null;
}