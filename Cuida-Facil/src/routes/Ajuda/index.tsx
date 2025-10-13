import { useState } from 'react';
import Logo from '../../components/Logo/Logo';
import CabecalhoMenu from '../../components/Cabecalho/CabecalhoMenu';

export default function AjudaPage() {
    const [secaoAtiva, setSecaoAtiva] = useState<'consultas' | 'exames' | null>(null);

    return (
        <main>
            <Logo/>
            <CabecalhoMenu/>
            <h1>Escolha sobre o que você deseja ajuda</h1>
            <div className="center-button">
                <button 
                    className={`button ${secaoAtiva === 'consultas' ? 'selected' : ''}`} 
                    onClick={() => setSecaoAtiva('consultas')}
                >
                    Consultas
                </button>
                <button 
                    className={`button ${secaoAtiva === 'exames' ? 'selected' : ''}`}
                    onClick={() => setSecaoAtiva('exames')}
                >
                    Exames
                </button>
            </div>
            
            {secaoAtiva === 'consultas' && (
                <section>
                    <h2><strong>Ajuda com Consultas</strong></h2>
                    <ul>
                        <li>Para <strong>marcar uma consulta</strong>, vá até “Minhas Consultas” e clique em “Nova Consulta”.</li>
                        <li>Para <strong>reagendar</strong>, selecione a consulta e clique em “Alterar”.</li>
                        <li>Para <strong>cancelar</strong>, clique em “Cancelar” na consulta desejada.</li>
                    </ul>
                </section>
            )}

            {secaoAtiva === 'exames' && (
                <section>
                    <h2><strong>Ajuda com Exames</strong></h2>
                    <ul>
                        <li>Para <strong>consultar exames</strong>, vá em “Meus Exames” e clique no exame desejado.</li>
                        <li>Para <strong>marcar um exame</strong>, clique em “Agendar Exame”.</li>
                        <li>Para <strong>reagendar ou cancelar</strong>, selecione o exame e clique na opção desejada.</li>
                    </ul>
                </section>
            )}
        </main>
    );
}