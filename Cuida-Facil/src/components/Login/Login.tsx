// Login.tsx

import { useState } from 'react';
import { authService } from '../../services/auth';
import type { TipoPaciente } from '../../types';
import { useAccessibility } from '../../context/AcessibilityContext';

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
          onVoltar={voltarParaLogin}
        />
      )}
      
      {telaAtual === 'recuperar' && (
        <TelaRecuperar 
          onRecuperacaoSucesso={handleRecuperacaoSucesso}
          onVoltar={voltarParaLogin}
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

// Tela de Login
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

  const { lerTexto, leitorAtivo, pararLeitura } = useAccessibility();

  const handleLeitura = (texto: string) => {
    if (leitorAtivo) lerTexto(texto);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    handleLeitura("Verificando dados. Aguarde.");

    try {
      const paciente = await authService.login(identificador, senha);
      handleLeitura(`Login bem-sucedido. Bem-vindo, ${paciente.nome}`);
      onLoginSucesso(paciente);
    } catch (error) {
      const msgErro = error instanceof Error ? error.message : 'Erro ao fazer login';
      setErro(msgErro);
      handleLeitura(`Erro: ${msgErro}`);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <h2 
        className="auth-title"
        onMouseEnter={() => handleLeitura("Login")}
        onFocus={() => handleLeitura("Login")}
        onMouseLeave={pararLeitura}
        tabIndex={0}
      >
        Login:
      </h2>
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="login-id" className="sr-only">CPF ou E-Mail</label>
        <input
          id="login-id"
          type="text"
          placeholder="CPF ou E-Mail"
          value={identificador}
          onChange={(e) => setIdentificador(e.target.value)}
          className="input-field"
          required
          onFocus={() => handleLeitura("Campo: CPF ou E-Mail")}
          onMouseLeave={pararLeitura}
        />
        
        <label htmlFor="login-senha" className="sr-only">Senha</label>
        <input
          id="login-senha"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="input-field"
          required
          onFocus={() => handleLeitura("Campo: Senha")}
          onMouseLeave={pararLeitura}
        />

        {erro && <p className="auth-error">{erro}</p>}

        <div className="flex justify-between mb-5 text-sm">
          <button
            type="button"
            onClick={onIrParaRecuperar}
            className="auth-link-button"
            onFocus={() => handleLeitura("Link: Esqueci a minha senha")}
            onMouseEnter={() => handleLeitura("Link: Esqueci a minha senha")}
            onMouseLeave={pararLeitura}
          >
            Esqueci a minha senha
          </button>
          
          <button
            type="button"
            onClick={onIrParaCadastro}
            className="auth-link-button"
            onFocus={() => handleLeitura("Link: Não possuo uma conta?")}
            onMouseEnter={() => handleLeitura("Link: Não possuo uma conta?")}
            onMouseLeave={pararLeitura}
          >
            Não possuo uma conta?
          </button>
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="auth-button-primary"
          onFocus={() => handleLeitura("Botão: Confirmar")}
          onMouseEnter={() => handleLeitura("Botão: Confirmar")}
          onMouseLeave={pararLeitura}
        >
          {carregando ? 'Entrando...' : 'Confirmar'}
        </button>
      </form>
    </>
  );
}

// Tela de Cadastro
function TelaCadastro({ 
  onCadastroSucesso,
  onVoltar 
}: { 
  onCadastroSucesso: () => void;
  onVoltar: () => void;
}) {
  const [dados, setDados] = useState({
    nome: '', cpf: '', telefone: '', email: '', dataNascimento: '', cep: ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [senhaGerada, setSenhaGerada] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { lerTexto, leitorAtivo, pararLeitura } = useAccessibility();

  const handleLeitura = (texto: string) => {
    if (leitorAtivo) lerTexto(texto);
  };

  const handleChange = (campo: string, valor: string) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    handleLeitura("Verificando dados. Aguarde.");

    try {
      const paciente = await authService.cadastrar(dados);
      const senha = authService.calcularSenha(paciente.cep!, paciente.dataNascimento);
      setSenhaGerada(senha);
      setSucesso(true);
      handleLeitura("Cadastro realizado com sucesso! Sua senha foi gerada.");
    } catch (error) {
      const msgErro = error instanceof Error ? error.message : 'Erro ao cadastrar';
      setErro(msgErro);
      handleLeitura(`Erro: ${msgErro}`);
    } finally {
      setCarregando(false);
    }
  };

  if (sucesso) {
    return (
      <div className="text-center">
        <h2 
          className="auth-title-sucesso"
          onMouseEnter={() => handleLeitura("Cadastro realizado!")}
          onFocus={() => handleLeitura("Cadastro realizado!")}
          onMouseLeave={pararLeitura}
          tabIndex={0}
        >
           Cadastro realizado!
        </h2>
        
        <div 
          className="auth-success-box"
          onMouseEnter={() => handleLeitura(`Sua senha de acesso é: ${senhaGerada}. Guarde esta senha!`)}
          onFocus={() => handleLeitura(`Sua senha de acesso é: ${senhaGerada}. Guarde esta senha!`)}
          onMouseLeave={pararLeitura}
          tabIndex={0}
        >
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
          onFocus={() => handleLeitura("Botão: Fazer Login")}
          onMouseEnter={() => handleLeitura("Botão: Fazer Login")}
          onMouseLeave={pararLeitura}
        >
          Fazer Login
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 
        className="auth-title text-xl"
        onMouseEnter={() => handleLeitura("Digite os dados abaixo para se cadastrar")}
        onFocus={() => handleLeitura("Digite os dados abaixo para se cadastrar")}
        onMouseLeave={pararLeitura}
        tabIndex={0}
      >
        Digite os dados abaixo para se cadastrar
      </h2>
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="cad-nome" className="sr-only">Nome Completo</label>
        <input
          id="cad-nome"
          type="text"
          placeholder="Nome Completo"
          value={dados.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
          className="input-field"
          required
          onFocus={() => handleLeitura("Campo: Nome Completo")}
          onMouseLeave={pararLeitura}
        />
        
        <label htmlFor="cad-cpf" className="sr-only">CPF</label>
        <input
          id="cad-cpf"
          type="text"
          placeholder="CPF"
          value={dados.cpf}
          onChange={(e) => handleChange('cpf', e.target.value)}
          className="input-field"
          maxLength={14}
          required
          onFocus={() => handleLeitura("Campo: CPF")}
          onMouseLeave={pararLeitura}
        />
        
        <label htmlFor="cad-tel" className="sr-only">Telefone</label>
        <input
          id="cad-tel"
          type="tel"
          placeholder="Telefone"
          value={dados.telefone}
          onChange={(e) => handleChange('telefone', e.target.value)}
          className="input-field"
          required
          onFocus={() => handleLeitura("Campo: Telefone")}
          onMouseLeave={pararLeitura}
        />
        
        <label htmlFor="cad-email" className="sr-only">E-Mail (Opcional)</label>
        <input
          id="cad-email"
          type="email"
          placeholder="E-Mail (Opcional)"
          value={dados.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="input-field"
          onFocus={() => handleLeitura("Campo: E-Mail (Opcional)")}
          onMouseLeave={pararLeitura}
        />
        
        <label htmlFor="cad-data" className="sr-only">Data de Nascimento</label>
        <input
          id="cad-data"
          type="date"
          placeholder="Data de Nascimento"
          value={dados.dataNascimento}
          onChange={(e) => handleChange('dataNascimento', e.target.value)}
          className="input-field"
          required
          onFocus={() => handleLeitura("Campo: Data de Nascimento")}
          onMouseLeave={pararLeitura}
        />
        
        <label htmlFor="cad-cep" className="sr-only">CEP</label>
        <input
          id="cad-cep"
          type="text"
          placeholder="CEP"
          value={dados.cep}
          onChange={(e) => handleChange('cep', e.target.value)}
          className="input-field"
          maxLength={9}
          required
          onFocus={() => handleLeitura("Campo: CEP")}
          onMouseLeave={pararLeitura}
        />

        {erro && <p className="auth-error">{erro}</p>}

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onVoltar}
            className="auth-button-secondary flex-1"
            onFocus={() => handleLeitura("Botão: Voltar")}
            onMouseEnter={() => handleLeitura("Botão: Voltar")}
            onMouseLeave={pararLeitura}
          >
            Voltar
          </button>
          
          <button
            type="submit"
            disabled={carregando}
            className="auth-button-primary flex-1"
            onFocus={() => handleLeitura("Botão: Cadastrar")}
            onMouseEnter={() => handleLeitura("Botão: Cadastrar")}
            onMouseLeave={pararLeitura}
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </>
  );
}

// Tela de Recuperação de Senha
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

  const { lerTexto, leitorAtivo, pararLeitura } = useAccessibility();

  const handleLeitura = (texto: string) => {
    if (leitorAtivo) lerTexto(texto);
  };

  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    handleLeitura("Solicitando código. Aguarde.");

    try {
      const resultado = await authService.recuperarSenha(cpf, telefone);
      setCodigoCorreto(resultado.codigoSMS);
      setSenhaRecuperada(resultado.senha);
      setEtapa('codigo');
      handleLeitura(`Código SMS enviado: ${resultado.codigoSMS}. Esta é uma simulação para teste.`);
      alert(`📱 Código SMS enviado: ${resultado.codigoSMS}\n(Simulação para teste)`);
    } catch (error) {
      const msgErro = error instanceof Error ? error.message : 'Erro ao recuperar senha';
      setErro(msgErro);
      handleLeitura(`Erro: ${msgErro}`);
    } finally {
      setCarregando(false);
    }
  };

  const handleValidarCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!authService.validarCodigoSMS(codigoSMS, codigoCorreto)) {
      setErro('Código SMS incorreto');
      handleLeitura("Erro: Código SMS incorreto");
      return;
    }

    if (!novaSenha || novaSenha.length < 8) {
      setErro('Digite uma nova senha (mínimo 8 caracteres)');
      handleLeitura("Erro: Digite uma nova senha com no mínimo 8 caracteres");
      return;
    }

    handleLeitura("Código validado. Nova senha criada.");
    onRecuperacaoSucesso(codigoSMS, novaSenha);
  };

  return (
    <>
      <h2 
        className="auth-title"
        onMouseEnter={() => handleLeitura(etapa === 'dados' ? 'Recuperar Senha' : 'Nova Senha')}
        onFocus={() => handleLeitura(etapa === 'dados' ? 'Recuperar Senha' : 'Nova Senha')}
        onMouseLeave={pararLeitura}
        tabIndex={0}
      >
        {etapa === 'dados' ? 'Recuperar Senha' : 'Nova Senha'}
      </h2>
      
      {etapa === 'dados' ? (
        <form onSubmit={handleSolicitarCodigo}>
          <p 
            className="auth-info-text"
            onMouseEnter={() => handleLeitura("Digite seu CPF e telefone para receber o código de recuperação")}
            onFocus={() => handleLeitura("Digite seu CPF e telefone para receber o código de recuperação")}
            onMouseLeave={pararLeitura}
            tabIndex={0}
          >
            Digite seu CPF e telefone para receber o código de recuperação
          </p>
          
          <label htmlFor="rec-cpf" className="sr-only">CPF</label>
          <input
            id="rec-cpf"
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="input-field"
            required
            onFocus={() => handleLeitura("Campo: CPF")}
            onMouseLeave={pararLeitura}
          />
          
          <label htmlFor="rec-tel" className="sr-only">Telefone</label>
          <input
            id="rec-tel"
            type="tel"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="input-field"
            required
            onFocus={() => handleLeitura("Campo: Telefone")}
            onMouseLeave={pararLeitura}
          />

          {erro && <p className="auth-error">{erro}</p>}

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onVoltar}
              className="auth-button-secondary flex-1"
              onFocus={() => handleLeitura("Botão: Voltar")}
              onMouseEnter={() => handleLeitura("Botão: Voltar")}
              onMouseLeave={pararLeitura}
            >
              Voltar
            </button>
            
            <button
              type="submit"
              disabled={carregando}
              className="auth-button-primary flex-1"
              onFocus={() => handleLeitura("Botão: Enviar Código")}
              onMouseEnter={() => handleLeitura("Botão: Enviar Código")}
              onMouseLeave={pararLeitura}
            >
              {carregando ? 'Enviando...' : 'Enviar Código'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleValidarCodigo}>
          <label htmlFor="rec-codigo" className="sr-only">Digite o código recebido por SMS</label>
          <input
            id="rec-codigo"
            type="text"
            placeholder="Digite o código recebido por SMS"
            value={codigoSMS}
            onChange={(e) => setCodigoSMS(e.target.value)}
            className="input-field"
            maxLength={6}
            required
            onFocus={() => handleLeitura("Campo: Digite o código recebido por SMS")}
            onMouseLeave={pararLeitura}
          />
          
          <label htmlFor="rec-nova-senha" className="sr-only">Digite sua nova Senha</label>
          <input
            id="rec-nova-senha"
            type="password"
            placeholder="Digite sua nova Senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="input-field"
            required
            onFocus={() => handleLeitura("Campo: Digite sua nova Senha (mínimo 8 caracteres)")}
            onMouseLeave={pararLeitura}
          />

          <p 
            className="text-xs text-gray-600 mb-4"
            onMouseEnter={() => handleLeitura(`Dica: Sua senha original era: ${senhaRecuperada}`)}
            onFocus={() => handleLeitura(`Dica: Sua senha original era: ${senhaRecuperada}`)}
            onMouseLeave={pararLeitura}
            tabIndex={0}
          >
             Sua senha original era: <strong>{senhaRecuperada}</strong>
            <br/>(CEP + dia do nascimento)
          </p>

          {erro && <p className="auth-error">{erro}</p>}

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setEtapa('dados')}
              className="auth-button-secondary flex-1"
              onFocus={() => handleLeitura("Botão: Cancelar")}
              onMouseEnter={() => handleLeitura("Botão: Cancelar")}
              onMouseLeave={pararLeitura}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="auth-button-primary flex-1"
              onFocus={() => handleLeitura("Botão: Confirmar")}
              onMouseEnter={() => handleLeitura("Botão: Confirmar")}
              onMouseLeave={pararLeitura}
            >
              Confirmar
            </button>
          </div>
        </form>
      )}
    </>
  );
}

