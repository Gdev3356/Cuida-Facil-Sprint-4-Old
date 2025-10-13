import { useNavigate } from 'react-router-dom';
import type { TipoCardNavegacao } from '../../types/CardTypes';
import CardBase from './CardBase';

export default function CardNavegacao({ card }: { card: TipoCardNavegacao }) {
    const navigate = useNavigate();

    return (
        <CardBase 
            cssClass={card.cssClass}
            onClick={() => navigate(card.rota)}
            clickable={true}
        >
            <div className="card-link">
                <h2>{card.titulo}</h2>
                <p>{card.descricao}</p>
            </div>
        </CardBase>
    );
}