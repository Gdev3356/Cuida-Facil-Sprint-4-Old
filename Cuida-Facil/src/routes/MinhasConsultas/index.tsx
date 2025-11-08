import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { consultasAPI } from '../../services/api';
import type { TipoConsultaDetalhada } from '../../types/TipoConsultaDetalhada';
import { useAuth } from '../../context/AuthContext';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import PageHero from '../../components/PageHero/PageHero';
import ConsultaCard from '../../components/Cards/ConsultaCard';
import ModalReagendamento from '../../components/Modal/ModalReagendamento';

export default function MinhasConsultas() {
  const { paciente, estaLogado } = useAuth();
  const [consultas, setConsultas] = useState<TipoConsultaDetalhada[]>([]);
  const [consultasFiltradas, setConsultasFiltradas] = useState<TipoConsultaDetalhada[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtroAtivo, setFiltroAtivo] = useState<string>('todas');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  // Estados do modal de reagendamento
  const [modalReagendamentoAberto, setModalReagendamentoAberto] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState<TipoConsultaDetalhada | null>(null);

  useEffect(() => {
    if (estaLogado && paciente) {
      carregarConsultas();
    }
  }, [estaLogado, paciente]);

  useEffect(() => {
    filtrarConsultas();
  }, [filtroAtivo, consultas]);

  const carregarConsultas = async () => {
    try {
      setLoading(true);
      const data = await consultasAPI.findAll();
      
      const minhasConsultas = data.filter(
        c => c.idPaciente === paciente?.idPaciente
      );
      
      // Ordenar por data (mais recentes primeiro)
      minhasConsultas.sort((a, b) =>
        new Date(b.dataConsulta).getTime() - new Date(a.dataConsulta).getTime()
      );
      
      setConsultas(minhasConsultas);
      setConsultasFiltradas(minhasConsultas);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar consultas');
    } finally {
      setLoading(false);
    }
  };

  const filtrarConsultas = () => {
    if (filtroAtivo === 'todas') {
      setConsultasFiltradas(consultas);
    } else {
      setConsultasFiltradas(
        consultas.filter(c => c.status === filtroAtivo.toUpperCase())
      );
    }
  };

  const handleCancelar = async (idConsulta: number) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta consulta?')) {
      return;
    }

    try {
      await consultasAPI.cancelar(idConsulta);
      await carregarConsultas();
      alert('Consulta cancelada com sucesso!');
    } catch (err) {
      console.error('Erro ao cancelar consulta:', err);
      alert('Erro ao cancelar consulta. Tente novamente.');
    }
  };

  const handleAbrirReagendamento = (idConsulta: number) => {
    const consulta = consultas.find(c => c.idConsulta === idConsulta);
    if (consulta) {
      setConsultaSelecionada(consulta);
      setModalReagendamentoAberto(true);
    }
  };

  const handleConfirmarReagendamento = async (novaData: string) => {
    if (!consultaSelecionada) return;

    try {
      await consultasAPI.reagendar(consultaSelecionada.idConsulta, novaData);
      setModalReagendamentoAberto(false);
      setConsultaSelecionada(null);
      await carregarConsultas();
      alert('Consulta reagendada com sucesso!');
    } catch (err) {
      console.error('Erro ao reagendar consulta:', err);
      alert('Erro ao reagendar consulta. Tente novamente.');
    }
  };

  const handleDeletar = async (idConsulta: number) => {
    const consulta = consultas.find(c => c.idConsulta === idConsulta);
    
    if (consulta?.status !== 'CANCELADA') {
      alert('Apenas consultas canceladas podem ser excluídas!');
      return;
    }

    if (!window.confirm('Tem certeza que deseja excluir permanentemente esta consulta? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await consultasAPI.delete(idConsulta);
      await carregarConsultas();
      alert('Consulta excluída com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir consulta:', err);
      alert('Erro ao excluir consulta. Tente novamente.');
    }
  };

  const contarPorStatus = (status: string): number => {
    if (status === 'todas') return consultas.length;
    return consultas.filter(c => c.status === status.toUpperCase()).length;
  };

  const filters = [
    { label: 'Todas', value: 'todas', active: filtroAtivo === 'todas', count: contarPorStatus('todas') },
    { label: 'Agendadas', value: 'agendada', active: filtroAtivo === 'agendada', count: contarPorStatus('agendada') },
    { label: 'Reagendadas', value: 'reagendada', active: filtroAtivo === 'reagendada', count: contarPorStatus('reagendada') },
    { label: 'Concluídas', value: 'concluida', active: filtroAtivo === 'concluida', count: contarPorStatus('concluida') },
    { label: 'Canceladas', value: 'cancelada', active: filtroAtivo === 'cancelada', count: contarPorStatus('cancelada') },
  ];

  // Proteção de rota
  if (!estaLogado || !paciente) {
    return (
      <div className="app-container">
        <main className="page-main">
          <div className="protected-route-container">
            <div className="protected-route-warning">
              <div className="protected-route-icon">🔒</div>
              <h2 className="protected-route-title">Acesso Restrito</h2>
              <p className="protected-route-message">
                Você precisa estar logado para ver suas consultas.
              </p>
              <div className="protected-route-buttons">
                <Link to="/" className="protected-route-button-secondary">
                  Voltar ao Início
                </Link>
                <Link to="/login" className="protected-route-button-primary">
                  Fazer Login
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app-container">
        <main className="page-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Carregando suas consultas...</p>
          </div>
        </main>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="app-container">
        <main className="page-main">
          <div className="container">
            <p className="erro">{erro}</p>
            <button onClick={carregarConsultas} className="button">
              Tentar novamente
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <main className="page-main">
        <Breadcrumb
          items={[
            { label: 'Início', path: '/' },
            { label: 'Minhas Consultas' }
          ]}
        />

        <PageHero
          title="Minhas Consultas"
          subtitle={`Olá, ${paciente.nome}! Aqui estão suas consultas agendadas`}
          showFilters
          filters={filters}
          onFilterChange={setFiltroAtivo}
          mostrarFiltros={mostrarFiltros}
          onToggleFiltros={() => setMostrarFiltros(!mostrarFiltros)}
        />

        {consultasFiltradas.length === 0 ? (
          <div className="page-empty">
            <p>Nenhuma consulta encontrada.</p>
            <Link to="/consulta" className="button">
              Agendar Consulta
            </Link>
          </div>
        ) : (
          <div className="page-grid">
            {consultasFiltradas.map((consulta) => (
              <ConsultaCard
                key={consulta.idConsulta}
                consulta={consulta}
                onCancelar={handleCancelar}
                onReagendar={handleAbrirReagendamento}
                onDeletar={handleDeletar}
              />
            ))}
          </div>
        )}

        <div className="page-actions">
          <Link to="/consulta" className="button">
            Agendar Nova Consulta
          </Link>
        </div>
      </main>

      {/* Modal de Reagendamento */}
      {consultaSelecionada && (
        <ModalReagendamento
          isOpen={modalReagendamentoAberto}
          onClose={() => {
            setModalReagendamentoAberto(false);
            setConsultaSelecionada(null);
          }}
          onConfirm={handleConfirmarReagendamento}
          consultaAtual={{
            id: consultaSelecionada.idConsulta,
            dataAtual: consultaSelecionada.dataConsulta,
            nomeEspecialidade: consultaSelecionada.nomeEspecialidade
          }}
        />
      )}
    </div>
  );
}