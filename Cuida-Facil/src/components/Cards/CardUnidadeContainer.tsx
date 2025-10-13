import CardUnidade from './CardUnidade';
import type { TipoCardUnidade } from '../../types/CardTypes';

const cardsData: TipoCardUnidade[] = [
    {
        id: 1,
        cssClass: 'card-pinheiros',
        titulo: 'HC Pinheiros',
        endereco: 'Rua Dr. Ovídio Pires de Campos, 225 - Cerqueira César',
        telefone: '(11) 2661-000',
        horario: 'Seg-Sex: 7h-19h',
        servicos: [
            'Consultas Eletivas',
            'Day Clinic'
        ]
    },
    {
        id: 2,
        cssClass: 'card-central',
        titulo: 'HC Central',
        endereco: 'Av. Dr. Enéas Carvalho de Aguiar, 255 - Cerqueira César',
        telefone: '(11) 2661-5000',
        horario: '24h',
        servicos: [
            'Emergência',
            'Consultas',
            'Exames'
        ]
    },
    {
        id: 3,
        cssClass: 'card-vila-mariana',
        titulo: 'IMREA Vila Mariana',
        endereco: 'Rua Domingo de Soto, 100 - Jardim Vila Mariana',
        telefone: '(11) 5549-0111',
        horario: 'Seg - Sex: 7h às 19h',
        servicos: [
            'Emergência',
            'Consultas',
            'Exames'
        ]
    }
];

export default function CardsUnidadesContainer() {
    return (
        <>
            {cardsData.map((card) => (
                <CardUnidade key={card.id} card={card} />
            ))}
        </>
    );
}