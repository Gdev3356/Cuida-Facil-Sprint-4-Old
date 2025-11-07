import type { TipoPaciente } from '../types/TipoPaciente';
import type { TipoMedico } from '../types/TipoMedico';
import type { TipoUnidade } from '../types/TipoUnidade';
import type { TipoEspecialidade } from '../types/TipoEspecialidade';
import type { TipoServico } from '../types/TipoServico';
import type { TipoConsulta } from '../types/TipoConsulta';
import type { TipoConsultaDetalhada } from '../types/TipoConsultaDetalhada';
import type { 
  TipoConsultaCreate, 
  TipoPacienteCreate
} from '../types/TipoResponse';

const API_BASE_URL = import.meta.env.VITE_API_URL_BASE;

// Helper para fazer requisições com logs detalhados
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const method = options?.method || 'GET';
    
    console.log(`${method} ${url}`);
    
    if (options?.body) {
      console.log('Payload:', options.body);
    }
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ${response.status}:`, errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Erro desconhecido' };
      }
      
      const errorMessage = errorData.message || errorData.error || `Erro na requisição: ${response.status}`;
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    const hasBody = response.headers.get('content-length') !== '0';

    if (!hasBody || response.status === 204 || (contentType && !contentType.includes('application/json'))) {
      console.log('Requisição bem-sucedida (sem conteúdo ou não-JSON esperado)');
      return undefined as T; 
    }

    const data = await response.json();
    console.log('Resposta recebida:', data);
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro inesperado na requisição');
  }
}

// Pacientes
export const pacientesAPI = {
  findAll: () => fetchAPI<TipoPaciente[]>('/pacientes'),
  
  findById: (id: number) => fetchAPI<TipoPaciente>(`/pacientes/${id}`),
  
  save: (paciente: TipoPacienteCreate) =>
    fetchAPI<TipoPaciente>('/pacientes', {
      method: 'POST',
      body: JSON.stringify(paciente),
    }),
  
  update: (id: number, paciente: TipoPaciente) =>
    fetchAPI<TipoPaciente>(`/pacientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paciente),
    }),
  
  delete: (id: number) =>
    fetchAPI<void>(`/pacientes/${id}`, {
      method: 'DELETE',
    }),
};

// Médicos
export const medicosAPI = {
  findAll: () => fetchAPI<TipoMedico[]>('/medicos'),
  
  findById: (id: number) => fetchAPI<TipoMedico>(`/medicos/${id}`),
  
  save: (medico: Omit<TipoMedico, 'idMedico'>) =>
    fetchAPI<TipoMedico>('/medicos', {
      method: 'POST',
      body: JSON.stringify(medico),
    }),
  
  update: (id: number, medico: TipoMedico) =>
    fetchAPI<TipoMedico>(`/medicos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medico),
    }),
  
  delete: (id: number) =>
    fetchAPI<void>(`/medicos/${id}`, {
      method: 'DELETE',
    }),
};

// Unidades
export const unidadesAPI = {
  findAll: () => fetchAPI<TipoUnidade[]>('/unidades'),
  
  findById: (id: number) => fetchAPI<TipoUnidade>(`/unidades/${id}`),
  
  save: (unidade: Omit<TipoUnidade, 'idUnidade'>) =>
    fetchAPI<TipoUnidade>('/unidades', {
      method: 'POST',
      body: JSON.stringify(unidade),
    }),
  
  update: (id: number, unidade: TipoUnidade) =>
    fetchAPI<TipoUnidade>(`/unidades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(unidade),
    }),
  
  delete: (id: number) =>
    fetchAPI<void>(`/unidades/${id}`, {
      method: 'DELETE',
    }),
};

// Especialidades
export const especialidadesAPI = {
  findAll: () => fetchAPI<TipoEspecialidade[]>('/especialidades'),
  
  findById: (id: number) =>
    fetchAPI<TipoEspecialidade>(`/especialidades/${id}`),
  
  save: (especialidade: Omit<TipoEspecialidade, 'idEspecialidade'>) =>
    fetchAPI<TipoEspecialidade>('/especialidades', {
      method: 'POST',
      body: JSON.stringify(especialidade),
    }),
  
  update: (id: number, especialidade: TipoEspecialidade) =>
    fetchAPI<TipoEspecialidade>(`/especialidades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(especialidade),
    }),
  
  delete: (id: number) =>
    fetchAPI<void>(`/especialidades/${id}`, {
      method: 'DELETE',
    }),
};

// Serviços
export const servicosAPI = {
  findAll: () => fetchAPI<TipoServico[]>('/servicos'),
  
  findById: (id: number) => fetchAPI<TipoServico>(`/servicos/${id}`),
  
  save: (servico: Omit<TipoServico, 'idServico'>) =>
    fetchAPI<TipoServico>('/servicos', {
      method: 'POST',
      body: JSON.stringify(servico),
    }),
  
  update: (id: number, servico: TipoServico) =>
    fetchAPI<TipoServico>(`/servicos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(servico),
    }),
  
  delete: (id: number) =>
    fetchAPI<void>(`/servicos/${id}`, {
      method: 'DELETE',
    }),
};

// Consultas
export const consultasAPI = {
  // Listar todas as consultas
  findAll: () => fetchAPI<TipoConsultaDetalhada[]>('/consultas'),
  
  // Buscar consulta por ID
  findById: (id: number) =>
    fetchAPI<TipoConsultaDetalhada>(`/consultas/${id}`),
  
  // Criar nova consulta
  save: (consulta: TipoConsultaCreate) =>
    fetchAPI<TipoConsulta>('/consultas', {
      method: 'POST',
      body: JSON.stringify(consulta),
    }),
  
  // Alias para save (mais semântico)
  criar: (consulta: TipoConsultaCreate) =>
    fetchAPI<TipoConsulta>('/consultas', {
      method: 'POST',
      body: JSON.stringify(consulta),
    }),
  
  // Atualizar consulta completa
  update: (id: number, consulta: TipoConsulta) =>
    fetchAPI<TipoConsulta>(`/consultas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(consulta),
    }),
  
  // Deletar consulta
  delete: (id: number) =>
    fetchAPI<void>(`/consultas/${id}`, {
      method: 'DELETE',
    }),
  
  // Helper: Cancelar consulta
  cancelar: async (idConsulta: number) => {
    console.log(`Cancelando consulta ${idConsulta}`);
    
    // Busca a consulta atual
    const consulta = await fetchAPI<TipoConsultaDetalhada>(`/consultas/${idConsulta}`);
    
    // Atualiza apenas o status
    const consultaCancelada = { 
      ...consulta, 
      status: 'CANCELADA' as const 
    };
    
    return fetchAPI<TipoConsulta>(`/consultas/${idConsulta}`, {
      method: 'PUT',
      body: JSON.stringify(consultaCancelada),
    });
  },
  
  // Helper: Reagendar consulta
  reagendar: async (idConsulta: number, novaData: string) => {
    console.log(`Reagendando consulta ${idConsulta} para ${novaData}`);
    
    // Busca a consulta atual
    const consulta = await fetchAPI<TipoConsultaDetalhada>(`/consultas/${idConsulta}`);
    
    // Atualiza data e status
    const consultaReagendada = { 
      ...consulta, 
      dataConsulta: novaData,
      status: 'REAGENDADA' as const 
    };
    
    return fetchAPI<TipoConsulta>(`/consultas/${idConsulta}`, {
      method: 'PUT',
      body: JSON.stringify(consultaReagendada),
    });
  },
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