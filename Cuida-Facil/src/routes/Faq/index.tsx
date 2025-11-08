import CabecalhoMenu from '../../components/Cabecalho/CabecalhoMenu';
import Logo from '../../components/Logo/Logo';
import { faqData } from '../../data/faqData';
import { useAccessibility } from '../../context/AcessibilityContext';
 
export default function FaqPage() {
    const { lerTexto, pararLeitura, leitorAtivo } = useAccessibility();

    const handleToggleFaq = (
        e: React.SyntheticEvent<HTMLDetailsElement>, 
        pergunta: string, 
        resposta: string
    ) => {
        const details = e.currentTarget;
        
        if (details.open && leitorAtivo) {
            const respostaLimpa = resposta.replace(/<[^>]*>?/gm, '');
            lerTexto(`${pergunta}. Resposta: ${respostaLimpa}`);
        } else {
            pararLeitura();
        }
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
                        onToggle={(e) => handleToggleFaq(e, item.pergunta, item.resposta)}
                    >
                        <summary
                            tabIndex={0}
                            aria-label={`Pergunta: ${item.pergunta}`}
                        >
                            {item.pergunta}
                        </summary>
                        <p 
                            dangerouslySetInnerHTML={{ __html: item.resposta }}
                            aria-live="polite"
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