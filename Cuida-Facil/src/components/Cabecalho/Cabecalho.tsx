import { useAuth } from '../../context/AuthContext';

export default function Cabecalho() {
  const { paciente, estaLogado } = useAuth();
  
  const primeiroNome = estaLogado && paciente 
    ? paciente.nome.split(' ')[0] 
    : null;
  
  return (
    <div>
      <h1>
        Seja Bem-Vindo ao Cuida Fácil{primeiroNome && `, ${primeiroNome}!`}
        <br />
        como podemos te ajudar hoje?
      </h1>
    </div>
  );
}