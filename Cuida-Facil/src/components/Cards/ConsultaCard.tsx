import { Calendar, Clock, User, MapPin, Stethoscope, Trash2 } from 'lucide-react';
import type { TipoConsultaDetalhada } from '../../types/TipoConsultaDetalhada';

type ConsultaCardProps = {
  consulta: TipoConsultaDetalhada;
  onCancelar: (id: number) => void;
  onReagendar: (id: number) => void;
  onDeletar: (id: number) => void;
};

export default function ConsultaCard({ consulta, onCancelar, onReagendar, onDeletar }: ConsultaCardProps) {
  // Formatar data para exibição
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Formatar hora para exibição
  const formatarHora = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Determinar classe do badge de status
  const getStatusClass = (status: string) => {
    const statusMap: Record<string, string> = {
      'AGENDADA': 'status-agendada',
      'REAGENDADA': 'status-reagendada',
      'CONCLUIDA': 'status-concluida',
      'CANCELADA': 'status-cancelada'
    };
    return statusMap[status.toUpperCase()] || 'status-default';
  };

  // Traduzir status para português
  const traduzirStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'AGENDADA': 'Agendada',
      'REAGENDADA': 'Reagendada',
      'CONCLUIDA': 'Concluída',
      'CANCELADA': 'Cancelada'
    };
    return statusMap[status.toUpperCase()] || status;
  };

  // Verificar se pode cancelar/reagendar
  const podeModificar = ['AGENDADA', 'REAGENDADA'].includes(consulta.status.toUpperCase());
  
  // Verificar se pode deletar (apenas canceladas)
  const podeDeletar = consulta.status.toUpperCase() === 'CANCELADA';

  return (
    <div className="consulta-card">
      {/* Header com título e status */}
      <div className="consulta-card-header">
        <div className="consulta-card-info">
          <h3 className="consulta-card-title">{consulta.nomeEspecialidade || 'Consulta'}</h3>
          <p className="consulta-protocolo">Protocolo: #{consulta.idConsulta}</p>
        </div>
        <span className={`consulta-status-badge ${getStatusClass(consulta.status)}`}>
          {traduzirStatus(consulta.status)}
        </span>
      </div>

      <div className="consulta-card-body">
        <div className="consulta-info-grid">
          <div className="consulta-info-item">
            <Calendar size={16} className="consulta-icon" />
            <div>
              <p className="consulta-label">Data</p>
              <p className="consulta-value">{formatarData(consulta.dataConsulta)}</p>
            </div>
          </div>

          <div className="consulta-info-item">
            <Clock size={16} className="consulta-icon" />
            <div>
              <p className="consulta-label">Horário</p>
              <p className="consulta-value">{formatarHora(consulta.dataConsulta)}</p>
            </div>
          </div>

          {consulta.nomeMedico && (
            <div className="consulta-info-item consulta-info-full">
              <User size={16} className="consulta-icon" />
              <div>
                <p className="consulta-label">Médico(a)</p>
                <p className="consulta-value">Dr(a). {consulta.nomeMedico}</p>
              </div>
            </div>
          )}

          {consulta.nomeUnidade && (
            <div className="consulta-info-item consulta-info-full">
              <MapPin size={16} className="consulta-icon" />
              <div>
                <p className="consulta-label">Unidade</p>
                <p className="consulta-value">{consulta.nomeUnidade}</p>
              </div>
            </div>
          )}

          {consulta.nomeEspecialidade && (
            <div className="consulta-info-item consulta-info-full">
              <Stethoscope size={16} className="consulta-icon" />
              <div>
                <p className="consulta-label">Serviço</p>
                <p className="consulta-value">{consulta.nomeEspecialidade}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer com ações */}
      {(podeModificar || podeDeletar) && (
        <div className="consulta-card-footer">
          {podeModificar && (
            <>
              <button
                onClick={() => onReagendar(consulta.idConsulta)}
                className="consulta-btn consulta-btn-secondary"
              >
                Reagendar
              </button>
              <button
                onClick={() => onCancelar(consulta.idConsulta)}
                className="consulta-btn consulta-btn-danger"
              >
                Cancelar
              </button>
            </>
          )}
          
          {podeDeletar && (
            <button
              onClick={() => onDeletar(consulta.idConsulta)}
              className="consulta-btn consulta-btn-delete"
              title="Excluir consulta permanentemente"
            >
              <Trash2 size={16} />
              Excluir
            </button>
          )}
        </div>
      )}
    </div>
  );
}