import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { consultasAPI } from '../services/api';
import { useNotification } from '../components/Notificacao/NotificationContainer';
import type { TipoConsultaDetalhada } from '../types/TipoConsultaDetalhada';

const NOTIFICATION_KEY = 'hc_notificacoes_mostradas';
const CHECK_INTERVAL = 60000; // Verifica a cada 1 minuto

interface NotificationRecord {
  consultaId: number;
  timestamp: number;
  tipo: 'proxima' | 'hoje' | 'urgente';
}

export function useConsultaNotification() {
  const { paciente, estaLogado } = useAuth();
  const { addNotification } = useNotification();
  const verificacaoRef = useRef<NodeJS.Timeout | null>(null);

  // Carrega notificações já mostradas
  const getNotificacoesMostradas = (): NotificationRecord[] => {
    try {
      const stored = localStorage.getItem(NOTIFICATION_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Salva notificação como mostrada
  const marcarComoMostrada = (consultaId: number, tipo: NotificationRecord['tipo']) => {
    const notificacoes = getNotificacoesMostradas();
    notificacoes.push({
      consultaId,
      timestamp: Date.now(),
      tipo
    });
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notificacoes));
  };

  // Limpa notificações antigas (mais de 7 dias)
  const limparNotificacoesAntigas = () => {
    const notificacoes = getNotificacoesMostradas();
    const seteDiasAtras = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const notificacoesRecentes = notificacoes.filter(n => n.timestamp > seteDiasAtras);
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notificacoesRecentes));
  };

  // Verifica se já mostrou notificação para essa consulta
  const jaFoiNotificado = (consultaId: number, tipo: NotificationRecord['tipo']): boolean => {
    const notificacoes = getNotificacoesMostradas();
    const umDiaAtras = Date.now() - (24 * 60 * 60 * 1000);
    
    return notificacoes.some(n => 
      n.consultaId === consultaId && 
      n.tipo === tipo &&
      n.timestamp > umDiaAtras // Só considera se foi nas últimas 24h
    );
  };

  // Calcula diferença em horas
  const calcularDiferencaHoras = (dataConsulta: string): number => {
    const agora = new Date();
    const consulta = new Date(dataConsulta);
    return (consulta.getTime() - agora.getTime()) / (1000 * 60 * 60);
  };

  // Verifica se é hoje
  const isHoje = (dataConsulta: string): boolean => {
    const hoje = new Date();
    const consulta = new Date(dataConsulta);
    return (
      consulta.getDate() === hoje.getDate() &&
      consulta.getMonth() === hoje.getMonth() &&
      consulta.getFullYear() === hoje.getFullYear()
    );
  };

  // Formata data para exibição
  const formatarDataHora = (dataISO: string): string => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Verifica consultas próximas
  const verificarConsultasProximas = async () => {
    if (!estaLogado || !paciente) return;

    try {
      const todasConsultas = await consultasAPI.findAll();
      const minhasConsultas = todasConsultas.filter(
        c => c.idPaciente === paciente.idPaciente &&
        (c.status === 'AGENDADA' || c.status === 'REAGENDADA')
      );

      const agora = new Date();

      minhasConsultas.forEach((consulta: TipoConsultaDetalhada) => {
        const dataConsulta = new Date(consulta.dataConsulta);
        
        // Ignora consultas passadas
        if (dataConsulta < agora) return;

        const horasAteConsulta = calcularDiferencaHoras(consulta.dataConsulta);

        // Notificação URGENTE: Faltam 2 horas ou menos
        if (horasAteConsulta <= 2 && horasAteConsulta > 0) {
          if (!jaFoiNotificado(consulta.idConsulta, 'urgente')) {
            const minutosRestantes = Math.round(horasAteConsulta * 60);
            addNotification({
              type: 'error',
              title: 'Consulta em breve!',
              message: `Sua consulta de ${consulta.nomeEspecialidade} começa em ${minutosRestantes} minutos! ${formatarDataHora(consulta.dataConsulta)}`,
              linkTo: '/minhas-consultas',
              linkText: 'Ver consultas',
              autoClose: false // Não fecha automaticamente
            });
            marcarComoMostrada(consulta.idConsulta, 'urgente');
          }
        }
        // Notificação HOJE: É hoje mas faltam mais de 2 horas
        else if (isHoje(consulta.dataConsulta) && horasAteConsulta > 2) {
          if (!jaFoiNotificado(consulta.idConsulta, 'hoje')) {
            addNotification({
              type: 'warning',
              title: 'Consulta hoje',
              message: `Você tem consulta de ${consulta.nomeEspecialidade} hoje às ${formatarDataHora(consulta.dataConsulta).split(' ')[1]}`,
              linkTo: '/minhas-consultas',
              linkText: 'Ver detalhes',
              duration: 10000
            });
            marcarComoMostrada(consulta.idConsulta, 'hoje');
          }
        }
        // Notificação PRÓXIMA: Faltam 24-48 horas
        else if (horasAteConsulta <= 48 && horasAteConsulta > 24) {
          if (!jaFoiNotificado(consulta.idConsulta, 'proxima')) {
            addNotification({
              type: 'info',
              title: 'Lembrete de consulta',
              message: `Sua consulta de ${consulta.nomeEspecialidade} está agendada para amanhã (${formatarDataHora(consulta.dataConsulta)})`,
              linkTo: '/minhas-consultas',
              linkText: 'Ver consultas',
              duration: 12000
            });
            marcarComoMostrada(consulta.idConsulta, 'proxima');
          }
        }
      });

    } catch (error) {
      console.error('Erro ao verificar consultas:', error);
    }
  };

  useEffect(() => {
    if (!estaLogado || !paciente) return;

    // Limpa notificações antigas ao iniciar
    limparNotificacoesAntigas();

    // Verifica imediatamente ao montar (após 3 segundos para não atrapalhar o carregamento)
    const timeoutInicial = setTimeout(() => {
      verificarConsultasProximas();
    }, 3000);

    // Configura verificação periódica
    verificacaoRef.current = setInterval(() => {
      verificarConsultasProximas();
    }, CHECK_INTERVAL);

    return () => {
      clearTimeout(timeoutInicial);
      if (verificacaoRef.current) {
        clearInterval(verificacaoRef.current);
      }
    };
  }, [estaLogado, paciente]);

  return {
    verificarAgora: verificarConsultasProximas
  };
}