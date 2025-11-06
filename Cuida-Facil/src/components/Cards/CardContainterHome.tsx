import Card from './Card';

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

export default function CardContainerHome() {
    return (
        <main className="cards">
            {cardsHome.map((card) => (
                <Card key={card.id} {...card} clickable />
            ))}
        </main>
    );
}