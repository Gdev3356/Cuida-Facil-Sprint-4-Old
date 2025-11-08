import { useState, useEffect } from 'react';
import { especialidadesAPI } from '../../services/api';
import type { TipoEspecialidade } from '../../types/TipoEspecialidade';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import PageHero from '../../components/PageHero/PageHero';
import EspecialidadeCard from '../../components/Cards/CardEspecialidade';

export default function Especialidades() {
  const [especialidades, setEspecialidades] = useState<TipoEspecialidade[]>([]);
  const [especialidadesFiltradas, setEspecialidadesFiltradas] = useState<TipoEspecialidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    carregarEspecialidades();
  }, []);

  useEffect(() => {
    filtrarEspecialidades();
  }, [searchTerm, especialidades]);

  const carregarEspecialidades = async () => {
    try {
      setLoading(true);
      const data = await especialidadesAPI.findAll();
      setEspecialidades(data);
      setEspecialidadesFiltradas(data);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar especialidades');
    } finally {
      setLoading(false);
    }
  };

  const filtrarEspecialidades = () => {
    if (!searchTerm) {
      setEspecialidadesFiltradas(especialidades);
      return;
    }

    const resultado = especialidades.filter(e =>
      e.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.descricao && e.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setEspecialidadesFiltradas(resultado);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="app-container">
        <main className="page-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Carregando especialidades...</p>
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
            <button onClick={carregarEspecialidades} className="button">
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
            { label: 'Especialidades' }
          ]}
        />

        <PageHero
          title="Especialidades Médicas"
          subtitle="Conheça todas as especialidades disponíveis no Hospital das Clínicas"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Buscar especialidade..."
        />

        {especialidadesFiltradas.length === 0 ? (
          <div className="page-empty">
            <p>Nenhuma especialidade encontrada.</p>
            <button onClick={handleClearFilters} className="button">
              Limpar busca
            </button>
          </div>
        ) : (
          <div className="page-grid">
            {especialidadesFiltradas.map((especialidade) => (
              <EspecialidadeCard
                key={especialidade.idEspecialidade}
                especialidade={especialidade}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}