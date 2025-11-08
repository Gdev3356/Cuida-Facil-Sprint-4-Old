import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import Modal from './Modal';
import { useAccessibility } from '../../context/AcessibilityContext'; // Importação mantida para acessibilidade

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
  const { lerTexto, pararLeitura } = useAccessibility();

  useEffect(() => {
    if (isOpen) {
      setNovaData('');
      setNovaHora('');
      setErro('');
      const titulo = `Reagendamento de Consulta para ${consultaAtual.nomeEspecialidade || 'Serviço Médico'}`;
      lerTexto(titulo + ". Preencha a nova data e horário.");
    }
    return () => pararLeitura();
  }, [isOpen, consultaAtual.nomeEspecialidade, lerTexto, pararLeitura]);

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

  const getDataMinima = () => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    return amanha.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!novaData || !novaHora) {
      const msg = 'Por favor, preencha data e horário.';
      setErro(msg);
      lerTexto(`Erro: ${msg}`);
      return;
    }

    const dataHoraEscolhida = new Date(`${novaData}T${novaHora}`);
    const agora = new Date();

    if (dataHoraEscolhida <= agora) {
      const msg = 'A data e hora devem ser futuras.';
      setErro(msg);
      lerTexto(`Erro: ${msg}`);
      return;
    }

    if (novaHora < '08:00' || novaHora > '18:00') {
      const msg = 'Horário deve estar entre 8h e 18h.';
      setErro(msg);
      lerTexto(`Erro: ${msg}`);
      return;
    }

    // Combina data e hora no formato ISO local (sem 'Z' no final), como esperado pelo seu código original.
    const dataHoraCompleta = `${novaData}T${novaHora}:00`;
    onConfirm(dataHoraCompleta);
    lerTexto(`Reagendamento confirmado para ${formatarDataAtual(dataHoraCompleta)}.`);
  };

  return (
    <Modal onClose={onClose}>
      <div className="container">
        <h2 
          className="form-title"
          onMouseEnter={() => lerTexto(`Reagendar Consulta para ${consultaAtual.nomeEspecialidade || 'Consulta'}`)}
          onFocus={() => lerTexto(`Reagendar Consulta para ${consultaAtual.nomeEspecialidade || 'Consulta'}`)}
          onMouseLeave={pararLeitura}
          tabIndex={0}
        >
          Reagendar Consulta
        </h2>
        
        <div className="auth-info-text">
          <strong>Especialidade:</strong> {consultaAtual.nomeEspecialidade || 'Consulta'}
        </div>
        
        <div className="auth-info-text mb-4">
          <strong>Data atual:</strong> {formatarDataAtual(consultaAtual.dataAtual)}
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="novaData" className="form-label">
              <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Nova Data *
            </label>
            <input
              id="novaData"
              type="date"
              value={novaData}
              onChange={(e) => setNovaData(e.target.value)}
              min={getDataMinima()}
              className="input-field"
              required
              onFocus={() => lerTexto("Campo: Nova Data. Escolha uma data futura a partir de amanhã.")}
              onMouseLeave={pararLeitura}
            />
          </div>

          <div>
            <label htmlFor="novaHora" className="form-label">
              <Clock size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Novo Horário *
            </label>
            <input
              id="novaHora"
              type="time"
              value={novaHora}
              onChange={(e) => setNovaHora(e.target.value)}
              min="08:00"
              max="18:00"
              step="1800"
              className="input-field"
              required
              onFocus={() => lerTexto("Campo: Novo Horário. Deve ser entre 08:00 e 18:00.")}
              onMouseLeave={pararLeitura}
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
              onMouseEnter={() => lerTexto("Botão: Cancelar reagendamento")}
              onFocus={() => lerTexto("Botão: Cancelar reagendamento")}
              onMouseLeave={pararLeitura}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="button-form"
              style={{ background: 'linear-gradient(to bottom, #009fdb, #34d6ff)' }}
              onMouseEnter={() => lerTexto("Botão: Confirmar o novo reagendamento")}
              onFocus={() => lerTexto("Botão: Confirmar o novo reagendamento")}
              onMouseLeave={pararLeitura}
            >
              Confirmar Reagendamento
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}