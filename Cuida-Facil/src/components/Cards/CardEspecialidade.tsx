import type { TipoCardEspecialidade } from '../../types/CardTypes';
import CardBase from './CardBase';

type CardEspecialidadeProps = {
    card: TipoCardEspecialidade;
}

export default function CardEspecialidade({ card }: CardEspecialidadeProps) {
    return (
        <CardBase cssClass={`card-especialidades-medicas ${card.cssClass}`}>
            <div className="card-link">
                <h2>{card.titulo}</h2>
                <p>{card.descricao}</p>
            </div>
        </CardBase>
    );
}