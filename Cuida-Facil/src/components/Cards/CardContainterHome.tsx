import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AcessibilityContext';
import Card from './Card';

export default function CardContainerHome() {
    const { estaLogado } = useAuth();
    const { lerTexto, leitorAtivo } = useAccessibility();

    const cardsHome = [
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

    const cardMinhasConsultas = {
        id: 4,
        titulo: 'Minhas Consultas',
        descricao: 'Visualize, reagende ou cancele suas consultas agendadas.',
        rota: '/minhas-consultas',
        cssClass: 'card-minhas-consultas',
    };

    const cardsParaExibir = estaLogado 
        ? [...cardsHome, cardMinhasConsultas] 
        : cardsHome;

    // Função para ler o card ao passar o mouse
    const handleCardHover = (titulo: string, descricao: string) => {
        if (leitorAtivo) {
            lerTexto(`${titulo}. ${descricao}`);
        }
    };

    return (
        <main className="cards">
            {cardsParaExibir.map((card) => (
                <div
                    key={card.id}
                    onMouseEnter={() => handleCardHover(card.titulo, card.descricao)}
                >
                    <Card {...card} clickable />
                </div>
            ))}
        </main>
    );
}