import { Calendar, Clock, User, MapPin, Stethoscope, Trash2 } from 'lucide-react';
import type { TipoConsultaDetalhada } from '../../types/TipoConsultaDetalhada';
import { useAccessibility } from '../../context/AcessibilityContext';

type ConsultaCardProps = {
  consulta: TipoConsultaDetalhada;
  onCancelar: (id: number) => void;
  onReagendar: (id: number) => void;
  onDeletar: (id: number) => void;
};

const STATUS_MODIFICAVEIS = ['AGENDADA', 'REAGENDADA'];
const STATUS_DELETAVEIS = ['CANCELADA', 'REALIZADA'];

export default function ConsultaCard({ consulta, onCancelar, onReagendar, onDeletar }: ConsultaCardProps) {
  const { lerTexto, leitorAtivo, pararLeitura } = useAccessibility();

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatarHora = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status: string) => {
    const statusMap: Record<string, string> = {
      'AGENDADA': 'status-agendada',
      'REAGENDADA': 'status-reagendada',
      'CANCELADA': 'status-cancelada',
      'REALIZADA': 'status-realizada',
    };
    return statusMap[status.toUpperCase()] || 'status-desconhecida';
  };
  
  const traduzirStatus = (status: string) => {
      const statusMap: Record<string, string> = {
        'AGENDADA': 'Agendada',
        'REAGENDADA': 'Reagendada',
        'CANCELADA': 'Cancelada',
        'REALIZADA': 'Realizada',
      };
      return statusMap[status.toUpperCase()] || 'Status Desconhecido';
  };

  const podeModificar = STATUS_MODIFICAVEIS.includes(consulta.status);
  const podeDeletar = STATUS_DELETAVEIS.includes(consulta.status);

  const handleLeituraCard = () => {
    if (!leitorAtivo) return;

    const data = formatarData(consulta.dataConsulta);
    const hora = formatarHora(consulta.dataConsulta);
    const status = traduzirStatus(consulta.status);
    const especialidade = consulta.nomeEspecialidade || 'Consulta Médica';
    

    const textoResumo = `
      Consulta de ${especialidade}. 
      Status atual: ${status}. 
      Data: ${data} às ${hora}.
      ${consulta.nomeMedico ? `Com o Doutor(a) ${consulta.nomeMedico}.` : ''}
      ${consulta.nomeUnidade ? `Na unidade ${consulta.nomeUnidade}.` : ''}
    `;
    lerTexto(textoResumo);
  };

  const handleLeituraBotao = (texto: string) => {
    if (leitorAtivo) lerTexto(texto);
  };
  
  return (
    <div 
      className="consulta-card"
      tabIndex={0}
      onMouseEnter={handleLeituraCard}
      onFocus={handleLeituraCard}
      onMouseLeave={pararLeitura}
    >
      <div className="consulta-card-header">
        <h3 className="consulta-title">{consulta.nomeEspecialidade || 'Consulta Médica'}</h3>
        <span className={`consulta-status ${getStatusClass(consulta.status)}`}>
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
              <p className="consulta-label">Hora</p>
              <p className="consulta-value">{formatarHora(consulta.dataConsulta)}</p>
            </div>
          </div>
          
          {consulta.nomeMedico && (
            <div className="consulta-info-item">
              <User size={16} className="consulta-icon" />
              <div>
                <p className="consulta-label">Médico</p>
                <p className="consulta-value">{consulta.nomeMedico}</p>
              </div>
            </div>
          )}

          {consulta.nomeUnidade && (
            <div className="consulta-info-item">
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

      {(podeModificar || podeDeletar) && (
        <div className="consulta-card-footer">
          {podeModificar && (
            <>
              <button
                onClick={() => onReagendar(consulta.idConsulta)}
                className="consulta-btn consulta-btn-secondary"
                onMouseEnter={() => handleLeituraBotao("Botão: Reagendar esta consulta")}
                onFocus={() => handleLeituraBotao("Botão: Reagendar esta consulta")}
                onMouseLeave={pararLeitura}
              >
                Reagendar
              </button>
              <button
                onClick={() => onCancelar(consulta.idConsulta)}
                className="consulta-btn consulta-btn-danger"
                onMouseEnter={() => handleLeituraBotao("Botão: Cancelar esta consulta")}
                onFocus={() => handleLeituraBotao("Botão: Cancelar esta consulta")}
                onMouseLeave={pararLeitura}
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
              onMouseEnter={() => handleLeituraBotao("Botão: Excluir consulta permanentemente")}
              onFocus={() => handleLeituraBotao("Botão: Excluir consulta permanentemente")}
              onMouseLeave={pararLeitura}
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