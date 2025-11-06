import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SistemaLogin from '../../components/Login/Login'; 
import type { TipoPaciente } from '../../types';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLoginSucesso = (paciente: TipoPaciente) => {
        login(paciente); 
        navigate('/consultas');
    };

    return (
        <SistemaLogin 
            onLoginSucesso={handleLoginSucesso} 
        />
    );
}