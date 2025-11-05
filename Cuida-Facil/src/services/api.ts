import type { TipoPaciente } from '../types/TipoPaciente';
import type { TipoMedico } from '../types/TipoMedico';
import type { TipoUnidade } from '../types/TipoUnidade';
import type { TipoEspecialidade } from '../types/TipoEspecialidade';
import type { TipoServico } from '../types/TipoServico';
import type { TipoConsulta } from '../types/TipoConsulta';
import type { TipoConsultaDetalhada } from '../types/TipoConsultaDetalhada';
import type { 
  TipoConsultaCreate, 
  TipoPacienteCreate,
  ApiResponse,
  ApiListResponse 
} from '../types/TipoResponse';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cuida-facil-sprint-4-java.onrender.com';

// Helper para fazer requisições
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro inesperado na requisição');
  }
}

// === PACIENTES ===
export const pacientesAPI = {
  listar: () => fetchAPI<TipoPaciente[]>('/pacientes'),
  
  buscarPorId: (id: number) => fetchAPI<TipoPaciente>(`/pacientes/${id}`),
  
  buscarPorCPF: (cpf: string) => fetchAPI<TipoPaciente>(`/pacientes/cpf/${cpf}`),
  
  criar: (paciente: TipoPacienteCreate) =>
    fetchAPI<TipoPaciente>('/pacientes', {
      method: 'POST',
      body: JSON.stringify(paciente),
    }),
  
  atualizar: (id: number, paciente: Partial<TipoPaciente>) =>
    fetchAPI<TipoPaciente>(`/pacientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paciente),
    }),
  
  deletar: (id: number) =>
    fetchAPI<void>(`/pacientes/${id}`, {
      method: 'DELETE',
    }),
};

// === MÉDICOS ===
export const medicosAPI = {
  listar: () => fetchAPI<TipoMedico[]>('/medicos'),
  
  buscarPorId: (id: number) => fetchAPI<TipoMedico>(`/medicos/${id}`),
  
  buscarPorEspecialidade: (idEspecialidade: number) =>
    fetchAPI<TipoMedico[]>(`/medicos/especialidade/${idEspecialidade}`),
  
  buscarPorUnidade: (idUnidade: number) =>
    fetchAPI<TipoMedico[]>(`/medicos/unidade/${idUnidade}`),
};

// === UNIDADES ===
export const unidadesAPI = {
  listar: () => fetchAPI<TipoUnidade[]>('/unidades'),
  
  buscarPorId: (id: number) => fetchAPI<TipoUnidade>(`/unidades/${id}`),
  
  buscarPorCodigo: (codigo: string) =>
    fetchAPI<TipoUnidade>(`/unidades/codigo/${codigo}`),
  
  buscarPorCEP: (cep: string) =>
    fetchAPI<TipoUnidade[]>(`/unidades/cep/${cep}`),
};

// === ESPECIALIDADES ===
export const especialidadesAPI = {
  listar: () => fetchAPI<TipoEspecialidade[]>('/especialidades'),
  
  buscarPorId: (id: number) =>
    fetchAPI<TipoEspecialidade>(`/especialidades/${id}`),
  
  buscarPorNome: (nome: string) =>
    fetchAPI<TipoEspecialidade>(`/especialidades/nome/${nome}`),
};

// === SERVIÇOS ===
export const servicosAPI = {
  listar: () => fetchAPI<TipoServico[]>('/servicos'),
  
  buscarPorId: (id: number) => fetchAPI<TipoServico>(`/servicos/${id}`),
  
  buscarPorEspecialidade: (idEspecialidade: number) =>
    fetchAPI<TipoServico[]>(`/servicos/especialidade/${idEspecialidade}`),
  
  buscarPorUnidade: (idUnidade: number) =>
    fetchAPI<TipoServico[]>(`/servicos/unidade/${idUnidade}`),
};

// === CONSULTAS ===
export const consultasAPI = {
  listar: () => fetchAPI<TipoConsultaDetalhada[]>('/consultas'),
  
  buscarPorId: (id: number) =>
    fetchAPI<TipoConsultaDetalhada>(`/consultas/${id}`),
  
  buscarPorProtocolo: (protocolo: string) =>
    fetchAPI<TipoConsultaDetalhada>(`/consultas/protocolo/${protocolo}`),
  
  buscarPorPaciente: (idPaciente: number) =>
    fetchAPI<TipoConsultaDetalhada[]>(`/consultas/paciente/${idPaciente}`),
  
  buscarPorMedico: (idMedico: number) =>
    fetchAPI<TipoConsultaDetalhada[]>(`/consultas/medico/${idMedico}`),
  
  buscarPorStatus: (status: string) =>
    fetchAPI<TipoConsultaDetalhada[]>(`/consultas/status/${status}`),
  
  criar: (consulta: TipoConsultaCreate) =>
    fetchAPI<TipoConsulta>('/consultas', {
      method: 'POST',
      body: JSON.stringify(consulta),
    }),
  
  atualizar: (id: number, consulta: Partial<TipoConsulta>) =>
    fetchAPI<TipoConsulta>(`/consultas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(consulta),
    }),
  
  cancelar: (id: number) =>
    fetchAPI<TipoConsulta>(`/consultas/${id}/cancelar`, {
      method: 'PATCH',
    }),
  
  reagendar: (id: number, novaData: string) =>
    fetchAPI<TipoConsulta>(`/consultas/${id}/reagendar`, {
      method: 'PATCH',
      body: JSON.stringify({ dtConsulta: novaData }),
    }),
};

// Export default com todas as APIs
export default {
  pacientes: pacientesAPI,
  medicos: medicosAPI,
  unidades: unidadesAPI,
  especialidades: especialidadesAPI,
  servicos: servicosAPI,
  consultas: consultasAPI,
};