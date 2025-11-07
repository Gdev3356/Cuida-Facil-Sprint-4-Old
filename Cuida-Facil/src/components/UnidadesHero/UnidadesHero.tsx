import { Search, Filter, X } from 'lucide-react';

type UnidadesHeroProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filtroAtivo: string;
  onFiltroChange: (filtro: string) => void;
  totalUnidades: number;
  mostrarFiltros: boolean;
  onToggleFiltros: () => void;
};

export default function UnidadesHero({
  searchTerm,
  onSearchChange,
  filtroAtivo,
  onFiltroChange,
  totalUnidades,
  mostrarFiltros,
  onToggleFiltros,
}: UnidadesHeroProps) {
  return (
    <div className="unidades-hero">
      <h1 className="unidades-hero-title">Nossas Unidades</h1>
      <p className="unidades-hero-subtitle">
        Encontre a unidade mais próxima de você e conheça nossos serviços especializados
      </p>
      
      {/* Barra de Busca */}
      <div className="unidades-search-container">
        <div className="unidades-search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou endereço..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="unidades-search-input"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="search-clear"
              aria-label="Limpar busca"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <button
          onClick={onToggleFiltros}
          className="unidades-filter-toggle"
        >
          <Filter size={20} />
          <span>Filtros</span>
        </button>
      </div>

      <div className={`unidades-filters ${mostrarFiltros ? 'show' : ''}`}>
        <button
          onClick={() => onFiltroChange('todos')}
          className={`filter-chip ${filtroAtivo === 'todos' ? 'active' : ''}`}
        >
          Todas ({totalUnidades})
        </button>
        <button
          onClick={() => onFiltroChange('emergencia')}
          className={`filter-chip ${filtroAtivo === 'emergencia' ? 'active' : ''}`}
        >
          Emergência 24h
        </button>
        <button
          onClick={() => onFiltroChange('consultas')}
          className={`filter-chip ${filtroAtivo === 'consultas' ? 'active' : ''}`}
        >
          Consultas Eletivas
        </button>
      </div>
    </div>
  );
}