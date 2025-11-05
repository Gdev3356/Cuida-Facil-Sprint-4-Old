// types/index.ts - Contexto: Barrel export para facilitar importações

export * from './TipoPaciente';
export * from './TipoMedico';
export * from './TipoUnidade';
export * from './TipoEspecialidade';
export * from './TipoServico';
export * from './TipoConsulta';
export * from './TipoConsultaDetalhada';
export * from './TipoChatbot';
export * from './TipoResponse';

// Re-exportar tipos de criação comuns
export type { TipoConsultaCreate, TipoPacienteCreate } from './TipoResponse';