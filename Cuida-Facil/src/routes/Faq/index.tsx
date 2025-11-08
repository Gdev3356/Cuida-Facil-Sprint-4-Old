import CabecalhoMenu from '../../components/Cabecalho/CabecalhoMenu';
import Logo from '../../components/Logo/Logo';
import { faqData } from '../../data/faqData';
import { useAccessibility } from '../../context/AcessibilityContext';
 
export default function FaqPage() {
    const { lerTexto, pararLeitura } = useAccessibility();

    const handleFaqHover = (pergunta: string, resposta: string) => {
        lerTexto(`Pergunta: ${pergunta}. Resposta: ${resposta.replace(/<[^>]*>?/gm, '')}`);
    };

    const handlePerguntaHover = (pergunta: string) => {
        lerTexto(`Pergunta: ${pergunta}. Clique para expandir a resposta.`);
    };
 
    return (
    <main>
        <Logo/>
        <CabecalhoMenu/>
        <h1
            onMouseEnter={() => lerTexto("Perguntas Frequentes")}
            onFocus={() => lerTexto("Perguntas Frequentes")}
            onMouseLeave={pararLeitura}
            tabIndex={0}
        >
            Perguntas Frequentes
        </h1>
            <div className="faq-container">
                {faqData.map((item, index) => (
                    <details 
                        key={index}
                        onToggle={(e) => {
                            const details = e.target as HTMLDetailsElement;
                            if (details.open) {
                                handleFaqHover(item.pergunta, item.resposta);
                            } else {
                                pararLeitura();
                            }
                        }}
                    >
                        <summary
                            onMouseEnter={() => handlePerguntaHover(item.pergunta)}
                            onFocus={() => handlePerguntaHover(item.pergunta)}
                            onMouseLeave={pararLeitura}
                            tabIndex={0}
                        >
                            {item.pergunta}
                        </summary>
                        <p 
                            dangerouslySetInnerHTML={{ __html: item.resposta }}
                        ></p>
                    </details>
                ))}
            </div>
        <div className="manual-button">
            <a 
                className="button" 
                href="https://portaldopaciente.hc.fm.usp.br/api/doc/manual-acesso-portal" 
                target="_blank" 
                rel="noopener noreferrer"
                onMouseEnter={() => lerTexto("Link externo: Manual de Acesso ao Portal do Paciente")}
                onFocus={() => lerTexto("Link externo: Manual de Acesso ao Portal do Paciente")}
                onMouseLeave={pararLeitura}
            >
                Manual de Acesso
            </a>
        </div>
    </main>
    );
}