// Tela de Sucesso em Recuperação
function TelaSucessoRecuperacao({ 
  codigoSMS,
  senha,
  onConfirmar 
}: { 
  codigoSMS: string;
  senha: string;
  onConfirmar: () => void;
}) {
  const { lerTexto, leitorAtivo, pararLeitura } = useAccessibility();

  return (
    <div className="text-center">
      <h2 
        className="auth-title-sucesso"
        onMouseEnter={() => lerTexto("Nova Senha criada com sucesso")}
        onFocus={() => lerTexto("Nova Senha criada com sucesso")}
        onMouseLeave={pararLeitura}
        tabIndex={0}
      >
        Nova Senha criada com sucesso
      </h2>
      
      <div 
        className="auth-success-box"
        onMouseEnter={() => lerTexto(`Código SMS validado: ${codigoSMS}. Sua nova senha foi configurada.`)}
        onFocus={() => lerTexto(`Código SMS validado: ${codigoSMS}. Sua nova senha foi configurada.`)}
        onMouseLeave={pararLeitura}
        tabIndex={0}
      >
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
        onFocus={() => lerTexto("Botão: Confirmar e ir para o Login")}
        onMouseEnter={() => lerTexto("Botão: Confirmar e ir para o Login")}
        onMouseLeave={pararLeitura}
      >
        Confirmar
      </button>
    </div>
  );
}