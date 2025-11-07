import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth';
import type { TipoPaciente } from '../types';

interface AuthContextType {
  paciente: TipoPaciente | null;
  estaLogado: boolean;
  login: (paciente: TipoPaciente) => void; // Login simplificado após cadastro
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [paciente, setPaciente] = useState<TipoPaciente | null>(() => {
    // Inicializa o estado lendo do authService
    return authService.obterPacienteLogado();
  });

  const estaLogado = !!paciente;
  
  const login = (paciente: TipoPaciente) => {
    setPaciente(paciente);
    authService.atualizarSessao(paciente); 
  };
  
  const logout = () => {
    authService.logout();
    setPaciente(null);
  };

  const value = {
    paciente,
    estaLogado,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}