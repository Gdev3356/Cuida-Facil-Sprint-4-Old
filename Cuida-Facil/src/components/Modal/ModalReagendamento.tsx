import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import Modal from '../Modal/Modal';

type ModalReagendamentoProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (novaData: string) => void;
  consultaAtual: {
    id: number;
    dataAtual: string;
    nomeEspecialidade?: string;
  };
};

export default function ModalReagendamento({ 
  isOpen, 
  onClose, 
  onConfirm, 
  consultaAtual 
}: ModalReagendamentoProps) {
  const [novaData, setNovaData] = useState('');
  const [novaHora, setNovaHora] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNovaData('');
      setNovaHora('');
      setErro('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatarDataAtual = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaData || !novaHora) {
      setErro('Por favor, preencha data e horário');
      return;
    }

    const dataHoraEscolhida = new Date(`${novaData}T${novaHora}`);
    const agora = new Date();

    if (dataHoraEscolhida <= agora) {
      setErro('A data e hora devem ser futuras');
      return;
    }

    const [hora] = novaHora.split(':').map(Number);
    if (hora < 8 || hora >= 18) {
      setErro('Horário deve estar entre 8h e 18h');
      return;
    }

    // Combinar data e hora no formato ISO
    const dataHoraCompleta = `${novaData}T${novaHora}:00`;
    onConfirm(dataHoraCompleta);
  };

  // Data mínima: amanhã
  const getDataMinima = () => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    return amanha.toISOString().split('T')[0];
  };

  return (
    <Modal onClose={onClose}>
      <div className="container">
        <h2 className="form-title">Reagendar Consulta</h2>
        
        <div className="auth-info-text">
          <strong>Especialidade:</strong> {consultaAtual.nomeEspecialidade || 'Consulta'}
        </div>
        
        <div className="auth-info-text">
          <strong>Data atual:</strong> {formatarDataAtual(consultaAtual.dataAtual)}
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="form-label">
              <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Nova Data
            </label>
            <input
              type="date"
              value={novaData}
              onChange={(e) => setNovaData(e.target.value)}
              min={getDataMinima()}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="form-label">
              <Clock size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Novo Horário
            </label>
            <input
              type="time"
              value={novaHora}
              onChange={(e) => setNovaHora(e.target.value)}
              min="08:00"
              max="18:00"
              step="1800"
              className="input-field"
              required
            />
            <p className="auth-info-text" style={{ fontSize: '12px', marginTop: '4px' }}>
              Horário de atendimento: 8h às 18h
            </p>
          </div>

          {erro && <p className="auth-error">{erro}</p>}

          <div className="center-button">
            <button
              type="button"
              onClick={onClose}
              className="button-form"
              style={{ background: 'linear-gradient(to bottom, #6b7280, #4b5563)' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="button-form"
              style={{ background: 'linear-gradient(to bottom, #009fdb, #34d6ff)' }}
            >
              Confirmar Reagendamento
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}