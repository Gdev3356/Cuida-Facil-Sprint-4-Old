import UnidadeCard from '../Cards/CardUnidadeContainer';
import type { TipoUnidade } from '../../types/TipoUnidade';

type UnidadesGridProps = {
  unidades: TipoUnidade[];
  onClearFilters: () => void;
};

const IMAGENS_FALLBACK: Record<string, string> = {
  'hc-pinheiros': '/assets/img/hcpinheiros.png',
  'ichc-central': '/assets/img/hccentral.png',
  'imrea-vila-mariana': '/assets/img/hcvilamariana.png',
};

export default function UnidadesGrid({ unidades, onClearFilters }: UnidadesGridProps) {
  const gerarCssClass = (codigo: string) =>
    `card-${codigo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`;

  const obterImagem = (unidade: TipoUnidade, cssClass: string) =>
    unidade.urlImagemUnidades || unidade.urlImagem || IMAGENS_FALLBACK[cssClass.replace('card-', '')];

  const extrairServicos = (unidade: TipoUnidade) => {
    const servicos = [];
    if (unidade.horario?.includes('24h')) servicos.push('Emergência 24h');
    else servicos.push('Consultas Eletivas');
    if (!servicos.includes('Emergência 24h')) servicos.push('Consultas');
    servicos.push('Exames');
    if (unidade.cdUnidade?.toLowerCase().includes('pinheiros')) servicos.push('Day Clinic');
    return servicos;
  };

  if (unidades.length === 0) {
    return (
      <div className="unidades-empty">
        <p>Nenhuma unidade encontrada com os filtros selecionados.</p>
        <button onClick={onClearFilters} className="button">
          Limpar filtros
        </button>
      </div>
    );
  }

  return (
    <div className="unidades-grid">
      {unidades.map((unidade) => {
        const cssClass = gerarCssClass(unidade.cdUnidade);
        const imagemUrl = obterImagem(unidade, cssClass);
        const servicos = extrairServicos(unidade);

        return (
          <UnidadeCard
            key={unidade.idUnidade}
            unidade={unidade}
            imagemUrl={imagemUrl}
            cssClass={cssClass}
            servicos={servicos}
          />
        );
      })}
    </div>
  );
}