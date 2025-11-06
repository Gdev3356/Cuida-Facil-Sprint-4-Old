import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function CabecalhoMenu() {
    const { paciente, estaLogado, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <header>
            <div className="flex-grow max-sm:hidden" />

                <div className="auth-user">
                    {estaLogado && paciente ? (
                        <>
                            <span className="user-greeting">
                                Olá, {paciente.nome.split(' ')[0]}
                            </span>
                        </>
                    ): (<></>)}
                </div>
            <nav>
                <Link to="/">Início</Link>
                <Link to="/ajuda">Ajuda</Link>
                <Link to="/faq">FAQ</Link>
                <Link to="/contato">Contato</Link>
                <Link to="/integrantes">Integrantes</Link>
                <div className="auth-status">
                    {estaLogado && paciente ? (
                        <>
                            <button 
                                onClick={handleLogout} 
                                className="logout-button"
                                aria-label="Sair da conta"
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link 
                            to="/login" 
                            className="login-button"
                            aria-label="Fazer login"
                        >
                            Entrar
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}