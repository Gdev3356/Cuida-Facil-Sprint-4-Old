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
            <nav>
                <Link to="/">Início</Link>
                <Link to="/ajuda">Ajuda</Link>
                <Link to="/faq">FAQ</Link>
                <Link to="/contato">Contato</Link>
                <Link to="/integrantes">Integrantes</Link>

                {estaLogado && paciente ? (
                    <>
                        <span className="text-sm font-semibold">
                            Olá, {paciente.nome.split(' ')[0]}
                        </span>
                        <a 
                            href="#" 
                            onClick={handleLogout} 
                            className="text-red-500 font-bold text-sm"
                            style={{ marginLeft: '10px' }}
                        >
                            Sair
                        </a>
                    </>
                ) : (
                    <Link to="/login" className="font-bold text-blue-600" style={{ marginLeft: '10px' }}>
                        Entrar
                    </Link>
                )}
            </nav>
        </header>
    );
}