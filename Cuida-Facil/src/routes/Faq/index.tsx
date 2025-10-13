import CabecalhoMenu from '../../components/Cabecalho/CabecalhoMenu';
import Logo from '../../components/Logo/Logo';
import { faqData } from '../../data/faqData';
 
export default function FaqPage() {
    return (
    <main>
        <Logo/>
        <CabecalhoMenu/>
        <h1>Perguntas Frequentes</h1>
            <div className="faq-container">
                {faqData.map((item, index) => (
                    <details key={index}>
                        <summary>{item.pergunta}</summary>
                        <p dangerouslySetInnerHTML={{ __html: item.resposta }}></p>
                    </details>
                ))}
            </div>
        <div className="manual-button">
            <a className="button" href="https://portaldopaciente.hc.fm.usp.br/api/doc/manual-acesso-portal" target="_blank" rel="noopener noreferrer">
                Manual de Acesso
            </a>
        </div>
    </main>
    );
}