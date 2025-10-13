import CardEspecialidade from './CardEspecialidade';
import type { TipoCardEspecialidade } from '../../types/CardTypes';

const cardsData: TipoCardEspecialidade[] = [
    {
        id: 1,
        cssClass: 'card-ortopedia',
        titulo: 'Ortopedia',
        descricao: 'A ortopedia é a especialidade médica responsável pelo diagnóstico, tratamento e prevenção de doenças e lesões que afetam o sistema musculoesquelético, incluindo ossos, músculos, ligamentos e articulações.'
    },
    {
        id: 2,
        cssClass: 'card-cardiologia',
        titulo: 'Cardiologia',
        descricao: 'A cardiologia é a especialidade médica que se dedica ao estudo e tratamento das doenças do coração e do sistema circulatório. Os cardiologistas são os profissionais que avaliam o funcionamento do coração, identificando condições como arritmias e insuficiência cardíaca, e indicando os melhores tratamentos.'
    },
    {
        id: 3,
        cssClass: 'card-pediatria',
        titulo: 'Pediatria',
        descricao: 'O pediatra é um médico especialista no cuidado de crianças desde o nascimento até a idade adulta, que tem o conhecimento geral necessário para agir na prevenção, diagnóstico e tratamento de doenças nessa faixa de idade, como resfriados, gastroenterite e asma. A especialidade de pediatria também é responsável por orientar a vacinação, acompanhar o ganho de peso, crescimento e desenvolvimento das habilidades das crianças.'
    }
];

export default function CardsEspecialidadesContainer() {
    return (
        <main className="cards-especialidades-medicas">
            {cardsData.map((card) => (
                <CardEspecialidade key={card.id} card={card} />
            ))}
        </main>
    );
}
