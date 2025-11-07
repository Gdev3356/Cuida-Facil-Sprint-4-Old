import { useState } from 'react';
import { authService } from '../../services/auth';
import type { TipoPaciente } from '../../types';
type SistemaLoginProps = {
  onLoginSucesso: (paciente: TipoPaciente) => void;
  
  onVoltar?: () => void;
}

type Tela = 'login' | 'cadastro' | 'recuperar' | 'sucesso-recuperacao';

export default function SistemaLogin({ onLoginSucesso, onVoltar }: SistemaLoginProps) {
  const [telaAtual, setTelaAtual] = useState<Tela>('login');
  
  const [dadosRecuperacao, setDadosRecuperacao] = useState<{
    codigoSMS: string;
    senha: string;
  } | null>(null);

  const handleLoginSucesso = (paciente: TipoPaciente) => {
    onLoginSucesso(paciente);
  };

  const handleRecuperacaoSucesso = (codigo: string, senha: string) => {
    setDadosRecuperacao({ codigoSMS: codigo, senha });
    setTelaAtual('sucesso-recuperacao');
  };

  const voltarParaLogin = onVoltar ?? (() => setTelaAtual('login'));

  return (
    <div className="auth-container" style={{ minWidth: '380px' }}>
      
      {telaAtual === 'login' && (
        <TelaLogin 
          onLoginSucesso={handleLoginSucesso}
          onIrParaCadastro={() => setTelaAtual('cadastro')}
          onIrParaRecuperar={() => setTelaAtual('recuperar')}
        />
      )}
      
      {telaAtual === 'cadastro' && (
        <TelaCadastro 
          onCadastroSucesso={() => setTelaAtual('login')}
          onVoltar={voltarParaLogin} // <-- Usar a prop
        />
      )}
      
      {telaAtual === 'recuperar' && (
        <TelaRecuperar 
          onRecuperacaoSucesso={handleRecuperacaoSucesso}
          onVoltar={voltarParaLogin} // <-- Usar a prop
        />
      )}
      
      {telaAtual === 'sucesso-recuperacao' && dadosRecuperacao && (
        <TelaSucessoRecuperacao 
          codigoSMS={dadosRecuperacao.codigoSMS}
          senha={dadosRecuperacao.senha}
          onConfirmar={() => setTelaAtual('login')}
        />
      )}
      
    </div>
  );
}

function TelaLogin({ 
  onLoginSucesso, 
  onIrParaCadastro,
  onIrParaRecuperar 
}: { 
  onLoginSucesso: (p: TipoPaciente) => void;
  onIrParaCadastro: () => void;
  onIrParaRecuperar: () => void;
}) {
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const paciente = await authService.login(identificador, senha);
      onLoginSucesso(paciente);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <h2 className="auth-title">Login:</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="CPF ou E-Mail"
          value={identificador}
          onChange={(e) => setIdentificador(e.target.value)}
          className="input-field"
          required
        />
        
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="input-field"
          required
        />

        {erro && <p className="auth-error">{erro}</p>}

        <div className="flex justify-between mb-5 text-sm">
          <button
            type="button"
            onClick={onIrParaRecuperar}
            className="auth-link-button"
          >
            Esqueci a minha senha
          </button>
          
          <button
            type="button"
            onClick={onIrParaCadastro}
            className="auth-link-button"
          >
            Não possuo uma conta?
          </button>
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="auth-button-primary"
        >
          {carregando ? 'Entrando...' : 'Confirmar'}
        </button>
      </form>
    </>
  );
}

