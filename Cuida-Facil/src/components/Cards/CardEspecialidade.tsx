import type { TipoEspecialidade } from '../../types/TipoEspecialidade';

type EspecialidadeCardProps = {
  especialidade: TipoEspecialidade;
};

export default function EspecialidadeCard({ especialidade }: EspecialidadeCardProps) {
  const gerarCssClass = (nome: string) => {
    return `card-${nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')}`;
  };

  const cssClass = gerarCssClass(especialidade.nome);
  const imagemUrl = especialidade.urlImagemEspecialidades;

  return (
    <div
      className={`unidade-card ${cssClass}`}
      style={imagemUrl ? {
        backgroundImage: `url(${imagemUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : undefined}
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