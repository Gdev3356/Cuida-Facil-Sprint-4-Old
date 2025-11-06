import type { TipoCardUnidade } from '../../types/CardTypes';
import CardBase from './CardBase';
import type { CSSProperties } from 'react';

export default function CardUnidade({ card }: { card: TipoCardUnidade }) {
    // Se houver URL de imagem, cria style inline
    const cardStyle: CSSProperties = card.imagemUrl 
        ? {
            backgroundImage: `url(${card.imagemUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }
        : {};

    return (
        <CardBase cssClass={`card-especialidades-medicas ${card.cssClass}`}>
            <div 
                className="card-link" 
                style={cardStyle}
            >
                <h2>{card.titulo}</h2>
                
                <div className="card-body">
                    <p>
                        <strong>Endereço:</strong> {card.endereco}
                    </p>
                    <p>
                        <strong>Telefone:</strong> {card.telefone}
                    </p>
                    <p>
                        <strong>Horário:</strong> {card.horario}
                    </p>
                    
                    {card.servicos && card.servicos.length > 0 && (
                        <div className="card-text">
                            <strong>Serviços:</strong>
                            <ul>
                                {card.servicos.map((servico, index) => (
                                    <li key={index}>{servico}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </CardBase>
    );
}