import CabecalhoMenu from '../../components/Cabecalho/CabecalhoMenu';
import Logo from '../../components/Logo/Logo';
import { integrantesData } from '../../data/integrantesData';
import type { TipoIntegrante } from '../../types/Integrante';
 
function CardIntegrante({ integrante }: { integrante: TipoIntegrante }) {
    return (
        <div className="card_integrantes">
            <img src={integrante.imageUrl} alt={`Foto de ${integrante.nome}`} />
        <p>
            <strong>{integrante.nome}</strong><br />
            {integrante.rm}<br />
            {integrante.turma}
        </p>
            <a className="button" href={integrante.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="button" href={integrante.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
    );
}
 
export default function IntegrantesPage() {
    return (
    <main>
        <Logo/>
        <CabecalhoMenu/>
        <h1>Integrantes</h1>
            <div className="integrantes">
                {integrantesData.map(integrante => (
                <CardIntegrante key={integrante.rm} integrante={integrante} />
                ))}
            </div>
    </main>
    );
}
