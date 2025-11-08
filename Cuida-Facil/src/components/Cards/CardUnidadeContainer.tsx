import { MapPin, Clock, Phone } from 'lucide-react';
import type { TipoUnidade } from '../../types/TipoUnidade';
import { useAccessibility } from '../../context/AcessibilityContext'; // 1. IMPORTAR

type UnidadeCardProps = {
  unidade: TipoUnidade;
  imagemUrl?: string;
  cssClass: string;
  servicos: string[];
};

export default function UnidadeCard({ unidade, imagemUrl, cssClass, servicos }: UnidadeCardProps) {
  const badgeType = unidade.horario?.includes('24h') ? 'emergencia' : 'consulta';

  const { lerTexto, leitorAtivo, pararLeitura } = useAccessibility();

  const handleLeituraCard = () => {
    if (!leitorAtivo) return;

    const tipoAtendimento = badgeType === 'emergencia' ? 'Atendimento 24 horas.' : 'Atendimento Eletivo.';
    const servicosTexto = servicos.length > 0 ? `Serviços: ${servicos.join(', ')}.` : 'Sem serviços listados.';
    
    const textoResumo = `
      Unidade: ${unidade.cdUnidade}. 
      ${tipoAtendimento}
      Endereço: ${unidade.endereco}.
      ${unidade.telefone ? `Telefone: ${unidade.telefone}.` : ''}
      ${unidade.horario ? `Horário: ${unidade.horario}.` : ''}
      ${servicosTexto}
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
        <div className="unidade-card-header">
          <h2 className="unidade-card-title">{unidade.cdUnidade}</h2>
          <span className={`unidade-badge ${badgeType}`}>
            {badgeType === 'emergencia' ? '24H' : 'ELETIVA'}
          </span>
        </div>

        <div className="unidade-card-body">
          <div className="unidade-info">
            <MapPin size={14} className="info-icon" />
            <p className="info-text">{unidade.endereco}</p>
          </div>

          {unidade.telefone && (
            <div className="unidade-info">
              <Phone size={14} className="info-icon" />
              <p className="info-text">{unidade.telefone}</p>
            </div>
          )}

          {unidade.horario && (
            <div className="unidade-info">
              <Clock size={14} className="info-icon" />
              <p className="info-text">{unidade.horario}</p>
            </div>
          )}
        </div>

        <div className="unidade-card-footer">
          <div className="servicos-tags">
            {servicos.map((servico, idx) => (
              <span key={idx} className="servico-tag">
                {servico}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}