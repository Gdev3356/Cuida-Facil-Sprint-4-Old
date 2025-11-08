import { useState } from 'react';
import Logo from '../../components/Logo/Logo';
import CabecalhoMenu from '../../components/Cabecalho/CabecalhoMenu';
import { useAccessibility } from '../../context/AcessibilityContext';

export default function AjudaPage() {
    const [secaoAtiva, setSecaoAtiva] = useState<'consultas' | 'exames' | null>(null);
    const { lerTexto, pararLeitura, leitorAtivo } = useAccessibility();

    const handleSelecionarSecao = (secao: 'consultas' | 'exames') => {
        setSecaoAtiva(secao);
        
        if (leitorAtivo) {
            const texto = secao === 'consultas' 
                ? 'Seção Consultas ativada. Aqui você encontra ajuda sobre marcar, reagendar e cancelar consultas.'
                : 'Seção Exames ativada. Aqui você encontra ajuda sobre consultar, marcar e reagendar exames.';
            lerTexto(texto);
        }
    };

    const handleLeituraItem = (texto: string) => {
        if (leitorAtivo) {
            lerTexto(texto);
        }
    };

    return (
        <main>
            <Logo/>
            <CabecalhoMenu/>
            <h1
                onMouseEnter={() => leitorAtivo && lerTexto("Título: Escolha sobre o que você deseja ajuda")}
                onFocus={() => leitorAtivo && lerTexto("Título: Escolha sobre o que você deseja ajuda")}
                onMouseLeave={pararLeitura}
                tabIndex={0}
            >
                Escolha sobre o que você deseja ajuda
            </h1>
            
            <div className="center-button">
                <button 
                    className={`button ${secaoAtiva === 'consultas' ? 'selected' : ''}`} 
                    onClick={() => handleSelecionarSecao('consultas')}
                    onMouseEnter={() => leitorAtivo && lerTexto('Botão: Ajuda com Consultas')}
                    onFocus={() => leitorAtivo && lerTexto('Botão: Ajuda com Consultas')}
                    onMouseLeave={pararLeitura}
                >
                    Consultas
                </button>
                <button 
                    className={`button ${secaoAtiva === 'exames' ? 'selected' : ''}`}
                    onClick={() => handleSelecionarSecao('exames')}
                    onMouseEnter={() => leitorAtivo && lerTexto('Botão: Ajuda com Exames')}
                    onFocus={() => leitorAtivo && lerTexto('Botão: Ajuda com Exames')}
                    onMouseLeave={pararLeitura}
                >
                    Exames
                </button>
            </div>
            
            {secaoAtiva === 'consultas' && (
                <section className="help-section">
                    <h2
                        onMouseEnter={() => leitorAtivo && lerTexto("Subtítulo: Ajuda com Consultas")}
                        onFocus={() => leitorAtivo && lerTexto("Subtítulo: Ajuda com Consultas")}
                        onMouseLeave={pararLeitura}
                        tabIndex={0}
                    >
                        <strong>Ajuda com Consultas</strong>
                    </h2>
                    <ul className="help-list">
                        <li 
                            className="help-item"
                            onMouseEnter={() => handleLeituraItem("Para marcar uma consulta, vá até Minhas Consultas e clique em Nova Consulta.")} 
                            onMouseLeave={pararLeitura} 
                            tabIndex={0}
                        >
                            Para <strong>marcar uma consulta</strong>, vá até "Minhas Consultas" e clique em "Nova Consulta".
                        </li>
                        <li 
                            className="help-item"
                            onMouseEnter={() => handleLeituraItem("Para reagendar, selecione a consulta e clique em Alterar.")} 
                            onMouseLeave={pararLeitura} 
                            tabIndex={0}
                        >
                            Para <strong>reagendar</strong>, selecione a consulta e clique em "Alterar".
                        </li>
                        <li 
                            className="help-item"
                            onMouseEnter={() => handleLeituraItem("Para cancelar, clique em Cancelar na consulta desejada.")} 
                            onMouseLeave={pararLeitura} 
                            tabIndex={0}
                        >
                            Para <strong>cancelar</strong>, clique em "Cancelar" na consulta desejada.
                        </li>
                    </ul>
                </section>
            )}

            {secaoAtiva === 'exames' && (
                <section className="help-section">
                    <h2
                        onMouseEnter={() => leitorAtivo && lerTexto("Subtítulo: Ajuda com Exames")}
                        onFocus={() => leitorAtivo && lerTexto("Subtítulo: Ajuda com Exames")}
                        onMouseLeave={pararLeitura}
                        tabIndex={0}
                    >
                        <strong>Ajuda com Exames</strong>
                    </h2>
                    <ul className="help-list">
                        <li 
                            className="help-item"
                            onMouseEnter={() => handleLeituraItem("Para consultar exames, vá em Meus Exames e clique no exame desejado.")} 
                            onMouseLeave={pararLeitura} 
                            tabIndex={0}
                        >
                            Para <strong>consultar exames</strong>, vá em "Meus Exames" e clique no exame desejado.
                        </li>
                        <li 
                            className="help-item"
                            onMouseEnter={() => handleLeituraItem("Para marcar um exame, clique em Agendar Exame.")} 
                            onMouseLeave={pararLeitura} 
                            tabIndex={0}
                        >
                            Para <strong>marcar um exame</strong>, clique em "Agendar Exame".
                        </li>
                        <li 
                            className="help-item"
                            onMouseEnter={() => handleLeituraItem("Para reagendar ou cancelar, selecione o exame e clique na opção desejada.")} 
                            onMouseLeave={pararLeitura} 
                            tabIndex={0}
                        >
                            Para <strong>reagendar ou cancelar</strong>, selecione o exame e clique na opção desejada.
                        </li>
                    </ul>
                </section>
            )}
        </main>
    );
}