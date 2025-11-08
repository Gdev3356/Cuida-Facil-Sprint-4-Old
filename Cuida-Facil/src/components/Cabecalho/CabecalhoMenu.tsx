import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AcessibilityContext';

export default function CabecalhoMenu() {
    const { paciente, estaLogado, logout } = useAuth();
    const navigate = useNavigate();
    const { lerTexto, pararLeitura } = useAccessibility();

    const handleLogout = () => {
        logout();
        navigate('/');
        lerTexto("Sessão encerrada com sucesso."); 
    }
    
    const handleLinkHover = (texto: string) => {
        lerTexto(`Link: ${texto}`);
    };

    return (
        <header>
            <div className="baseCabecalho" />
            <nav>
                <Link 
                    to="/"
                    onMouseEnter={() => handleLinkHover('Início')}
                    onFocus={() => handleLinkHover('Início')}
                    onMouseLeave={pararLeitura}
                >
                    Início
                </Link>
                

                {estaLogado && paciente && (
                    <Link 
                        to="/minhas-consultas"
                        onMouseEnter={() => handleLinkHover('Minhas Consultas')}
                        onFocus={() => handleLinkHover('Minhas Consultas')}
                        onMouseLeave={pararLeitura}
                    >
                        Minhas Consultas
                    </Link>
                )}
                
                <Link 
                    to="/ajuda"
                    onMouseEnter={() => handleLinkHover('Ajuda')}
                    onFocus={() => handleLinkHover('Ajuda')}
                    onMouseLeave={pararLeitura}
                >
                    Ajuda
                </Link>
                <Link 
                    to="/faq"
                    onMouseEnter={() => handleLinkHover('Perguntas Frequentes')}
                    onFocus={() => handleLinkHover('Perguntas Frequentes')}
                    onMouseLeave={pararLeitura}
                >
                    FAQ
                </Link>
                <Link 
                    to="/contato"
                    onMouseEnter={() => handleLinkHover('Fale Conosco')}
                    onFocus={() => handleLinkHover('Fale Conosco')}
                    onMouseLeave={pararLeitura}
                >
                    Contato
                </Link>
                <Link 
                    to="/integrantes"
                    onMouseEnter={() => handleLinkHover('Integrantes do Projeto')}
                    onFocus={() => handleLinkHover('Integrantes do Projeto')}
                    onMouseLeave={pararLeitura}
                >
                    Integrantes
                </Link>
                
                <div className="auth-status">
                    {estaLogado && paciente ? (
                        <>
                            <button 
                                onClick={handleLogout} 
                                className="logout-button"
                                aria-label="Sair da conta"
                                onMouseEnter={() => lerTexto("Botão: Sair da conta")}
                                onFocus={() => lerTexto("Botão: Sair da conta")}
                                onMouseLeave={pararLeitura}
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link 
                            to="/login" 
                            className="login-button"
                            aria-label="Fazer login"
                            onMouseEnter={() => lerTexto("Link: Fazer login no sistema")}
                            onFocus={() => lerTexto("Link: Fazer login no sistema")}
                            onMouseLeave={pararLeitura}
                        >
                            Entrar
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}