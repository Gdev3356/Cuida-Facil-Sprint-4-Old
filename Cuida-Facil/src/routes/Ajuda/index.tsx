import { useState } from 'react';
import Logo from '../../components/Logo/Logo';
import CabecalhoMenu from '../../components/Cabecalho/CabecalhoMenu';
import { useAccessibility } from '../../context/AcessibilityContext';

export default function AjudaPage() {
    const [secaoAtiva, setSecaoAtiva] = useState<'consultas' | 'exames' | null>(null);
    const { lerTexto, pararLeitura } = useAccessibility();

    const handleLeituraBotao = (secao: 'consultas' | 'exames') => {
        const texto = `Botão: ${secao === 'consultas' ? 'Ajuda com Consultas' : 'Ajuda com Exames'}`;
        lerTexto(texto);
    };

    const handleLeituraItem = (texto: string) => {
        lerTexto(texto);
    };

    return (
        <main>
            <Logo/>
            <CabecalhoMenu/>
            <h1
                onMouseEnter={() => lerTexto("Título: Escolha sobre o que você deseja ajuda")}
                onFocus={() => lerTexto("Título: Escolha sobre o que você deseja ajuda")}
                onMouseLeave={pararLeitura}
                tabIndex={0}
            >
                Escolha sobre o que você deseja ajuda
            </h1>
            <div className="center-button">
                <button 
                    className={`button ${secaoAtiva === 'consultas' ? 'selected' : ''}`} 
                    onClick={() => { setSecaoAtiva('consultas'); lerTexto("Seção Consultas Ativada."); }}
                    onMouseEnter={() => handleLeituraBotao('consultas')}
                    onFocus={() => handleLeituraBotao('consultas')}
                    onMouseLeave={pararLeitura}
                >
                    Consultas
                </button>
                <button 
                    className={`button ${secaoAtiva === 'exames' ? 'selected' : ''}`}
                    onClick={() => { setSecaoAtiva('exames'); lerTexto("Seção Exames Ativada."); }}
                    onMouseEnter={() => handleLeituraBotao('exames')}
                    onFocus={() => handleLeituraBotao('exames')}
                    onMouseLeave={pararLeitura}
                >
                    Exames
                </button>
            </div>
            
            {secaoAtiva === 'consultas' && (
                <section>
                    <h2
                        onMouseEnter={() => lerTexto("Subtítulo: Ajuda com Consultas")}
                        onFocus={() => lerTexto("Subtítulo: Ajuda com Consultas")}
                        onMouseLeave={pararLeitura}
                        tabIndex={0}
                    >
                        <strong>Ajuda com Consultas</strong>
                    </h2>
                    <ul>
                        <li onMouseEnter={() => handleLeituraItem("Para marcar uma consulta, vá até Minhas Consultas e clique em Nova Consulta.")} onMouseLeave={pararLeitura} tabIndex={0}>Para <strong>marcar uma consulta</strong>, vá até “Minhas Consultas” e clique em “Nova Consulta”.</li>
                        <li onMouseEnter={() => handleLeituraItem("Para reagendar, selecione a consulta e clique em Alterar.")} onMouseLeave={pararLeitura} tabIndex={0}>Para <strong>reagendar</strong>, selecione a consulta e clique em “Alterar”.</li>
                        <li onMouseEnter={() => handleLeituraItem("Para cancelar, clique em Cancelar na consulta desejada.")} onMouseLeave={pararLeitura} tabIndex={0}>Para <strong>cancelar</strong>, clique em “Cancelar” na consulta desejada.</li>
                    </ul>
                </section>
            )}

            {secaoAtiva === 'exames' && (
                <section>
                    <h2
                        onMouseEnter={() => lerTexto("Subtítulo: Ajuda com Exames")}
                        onFocus={() => lerTexto("Subtítulo: Ajuda com Exames")}
                        onMouseLeave={pararLeitura}
                        tabIndex={0}
                    >
                        <strong>Ajuda com Exames</strong>
                    </h2>
                    <ul>
                        <li onMouseEnter={() => handleLeituraItem("Para consultar exames, vá em Meus Exames e clique no exame desejado.")} onMouseLeave={pararLeitura} tabIndex={0}>Para <strong>consultar exames</strong>, vá em “Meus Exames” e clique no exame desejado.</li>
                        <li onMouseEnter={() => handleLeituraItem("Para marcar um exame, clique em Agendar Exame.")} onMouseLeave={pararLeitura} tabIndex={0}>Para <strong>marcar um exame</strong>, clique em “Agendar Exame”.</li>
                        <li onMouseEnter={() => handleLeituraItem("Para reagendar ou cancelar, selecione o exame e clique na opção desejada.")} onMouseLeave={pararLeitura} tabIndex={0}>Para <strong>reagendar ou cancelar</strong>, selecione o exame e clique na opção desejada.</li>
                    </ul>
                </section>
            )}
        </main>
    );
}