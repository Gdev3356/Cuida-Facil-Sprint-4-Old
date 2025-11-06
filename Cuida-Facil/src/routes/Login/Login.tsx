import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SistemaLogin from '../../components/Login/Login'; 
import type { TipoPaciente } from '../../types';
import Cabecalho from '../../components/Voltar/Voltar';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLoginSucesso = (paciente: TipoPaciente) => {
        login(paciente); 
        navigate('/');
    };
    return (
    <header>
        <Cabecalho/>
        <SistemaLogin 
            onLoginSucesso={handleLoginSucesso} 
        />
    </header> 
    );
}