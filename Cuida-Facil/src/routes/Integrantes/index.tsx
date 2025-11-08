import CabecalhoMenu from '../../components/Cabecalho/CabecalhoMenu';
import Logo from '../../components/Logo/Logo';
import { integrantesData } from '../../data/integrantesData';
import type { TipoIntegrante } from '../../types/Integrante';
import { useAccessibility } from '../../context/AcessibilityContext';
 
function CardIntegrante({ integrante }: { integrante: TipoIntegrante }) {
    const { lerTexto, pararLeitura } = useAccessibility();

    const handleLeituraCard = () => {
        const texto = `Integrante: ${integrante.nome}, RM: ${integrante.rm}, Turma: ${integrante.turma}.`;
        lerTexto(texto);
    };

    const handleLeituraLink = (plataforma: string) => {
        lerTexto(`Link para o ${plataforma} de ${integrante.nome}`);
    };

    return (
        <div 
            className="card_integrantes"
            onMouseEnter={handleLeituraCard}
            onFocus={handleLeituraCard}
            onMouseLeave={pararLeitura}
            tabIndex={0}
        >
            <img src={integrante.imageUrl} alt={`Foto de ${integrante.nome}`} />
        <p>
            <strong>{integrante.nome}</strong><br />
            {integrante.rm}<br />
            {integrante.turma}
        </p>
            <a 
                className="button" 
                href={integrante.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onMouseEnter={() => handleLeituraLink('GitHub')}
                onFocus={() => handleLeituraLink('GitHub')}
                onMouseLeave={pararLeitura}
            >
                GitHub
            </a>
            <a 
                className="button" 
                href={integrante.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onMouseEnter={() => handleLeituraLink('LinkedIn')}
                onFocus={() => handleLeituraLink('LinkedIn')}
                onMouseLeave={pararLeitura}
            >
                LinkedIn
            </a>
        </div>
    );
}
 
export default function IntegrantesPage() {
    const { lerTexto, pararLeitura } = useAccessibility();

    return (
    <main>
        <Logo/>
        <CabecalhoMenu/>
        <h1
            onMouseEnter={() => lerTexto("Título da Página: Integrantes da Equipe")}
            onFocus={() => lerTexto("Título da Página: Integrantes da Equipe")}
            onMouseLeave={pararLeitura}
            tabIndex={0}
        >
            Integrantes
        </h1>
            <div className="integrantes">
                {integrantesData.map(integrante => (
                <CardIntegrante key={integrante.rm} integrante={integrante} />
                ))}
            </div>
    </main>
    );
}