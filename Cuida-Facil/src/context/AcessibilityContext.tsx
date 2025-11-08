import { createContext, useContext, useState, useEffect} from 'react'; 
import type { ReactNode } from 'react';

type TemaType = 'claro' | 'escuro';
type ContrasteType = 'normal' | 'alto' | 'muito-alto';
type TamanhoFonteType = 'normal' | 'grande' | 'muito-grande';

interface AccessibilityContextType {
  tema: TemaType;
  contraste: ContrasteType;
  tamanhoFonte: TamanhoFonteType;
  leitorAtivo: boolean;
  alternarTema: () => void;
  alternarContraste: () => void;
  alternarTamanhoFonte: () => void;
  alternarLeitor: () => void;
  lerTexto: (texto: string) => void;
  pararLeitura: () => void;
  resetarConfiguracoes: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<TemaType>('claro');
  const [contraste, setContraste] = useState<ContrasteType>('normal');
  const [tamanhoFonte, setTamanhoFonte] = useState<TamanhoFonteType>('normal');
  const [leitorAtivo, setLeitorAtivo] = useState(false);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  // Inicializar Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSynth(window.speechSynthesis);
    }
  }, []);

  // Carregar configurações salvas
  useEffect(() => {
    const temaSalvo = localStorage.getItem('tema') as TemaType;
    const contrasteSalvo = localStorage.getItem('contraste') as ContrasteType;
    const tamanhoFonteSalvo = localStorage.getItem('tamanhoFonte') as TamanhoFonteType;
    const leitorSalvo = localStorage.getItem('leitorAtivo') === 'true';

    if (temaSalvo) setTema(temaSalvo);
    if (contrasteSalvo) setContraste(contrasteSalvo);
    if (tamanhoFonteSalvo) setTamanhoFonte(tamanhoFonteSalvo);
    if (leitorSalvo) setLeitorAtivo(leitorSalvo);
  }, []);

  // Aplicar tema
  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema);
    localStorage.setItem('tema', tema);
  }, [tema]);

  // Aplicar contraste
  useEffect(() => {
    document.documentElement.setAttribute('data-contraste', contraste);
    localStorage.setItem('contraste', contraste);
  }, [contraste]);

  // Aplicar tamanho de fonte
  useEffect(() => {
    document.documentElement.setAttribute('data-tamanho-fonte', tamanhoFonte);
    localStorage.setItem('tamanhoFonte', tamanhoFonte);
  }, [tamanhoFonte]);

  // Salvar estado do leitor
  useEffect(() => {
    localStorage.setItem('leitorAtivo', String(leitorAtivo));
  }, [leitorAtivo]);

  const alternarTema = () => {
    setTema(prev => prev === 'claro' ? 'escuro' : 'claro');
  };

  const alternarContraste = () => {
    setContraste(prev => {
      if (prev === 'normal') return 'alto';
      if (prev === 'alto') return 'muito-alto';
      return 'normal';
    });
  };

  const alternarTamanhoFonte = () => {
    setTamanhoFonte(prev => {
      if (prev === 'normal') return 'grande';
      if (prev === 'grande') return 'muito-grande';
      return 'normal';
    });
  };

  const alternarLeitor = () => {
    setLeitorAtivo(prev => !prev);
    if (leitorAtivo && synth) {
      synth.cancel(); // Para a leitura se desativar
    }
  };

  const lerTexto = (texto: string) => {
    if (!synth || !leitorAtivo) return;

    // Cancelar qualquer leitura em andamento
    synth.cancel();

    // Criar nova utterance
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9; // Velocidade um pouco mais lenta
    utterance.pitch = 1;
    utterance.volume = 1;

    // Falar
    synth.speak(utterance);
  };

  const pararLeitura = () => {
    if (synth) {
      synth.cancel();
    }
  };

  const resetarConfiguracoes = () => {
    setTema('claro');
    setContraste('normal');
    setTamanhoFonte('normal');
    setLeitorAtivo(false);
    pararLeitura();
    
    localStorage.removeItem('tema');
    localStorage.removeItem('contraste');
    localStorage.removeItem('tamanhoFonte');
    localStorage.removeItem('leitorAtivo');
  };

  return (
    <AccessibilityContext.Provider
      value={{
        tema,
        contraste,
        tamanhoFonte,
        leitorAtivo,
        alternarTema,
        alternarContraste,
        alternarTamanhoFonte,
        alternarLeitor,
        lerTexto,
        pararLeitura,
        resetarConfiguracoes,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility deve ser usado dentro de AccessibilityProvider');
  }
  return context;
}