//Cadastro
function TelaCadastro({ 
  onCadastroSucesso,
  onVoltar 
}: { 
  onCadastroSucesso: () => void;
  onVoltar: () => void;
}) {
  const [dados, setDados] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    dataNascimento: '',
    cep: ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [senhaGerada, setSenhaGerada] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleChange = (campo: string, valor: string) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const paciente = await authService.cadastrar(dados);
      const senha = authService.calcularSenha(paciente.cep!, paciente.dataNascimento);
      setSenhaGerada(senha);
      setSucesso(true);
    } catch (error)
 {
      setErro(error instanceof Error ? error.message : 'Erro ao cadastrar');
    } finally {
      setCarregando(false);
    }
  };

  if (sucesso) {
    return (
      <div className="text-center">
        <h2 className="auth-title-sucesso">
           Cadastro realizado!
        </h2>
        
        <div className="auth-success-box">
          <p className="mb-2"><strong>Sua senha de acesso:</strong></p>
          <p className="auth-success-password">
            {senhaGerada}
          </p>
          <p className="text-xs text-gray-600">
            Guarde esta senha! Ela é formada por seu CEP + dia do nascimento. Shh! Não conte para ninguém viu!
          </p>
        </div>

        <button
          onClick={onCadastroSucesso}
          className="auth-button-primary"
        >
          Fazer Login
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="auth-title text-xl">
        Digite os dados abaixo para se cadastrar
      </h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome Completo"
          value={dados.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
          className="input-field"
          required
        />
        
        <input
          type="text"
          placeholder="CPF"
          value={dados.cpf}
          onChange={(e) => handleChange('cpf', e.target.value)}
          className="input-field"
          maxLength={14}
          required
        />
        
        <input
          type="tel"
          placeholder="Telefone"
          value={dados.telefone}
          onChange={(e) => handleChange('telefone', e.target.value)}
          className="input-field"
          required
        />
        
        <input
          type="email"
          placeholder="E-Mail (Opcional)"
          value={dados.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="input-field"
        />
        
        <input
          type="date"
          placeholder="Data de Nascimento"
          value={dados.dataNascimento}
          onChange={(e) => handleChange('dataNascimento', e.target.value)}
          className="input-field"
          required
        />
        
        <input
          type="text"
          placeholder="CEP"
          value={dados.cep}
          onChange={(e) => handleChange('cep', e.target.value)}
          className="input-field"
          maxLength={9}
          required
        />

        {erro && <p className="auth-error">{erro}</p>}

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onVoltar}
            className="auth-button-secondary flex-1"
          >
            Voltar
          </button>
          
          <button
            type="submit"
            disabled={carregando}
            className="auth-button-primary flex-1"
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </>
  );
}

// Recuperar senha
function TelaRecuperar({ 
  onRecuperacaoSucesso,
  onVoltar 
}: { 
  onRecuperacaoSucesso: (codigo: string, senha: string) => void;
  onVoltar: () => void;
}) {
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [codigoSMS, setCodigoSMS] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [erro, setErro] = useState('');
  const [etapa, setEtapa] = useState<'dados' | 'codigo'>('dados');
  const [codigoCorreto, setCodigoCorreto] = useState('');
  const [senhaRecuperada, setSenhaRecuperada] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resultado = await authService.recuperarSenha(cpf, telefone);
      setCodigoCorreto(resultado.codigoSMS);
      setSenhaRecuperada(resultado.senha);
      setEtapa('codigo');
      alert(`📱 Código SMS enviado: ${resultado.codigoSMS}\n(Simulação para teste)`);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao recuperar senha');
    } finally {
      setCarregando(false);
    }
  };

  const handleValidarCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!authService.validarCodigoSMS(codigoSMS, codigoCorreto)) {
      setErro('Código SMS incorreto');
      return;
    }

    if (!novaSenha || novaSenha.length < 8) {
      setErro('Digite uma nova senha (mínimo 8 caracteres)');
      return;
    }

    onRecuperacaoSucesso(codigoSMS, novaSenha);
  };

  return (
    <>
      <h2 className="auth-title">
        {etapa === 'dados' ? 'Recuperar Senha' : 'Nova Senha'}
      </h2>
      
      {etapa === 'dados' ? (
        <form onSubmit={handleSolicitarCodigo}>
          <p className="auth-info-text">
            Digite seu CPF e telefone para receber o código de recuperação
          </p>
          
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="input-field"
            required
          />
          
          <input
            type="tel"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="input-field"
            required
          />

          {erro && <p className="auth-error">{erro}</p>}

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onVoltar}
              className="auth-button-secondary flex-1"
            >
              Voltar
            </button>
            
            <button
              type="submit"
              disabled={carregando}
              className="auth-button-primary flex-1"
            >
              {carregando ? 'Enviando...' : 'Enviar Código'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleValidarCodigo}>
          <input
            type="text"
            placeholder="Digite o código recebido por SMS"
            value={codigoSMS}
            onChange={(e) => setCodigoSMS(e.target.value)}
            className="input-field"
            maxLength={6}
            required
          />
          
          <input
            type="password"
            placeholder="Digite sua nova Senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="input-field"
            required
          />

          <p className="text-xs text-gray-600 mb-4">
            💡 Sua senha original era: <strong>{senhaRecuperada}</strong>
            <br/>(CEP + dia do nascimento)
          </p>

          {erro && <p className="auth-error">{erro}</p>}

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setEtapa('dados')}
              className="auth-button-secondary flex-1"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="auth-button-primary flex-1"
            >
              Confirmar
            </button>
          </div>
        </form>
      )}
    </>
  );
}

// Sucesso na Recuperação
function TelaSucessoRecuperacao({ 
  codigoSMS,
  senha,
  onConfirmar 
}: { 
  codigoSMS: string;
  senha: string;
  onConfirmar: () => void;
}) {
  return (
    <div className="text-center">
      <h2 className="auth-title-sucesso">
        Nova Senha criada com sucesso
      </h2>
      
      <div className="auth-success-box">
        <p className="mb-4">
           Código SMS validado: <strong>{codigoSMS}</strong>
        </p>
        <p className="text-sm text-gray-600">
          Sua nova senha foi configurada e você já pode fazer login!
        </p>
      </div>

      <button
        onClick={onConfirmar}
        className="auth-button-primary"
      >
        Confirmar
      </button>
    </div>
  );
}