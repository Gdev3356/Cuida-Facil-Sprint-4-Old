import type { TipoEspecialidade } from '../../types/TipoEspecialidade';
import { useAccessibility } from '../../context/AcessibilityContext'; // 1. IMPORTAR

type EspecialidadeCardProps = {
  especialidade: TipoEspecialidade;
};

export default function EspecialidadeCard({ especialidade }: EspecialidadeCardProps) {
  const { lerTexto, leitorAtivo, pararLeitura } = useAccessibility();

  const gerarCssClass = (nome: string) => {
    return `card-${nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')}`;
  };

  const cssClass = gerarCssClass(especialidade.nome);
  const imagemUrl = especialidade.urlImagemEspecialidades;


  const handleLeituraCard = () => {
    if (!leitorAtivo) return;
    
    const textoResumo = `
      Especialidade: ${especialidade.nome}. 
      ${especialidade.descricao ? `Descrição: ${especialidade.descricao}` : 'Sem descrição disponível.'}
    `;
    
    lerTexto(textoResumo);
  };

  return (
    <div
      className={`unidade-card ${cssClass}`}
      style={imagemUrl ? {
        backgroundImage: `url(${imagemUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : undefined}
      tabIndex={0}
      onMouseEnter={handleLeituraCard}
      onFocus={handleLeituraCard}
      onMouseLeave={pararLeitura}
    >
      <div className="unidade-card-overlay">
        <div className="especialidade-card-content">
          <h2 className="unidade-card-title">{especialidade.nome}</h2>
          {especialidade.descricao && (
            <p className="especialidade-descricao">{especialidade.descricao}</p>
          )}
        </div>
      </div>
    </div>
  );
}