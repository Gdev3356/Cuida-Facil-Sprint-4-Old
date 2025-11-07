import type { ReactNode } from 'react' 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { TipoPaciente } from '../../types';
import Modal from '../Modal/modal';
import SistemaLogin from '../Login/Login';
import Voltar from '../Voltar/Voltar';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { estaLogado, login } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginSucesso = (paciente: TipoPaciente) => {
    login(paciente);
    setShowLoginModal(false);
  };

  const handleVoltar = () => {
    navigate('/');
  };

  if (!estaLogado) {
    return (
      <main>
        <Voltar />
        <div className="protected-route-container">
          <div className="protected-route-warning">
            <div className="protected-route-icon"></div>
            
            <h2 className="protected-route-title">
              Acesso Restrito
            </h2>
            
            <p className="protected-route-message">
              Você precisa estar logado para acessar esta página.
              Faça login ou crie uma conta para continuar.
            </p>
            
            <div className="protected-route-buttons">
              <button 
                onClick={handleVoltar}
                className="protected-route-button-secondary"
              >
                Voltar
              </button>
              
              <button 
                onClick={() => setShowLoginModal(true)}
                className="protected-route-button-primary"
              >
                Fazer Login
              </button>
            </div>
          </div>
        </div>

        {showLoginModal && (
          <Modal onClose={handleVoltar}>
            <SistemaLogin 
              onLoginSucesso={handleLoginSucesso}
              onVoltar={handleVoltar}
            />
          </Modal>
        )}
      </main>
    );
  }

  return <>{children}</>;
}