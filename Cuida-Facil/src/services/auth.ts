import type { TipoPaciente } from '../types/TipoPaciente';
import type { TipoPacienteCreate } from '../types/TipoResponse';
import { pacientesAPI } from './api';

const SESSION_KEY = 'hc_paciente_session';

// Criação de senha

export function gerarSenhaDerivada(cep: string, dataNascimento: string): string {
  const cepLimpo = cep?.replace(/\D/g, '') || '';
  const dia = dataNascimento?.split('-')[2] || '';
  return cepLimpo + dia;
}

export function formatarCPF(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

export function validarCPF(cpf: string): boolean {
  const cpfLimpo = formatarCPF(cpf);
  return cpfLimpo.length === 11;
}

export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validarCEP(cep: string): boolean {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.length === 8;
}

export function validarDataNascimento(data: string): boolean {
  const dataObj = new Date(data);
  const hoje = new Date();
  return dataObj <= hoje;
}

// LocalStorage/Gerenciamento de Sessão

export const sessionService = {
  login: (paciente: TipoPaciente): void => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(paciente));
      console.log('Sessão iniciada:', paciente.nome);
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    }
  },

 
  logout: (): void => {
    try {
      localStorage.removeItem(SESSION_KEY);
      console.log('Sessão encerrada');
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
    }
  },

  obterPaciente: (): TipoPaciente | null => {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (!data) return null;
      return JSON.parse(data) as TipoPaciente;
    } catch (error) {
      console.error('Erro ao ler sessão:', error);
      return null;
    }
  },

  estaLogado: (): boolean => {
    return sessionService.obterPaciente() !== null;
  },

  atualizarSessao: (paciente: TipoPaciente): void => {
    sessionService.login(paciente);
  }
};

//Autenticação

