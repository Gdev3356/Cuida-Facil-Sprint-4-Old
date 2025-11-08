import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Cabecalho() {
  const { paciente, estaLogado, logout } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const primeiroNome = estaLogado && paciente 
    ? paciente.nome.split(' ')[0] 
    : null;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  }
    
  return (
    <div>
      <h1>
        Seja Bem-Vindo ao Cuida Fácil{primeiroNome && `, ${primeiroNome}!`}
        <br />
        como podemos te ajudar hoje?
      </h1>
      <div className={isHomePage ? "auth-status-home" : "auth-status"}>
        {estaLogado && paciente ? (
          <button 
            onClick={handleLogout} 
            className="logout-button"
            aria-label="Sair da conta"
          >
            Sair
          </button>
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
    </div>
  );
}