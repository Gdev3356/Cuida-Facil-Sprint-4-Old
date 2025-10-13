import CardNavegacao from './CardNavegacao';
import type { TipoCardNavegacao } from '../../types/CardTypes';

const cardsData: TipoCardNavegacao[] = [
    {
        id: 1,
        titulo: 'Especialidades',
        descricao: 'Aqui você irá encontrar mais informações sobre qual é a função de cada especialidade médica.',
        rota: '/especialidades',
        cssClass: 'card-especialidades',
    },
    {
        id: 2,
        titulo: 'Marcar Consulta',
        descricao: 'Marque uma consulta no momento e horário mais favorável para você.',
        rota: '/consulta',
        cssClass: 'card-consulta',
    },
    {
        id: 3,
        titulo: 'Unidades',
        descricao: 'Encontre aqui informações importantes sobre as unidades mais próximas de você!',
        rota: '/unidades',
        cssClass: 'card-unidades',
    }
];

export default function CardsContainer() {
    return (
        <main className="cards">
            {cardsData.map((card) => (
                <CardNavegacao key={card.id} card={card} />
            ))}
        </main>
    );
}