export const authService = {
//Login - Valida CPF/E-mail + Senha derivada

  login: async (identificador: string, senha: string): Promise<TipoPaciente> => {
    console.log('Tentando login...');

    if (!identificador || !senha) {
      throw new Error('Preencha todos os campos');
    }

    const pacientes = await pacientesAPI.findAll();
    
    const isEmail = identificador.includes('@');
    let paciente: TipoPaciente | undefined;

    if (isEmail) {
      paciente = pacientes.find(
        p => p.email?.toLowerCase() === identificador.toLowerCase()
      );
      
      if (!paciente) {
        throw new Error('E-mail não cadastrado');
      }
    } else {
      const cpfLimpo = formatarCPF(identificador);
      paciente = pacientes.find(
        p => formatarCPF(p.cpf) === cpfLimpo
      );
      
      if (!paciente) {
        throw new Error('CPF não cadastrado');
      }
    }

    if (!paciente.cep || !paciente.dataNascimento) {
      throw new Error('Cadastro incompleto. Entre em contato com o suporte.');
    }

    const senhaEsperada = gerarSenhaDerivada(
      paciente.cep,
      paciente.dataNascimento
    );

    if (senha !== senhaEsperada) {
      throw new Error('Senha incorreta');
    }

    sessionService.login(paciente);
    
    console.log('Login bem-sucedido:', paciente.nome);
    return paciente;
  },

// Cadastrando - Cria novo paciente

  cadastrar: async (dados: {
    nome: string;
    cpf: string;
    telefone: string;
    email?: string;
    dataNascimento: string;
    cep: string;
  }): Promise<TipoPaciente> => {
    console.log('Iniciando cadastro...');

    if (!dados.nome || !dados.cpf || !dados.telefone || !dados.dataNascimento || !dados.cep) {
      throw new Error('Preencha todos os campos obrigatórios');
    }

    if (!validarCPF(dados.cpf)) {
      throw new Error('CPF inválido');
    }

    if (dados.email && !validarEmail(dados.email)) {
      throw new Error('E-mail inválido');
    }

    if (!validarCEP(dados.cep)) {
      throw new Error('CEP inválido');
    }

    if (!validarDataNascimento(dados.dataNascimento)) {
      throw new Error('Data de nascimento inválida');
    }

    const pacientes = await pacientesAPI.findAll();
    const cpfLimpo = formatarCPF(dados.cpf);
    const cpfExiste = pacientes.some(p => formatarCPF(p.cpf) === cpfLimpo);
    
    if (cpfExiste) {
      throw new Error('CPF já cadastrado');
    }

    const novoPaciente: TipoPacienteCreate = {
      cpf: cpfLimpo,
      nome: dados.nome,
      telefone: dados.telefone,
      email: dados.email || null,
      dataNascimento: dados.dataNascimento,
      cep: dados.cep.replace(/\D/g, '')
    };

    const pacienteCadastrado = await pacientesAPI.save(novoPaciente);
    
    if (!pacienteCadastrado || !pacienteCadastrado.idPaciente) {
      throw new Error('Falha no cadastro: O servidor não retornou os dados completos do novo paciente.');
    }
    
    const senha = gerarSenhaDerivada(pacienteCadastrado.cep!, pacienteCadastrado.dataNascimento); 
    console.log('Senha gerada:', senha);

    return pacienteCadastrado;
  },


//Recuperação de senha
  recuperarSenha: async (cpf: string, telefone: string): Promise<{
    paciente: TipoPaciente;
    senha: string;
    codigoSMS: string;
  }> => {
    console.log('Recuperando senha...');

    if (!cpf || !telefone) {
      throw new Error('Preencha CPF e telefone');
    }

    if (!validarCPF(cpf)) {
      throw new Error('CPF inválido');
    }

    const pacientes = await pacientesAPI.findAll();
    const cpfLimpo = formatarCPF(cpf);
    const telefoneLimpo = telefone.replace(/\D/g, '');
    
    const paciente = pacientes.find(
      p => formatarCPF(p.cpf) === cpfLimpo && 
           p.telefone?.replace(/\D/g, '') === telefoneLimpo
    );

    if (!paciente) {
      throw new Error('CPF ou telefone incorretos');
    }

    if (!paciente.cep || !paciente.dataNascimento) {
      throw new Error('Cadastro incompleto. Entre em contato com o suporte.');
    }

    // Simulação de  recuperação de senha por código SMS
    const senha = gerarSenhaDerivada(paciente.cep, paciente.dataNascimento);
    const codigoSMS = Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos

    console.log('Código SMS simulado:', codigoSMS);
    console.log('Senha recuperada:', senha);

    return { paciente, senha, codigoSMS };
  },

  validarCodigoSMS: (codigoInformado: string, codigoCorreto: string): boolean => {
    return codigoInformado === codigoCorreto;
  },

  criarNovaSenha: async (
    paciente: TipoPaciente, 
    novaSenha: string
  ): Promise<{ sucesso: boolean; mensagem: string }> => {
    console.log('AVISO: Alteração de senha requer modificação do CEP');
    

    
    return {
      sucesso: true,
      mensagem: `Nova senha criada! Use: ${novaSenha} para fazer login`
    };
  },

  obterDicaSenha: (): string => {
    return `Sua senha é formada por:
    
 CEP (8 dígitos) + Dia do nascimento (2 dígitos)

Exemplo:
• CEP: 01310-100 → 01310100
• Nascimento: 15/05/1990 → 15
• Senha: 0131010015`;
  },

  atualizarSessao: (paciente: TipoPaciente): void => {
    sessionService.atualizarSessao(paciente);
  },

  calcularSenha: (cep: string, dataNascimento: string): string => {
    return gerarSenhaDerivada(cep, dataNascimento);
  },

  logout: (): void => {
    sessionService.logout();
  },

  obterPacienteLogado: (): TipoPaciente | null => {
    return sessionService.obterPaciente();
  },

  estaLogado: (): boolean => {
    return sessionService.estaLogado();
  }
};

export default authService;