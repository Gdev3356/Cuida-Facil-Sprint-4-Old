import { Search, Filter, X } from 'lucide-react';

type PageHeroProps = {
  title: string;
  subtitle: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showFilters?: boolean;
  filters?: {
    label: string;
    value: string;
    active: boolean;
    count?: number;
  }[];
  onFilterChange?: (value: string) => void;
  mostrarFiltros?: boolean;
  onToggleFiltros?: () => void;
};

export default function PageHero({
  title,
  subtitle,
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  showFilters = false,
  filters = [],
  onFilterChange,
  mostrarFiltros = false,
  onToggleFiltros,
}: PageHeroProps) {
  const hasSearch = !!onSearchChange;
  const hasFilterChips = filters.length > 0;

  return (
    <div className="page-hero">
      <h1 className="page-hero-title">{title}</h1>
      <p className="page-hero-subtitle">{subtitle}</p>
      
      {hasSearch && (
        <div className="page-search-container">
          <div className="page-search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="page-search-input"
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
          
          {showFilters && onToggleFiltros && (
            <button
              onClick={onToggleFiltros}
              className="page-filter-toggle"
            >
              <Filter size={20} />
              <span>Filtros</span>
            </button>
          )}
        </div>
      )}

      {hasFilterChips && onFilterChange && (
        <div className={`page-filters ${mostrarFiltros ? 'show' : ''}`}>
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`filter-chip ${filter.active ? 'active' : ''}`}
            >
              {filter.label} {filter.count !== undefined && `(${filter.count})`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}