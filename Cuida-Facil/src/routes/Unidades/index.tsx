import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { unidadesAPI } from '../../services/api';
import type { TipoUnidade } from '../../types/TipoUnidade';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import UnidadesHero from '../../components/UnidadesHero/UnidadesHero';
import UnidadesGrid from '../../components/UnidadesGrid/UnidadesGrid';

export default function Unidades() {
  const [unidades, setUnidades] = useState<TipoUnidade[]>([]);
  const [unidadesFiltradas, setUnidadesFiltradas] = useState<TipoUnidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState<string>('todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    carregarUnidades();
  }, []);

  useEffect(() => {
    filtrarUnidades();
  }, [searchTerm, filtroAtivo, unidades]);

  const carregarUnidades = async () => {
    try {
      setLoading(true);
      const data = await unidadesAPI.findAll();
      setUnidades(data);
      setUnidadesFiltradas(data);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar unidades');
    } finally {
      setLoading(false);
    }
  };

  const filtrarUnidades = () => {
    let resultado = [...unidades];

    if (searchTerm) {
      resultado = resultado.filter(u =>
        u.cdUnidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.endereco.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filtroAtivo === 'emergencia') {
      resultado = resultado.filter(u => u.horario?.includes('24h'));
    } else if (filtroAtivo === 'consultas') {
      resultado = resultado.filter(u => !u.horario?.includes('24h'));
    }

    setUnidadesFiltradas(resultado);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFiltroAtivo('todos');
  };

  if (loading) {
    return (
      <div className="app-container">
        <main className="unidades-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Carregando unidades...</p>
          </div>
        </main>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="app-container">
        <main className="unidades-main">
          <div className="container">
            <p className="erro">{erro}</p>
            <button onClick={carregarUnidades} className="button">
              Tentar novamente
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <main className="unidades-main">
        <Breadcrumb 
          items={[
            { label: 'Início', path: '/' },
            { label: 'Unidades' }
          ]} 
        />

        <UnidadesHero
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filtroAtivo={filtroAtivo}
          onFiltroChange={setFiltroAtivo}
          totalUnidades={unidades.length}
          mostrarFiltros={mostrarFiltros}
          onToggleFiltros={() => setMostrarFiltros(!mostrarFiltros)}
        />

        <UnidadesGrid
          unidades={unidadesFiltradas}
          onClearFilters={handleClearFilters}
        />
      </main>
    </div>
  );
}