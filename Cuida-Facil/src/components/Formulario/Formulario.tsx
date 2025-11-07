import { useState, useEffect } from 'react';
import { consultasAPI, especialidadesAPI, unidadesAPI, medicosAPI } from '../../services/api';
import type { TipoEspecialidade } from '../../types/TipoEspecialidade';
import type { TipoUnidade } from '../../types/TipoUnidade';
import type { TipoMedico } from '../../types/TipoMedico';
import type { TipoConsultaCreate } from '../../types/TipoResponse';
import type { TipoPaciente } from '../../types/TipoPaciente';

import { useAuth } from '../../context/AuthContext';
import Modal from '../Modal/Modal';
import SistemaLogin from '../Login/Login';

export default function Formulario() {
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [especialidadeId, setEspecialidadeId] = useState<number | ''>('');
  const [unidadeId, setUnidadeId] = useState<number | ''>('');
  const [medicoId, setMedicoId] = useState<number | ''>('');
  const [tipoAtendimento, setTipoAtendimento] = useState<'PRESENCIAL' | 'TELECONSULTA'>('PRESENCIAL');
  
  const [especialidades, setEspecialidades] = useState<TipoEspecialidade[]>([]);
  const [unidades, setUnidades] = useState<TipoUnidade[]>([]);
  const [medicos, setMedicos] = useState<TipoMedico[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const { paciente, estaLogado, login } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        setLoadingData(true);
        const [especialidadesData, unidadesData] = await Promise.all([
          especialidadesAPI.findAll(),
          unidadesAPI.findAll()
        ]);
        setEspecialidades(especialidadesData);
        setUnidades(unidadesData);
      } catch (err) {
        console.error('Erro:', err);
        setError('Não foi possível carregar os dados. Recarregue a página.');
      } finally {
        setLoadingData(false);
      }
    };
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    if (especialidadeId && unidadeId) {
      const carregarMedicos = async () => {
        try {
          const todosMedicos = await medicosAPI.findAll();
          setMedicos(todosMedicos);
          if (todosMedicos.length === 0) {
            setError('Nenhum médico disponível');
          } else if (error === 'Nenhum médico disponível') {
            setError(null);
          }
        } catch (err) {
          setError('Erro ao carregar médicos');
          setMedicos([]);
        }
      };
      carregarMedicos();
    } else {
      setMedicos([]);
      setMedicoId('');
    }
  }, [especialidadeId, unidadeId, error]);

  // === Validação (sem alteração) ===
  const validarFormulario = (): boolean => {
    setError(null);
    
    if (!data || !horario || especialidadeId === '' || unidadeId === '' || medicoId === '') {
      setError('Por favor, preencha todos os campos.');
      return false;
    }
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(data + 'T00:00:00');
    
    if (dataSelecionada < hoje) {
      setError('A data já passou. Escolha uma data futura.');
      return false;
    }
    
    const [hora] = horario.split(':').map(Number);
    if (hora < 7 || hora >= 18) {
      setError('Horário deve ser entre 07:00 e 18:00.');
      return false;
    }
    
    return true;
  };

  const submeterFormulario = async (pacienteLogado: TipoPaciente) => {
    if (!validarFormulario()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const idUnidadeNum = Number(unidadeId);
      const idEspecialidadeNum = Number(especialidadeId);
      const idMedicoNum = Number(medicoId);

      if (isNaN(idUnidadeNum) || isNaN(idEspecialidadeNum) || isNaN(idMedicoNum)) {
        throw new Error('Erro na conversão dos IDs. Por favor, tente novamente.');
      }
      if (!pacienteLogado.idPaciente) { 
        throw new Error("Objeto do paciente não contém 'idPaciente'. Verifique o TipoPaciente.");
      }

      const novaConsulta: TipoConsultaCreate = {
        dataConsulta: `${data}T${horario}:00`,
        status: 'AGENDADA',
        tipoAtendimento,
        idPaciente: pacienteLogado.idPaciente, // <-- ID vindo do Contexto
        idMedico: idMedicoNum,
        idUnidade: idUnidadeNum,
        idEspecialidade: idEspecialidadeNum,
      };
      
      const consultaCriada = await consultasAPI.save(novaConsulta);
      
      const esp = especialidades.find(e => e.idEspecialidade === idEspecialidadeNum);
      const uni = unidades.find(u => u.idUnidade === idUnidadeNum);
      const med = medicos.find(m => m.idMedico === idMedicoNum);
      
      setConfirmationMessage(
        `Consulta agendada para ${pacienteLogado.nome}!\n\n` + // <-- Mensagem com nome
        `Protocolo: ${consultaCriada.protocolo}\n` +
        `Data: ${new Date(data).toLocaleDateString('pt-BR')}\n` +
        `Horário: ${horario}\n` +
        `Especialidade: ${esp?.nome || 'N/A'}\n` +
        `Unidade: ${uni?.cdUnidade || uni?.codigo || 'N/A'}\n` +
        `Endereço: ${uni?.endereco || 'N/A'}\n` +
        `Médico: ${med?.nome || 'N/A'}\n` +
        `Tipo: ${tipoAtendimento === 'PRESENCIAL' ? 'Presencial' : 'Teleconsulta'}`
      );
      setIsConfirmed(true);
    } catch (err) {
      console.error('Erro completo:', err);
      const msg = err instanceof Error ? err.message : 'Erro ao agendar';
      setError(msg.includes('400') ? 'Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.' : msg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setData(''); 
    setHorario(''); 
    setEspecialidadeId(''); 
    setUnidadeId(''); 
    setMedicoId('');
    setTipoAtendimento('PRESENCIAL'); 
    setError(null);
  };

  const handleConfirmarClick = async () => {
    if (!validarFormulario()) return;

    if (estaLogado && paciente) {
      await submeterFormulario(paciente);
    } else {
      setError('Você precisa fazer login ou se cadastrar para agendar a consulta.');
      setShowLoginModal(true);
    }
  };


  const handleLoginSucesso = async (pacienteNovo: TipoPaciente) => {
    login(pacienteNovo); 
    setShowLoginModal(false); 
    setError(null);
    
    await submeterFormulario(pacienteNovo);
  };


  if (isConfirmed) {
    return (
      <div className="container">
        <div className="success-container">
          <h2 className="success-title">
            <span className="success-icon">
              <img src="https://img.icons8.com/?size=100&id=5576&format=png&color=FFFFFF" alt="sucesso" />
            </span>
            Consulta Confirmada!
          </h2>
          <pre className="success-message">
            {confirmationMessage}
          </pre>
        </div>
        <button 
          onClick={() => { setIsConfirmed(false); resetForm(); }} 
          className="button-form-success"
        >
          Agendar Nova Consulta
        </button>
      </div>
    );
  }


  if (loadingData) {
    return (
      <div className="container loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Carregando formulário...</p>
      </div>
    );
  }

  return (
    <>
      
      <div className="container">
        <h2 className="form-title">Agendar Consulta</h2>
        
        {error && (
          <div className="erro">
            Erro! {error}
          </div>
        )}
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <div>
            <label htmlFor="data" className="form-label">Data da Consulta *</label>
            <input id="data" type="date" value={data} onChange={e => setData(e.target.value)} className="input-field" min={new Date().toISOString().split('T')[0]} required />
          </div>
          
          <div>
            <label htmlFor="horario" className="form-label">Horário (07:00 - 18:00) *</label>
            <input id="horario" type="time" value={horario} onChange={e => setHorario(e.target.value)} className="input-field" min="07:00" max="18:00" required />
          </div>
          
          <div>
            <label htmlFor="especialidade" className="form-label">Especialidade *</label>
            <select id="especialidade" value={especialidadeId === '' ? '' : String(especialidadeId)} onChange={e => setEspecialidadeId(e.target.value ? Number(e.target.value) : '')} className="input-field" required>
              <option value="">Selecione uma especialidade</option>
              {especialidades.map(esp => (
                <option key={esp.idEspecialidade} value={String(esp.idEspecialidade)}>{esp.nome}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="unidade" className="form-label">Unidade de Atendimento *</label>
            <select id="unidade" value={unidadeId === '' ? '' : String(unidadeId)} onChange={e => setUnidadeId(e.target.value ? Number(e.target.value) : '')} className="input-field" required>
              <option value="">Selecione uma unidade</option>
              {unidades.map(u => (
                <option key={u.idUnidade} value={String(u.idUnidade)}>{u.cdUnidade || u.codigo} - {u.endereco}</option>
              ))}
            </select>
          </div>
          
          {especialidadeId !== '' && unidadeId !== '' && (
            <div>
              <label htmlFor="medico" className="form-label">Médico *</label>
              <select id="medico" value={medicoId === '' ? '' : String(medicoId)} onChange={e => setMedicoId(e.target.value ? Number(e.target.value) : '')} className="input-field" disabled={medicos.length === 0} required>
                <option value="">Selecione um médico</option>
                {medicos.map(m => (
                  <option key={m.idMedico} value={String(m.idMedico)}>{m.nome} - {m.crm}</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="form-label" style={{display: 'block', marginBottom: '10px'}}>Tipo de Atendimento *</label>
            <div className="radio-container">
              <label className={`radio-label ${tipoAtendimento === 'PRESENCIAL' ? 'selected' : ''}`}>
                <input type="radio" value="PRESENCIAL" checked={tipoAtendimento === 'PRESENCIAL'} onChange={e => setTipoAtendimento(e.target.value as 'PRESENCIAL')} className="radio-input"/>
                <span>Presencial</span>
              </label>
              <label className={`radio-label ${tipoAtendimento === 'TELECONSULTA' ? 'selected' : ''}`}>
                <input type="radio" value="TELECONSULTA" checked={tipoAtendimento === 'TELECONSULTA'} onChange={e => setTipoAtendimento(e.target.value as 'TELECONSULTA')} className="radio-input"/>
                <span>Teleconsulta</span>
              </label>
            </div>
          </div>
          
          <div className="center-button">
            <button type="button" onClick={resetForm} className="button-form" disabled={loading}>
              Cancelar
            </button>
            <button 
              type="button" 
              onClick={handleConfirmarClick}
              className="button-form" 
              disabled={loading}
            >
              {loading ? 'Agendando...' : 'Confirmar Agendamento'}
            </button>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <Modal onClose={() => setShowLoginModal(false)}>
          <SistemaLogin 
            onLoginSucesso={handleLoginSucesso} 
          />
        </Modal>
      )}
    </>
  );
}