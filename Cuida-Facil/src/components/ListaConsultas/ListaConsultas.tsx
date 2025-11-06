import { useState, useEffect } from 'react';
import { consultasAPI } from '../../services/api';
import type { TipoConsultaDetalhada } from '../../types/TipoConsultaDetalhada';

export default function ListaConsultas() {
  const [consultas, setConsultas] = useState<TipoConsultaDetalhada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');

  useEffect(() => {
    carregarConsultas();
  }, [filtroStatus]);

  const carregarConsultas = async () => {
    try {
      setLoading(true);
      setError(null);

      // GET /consultas - busca todas as consultas
      const data = await consultasAPI.findAll();

      // Filtrar por status no frontend se necessário
      const consultasFiltradas = filtroStatus === 'TODOS' 
        ? data 
        : data.filter(c => c.status === filtroStatus);

      // Ordenar por data (mais recentes primeiro)
      consultasFiltradas.sort((a, b) => 
        new Date(b.dataConsulta).getTime() - new Date(a.dataConsulta).getTime()
      );

      setConsultas(consultasFiltradas);
    } catch (err) {
      console.error('Erro ao carregar consultas:', err);
      setError('Não foi possível carregar as consultas. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (idConsulta: number) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta consulta?')) {
      return;
    }

    try {
      await consultasAPI.cancelar(idConsulta);
      await carregarConsultas(); // Recarregar lista
      alert('Consulta cancelada com sucesso!');
    } catch (err) {
      console.error('Erro ao cancelar consulta:', err);
      alert('Erro ao cancelar consulta. Tente novamente.');
    }
  };

  const formatarData = (dataISO: string): string => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatarHora = (dataISO: string): string => {
    const data = new Date(dataISO);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'AGENDADA':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'REAGENDADA':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONCLUIDA':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'AGENDADA':
        return '📅 Agendada';
      case 'REAGENDADA':
        return '🔄 Reagendada';
      case 'CONCLUIDA':
        return '✓ Concluída';
      case 'CANCELADA':
        return '✗ Cancelada';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando consultas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
          <h3 className="font-bold mb-2">Erro ao carregar consultas</h3>
          <p>{error}</p>
          <button
            onClick={carregarConsultas}
            className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Minhas Consultas</h1>

        <div className="flex gap-2 flex-wrap">
          {['TODOS', 'AGENDADA', 'REAGENDADA', 'CONCLUIDA', 'CANCELADA'].map(status => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtroStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'TODOS' ? 'Todas' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {consultas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">Nenhuma consulta encontrada.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {consultas.map(consulta => (
            <div
              key={consulta.idConsulta}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {consulta.idEspecialidade || 'Especialidade'}
                  </h3>
                  <p className="text-sm text-gray-500">Protocolo: {consulta.protocolo}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    consulta.status
                  )}`}
                >
                  {getStatusLabel(consulta.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Data e Horário</p>
                  <p className="font-medium text-gray-800">
                    {formatarData(consulta.dataConsulta)} às {formatarHora(consulta.dataConsulta)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Tipo de Atendimento</p>
                  <p className="font-medium text-gray-800">
                    {consulta.tipoAtendimento === 'PRESENCIAL' ? '🏥 Presencial' : '💻 Teleconsulta'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Médico</p>
                  <p className="font-medium text-gray-800">{consulta.idMedico || 'Não informado'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Unidade</p>
                  <p className="font-medium text-gray-800">{consulta.idUnidade || 'Não informada'}</p>
                </div>
              </div>

              {consulta.status === 'AGENDADA' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleCancelar(consulta.idConsulta)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors font-medium"
                  >
                    Cancelar Consulta
                  </button>
                  <button
                    className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors font-medium"
                    onClick={() => alert('Funcionalidade de reagendamento em desenvolvimento')}
                  >
                    Reagendar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}