import type { TipoCardUnidade } from '../../types/CardTypes';
import CardBase from './CardBase';

export default function CardUnidade({ card }: { card: TipoCardUnidade }) {
    return (
        <CardBase cssClass={`card-especialidades-medicas ${card.cssClass}`}>
            <div className="card-link">
                <h2>{card.titulo}</h2>
                
                <div className="card-body">
                    <p><strong>Endereço:</strong> {card.endereco}</p>
                    <p><strong>Telefone:</strong> {card.telefone}</p>
                    <p><strong>Horário:</strong> {card.horario}</p>
                    
                    {card.servicos.length > 0 && (
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