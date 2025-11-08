import { useState, useEffect } from 'react';
import { consultasAPI, especialidadesAPI, unidadesAPI, medicosAPI } from '../../services/api';
import type { TipoEspecialidade } from '../../types/TipoEspecialidade';
import type { TipoUnidade } from '../../types/TipoUnidade';
import type { TipoMedico } from '../../types/TipoMedico';
import type { TipoConsultaCreate } from '../../types/TipoResponse';
import type { TipoPaciente } from '../../types/TipoPaciente';

import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AcessibilityContext';
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
  
  // 2. INSTANCIAR O HOOK
  const { lerTexto, leitorAtivo, pararLeitura } = useAccessibility();

  // 3. CRIAR HANDLER
  const handleLeitura = (texto: string) => {
    if (leitorAtivo) lerTexto(texto);
  };


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
        handleLeitura('Erro: Não foi possível carregar os dados. Recarregue a página.');
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
            const msg = 'Nenhum médico disponível para a especialidade e unidade selecionadas.';
            setError(msg);
            handleLeitura(msg);
          } else if (error === 'Nenhum médico disponível') {
            setError(null);
          }
        } catch (err) {
          setError('Erro ao carregar médicos');
          handleLeitura('Erro ao carregar médicos');
          setMedicos([]);
        }
      };
      carregarMedicos();
    } else {
      setMedicos([]);
      setMedicoId('');
    }
  }, [especialidadeId, unidadeId, error, leitorAtivo]); // Adicionado leitorAtivo para evitar aviso na dependência de handleLeitura

  // Validação
  const validarFormulario = (): boolean => {
    setError(null);
    
    if (!data || !horario || especialidadeId === '' || unidadeId === '' || medicoId === '') {
      const msg = 'Por favor, preencha todos os campos obrigatórios.';
      setError(msg);
      handleLeitura(msg);
      return false;
    }
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(data + 'T00:00:00');
    
    if (dataSelecionada < hoje) {
      const msg = 'A data já passou. Escolha uma data futura.';
      setError(msg);
      handleLeitura(msg);
      return false;
    }
    
    const [hora] = horario.split(':').map(Number);
    if (hora < 7 || hora >= 18) {
      const msg = 'Horário deve ser entre 07:00 e 18:00.';
      setError(msg);
      handleLeitura(msg);
      return false;
    }
    
    return true;
  };

  const submeterFormulario = async (pacienteLogado: TipoPaciente) => {
    if (!validarFormulario()) return;
    
    setLoading(true);
    setError(null);
    handleLeitura("Aguarde, agendando a sua consulta.");
    
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
        idPaciente: pacienteLogado.idPaciente,
        idMedico: idMedicoNum,
        idUnidade: idUnidadeNum,
        idEspecialidade: idEspecialidadeNum,
      };
      
      const consultaCriada = await consultasAPI.save(novaConsulta);
      
      const esp = especialidades.find(e => e.idEspecialidade === idEspecialidadeNum);
      const uni = unidades.find(u => u.idUnidade === idUnidadeNum);
      const med = medicos.find(m => m.idMedico === idMedicoNum);
      
      const confMsg = 
        `Consulta agendada para ${pacienteLogado.nome}!\n\n` + 
        `Protocolo: ${consultaCriada.protocolo}\n` +
        `Data: ${new Date(data).toLocaleDateString('pt-BR')}\n` +
        `Horário: ${horario}\n` +
        `Especialidade: ${esp?.nome || 'N/A'}\n` +
        `Unidade: ${uni?.cdUnidade || uni?.codigo || 'N/A'}\n` +
        `Endereço: ${uni?.endereco || 'N/A'}\n` +
        `Médico: ${med?.nome || 'N/A'}\n` +
        `Tipo: ${tipoAtendimento === 'PRESENCIAL' ? 'Presencial' : 'Teleconsulta'}`;

      setConfirmationMessage(confMsg);
      setIsConfirmed(true);
      handleLeitura(`Consulta Confirmada! ${confMsg.replace(/\n/g, '. ')}`);
    } catch (err) {
      console.error('Erro completo:', err);
      const msg = err instanceof Error ? err.message : 'Erro ao agendar';
      const finalMsg = msg.includes('400') ? 'Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.' : msg;
      setError(finalMsg);
      handleLeitura(`Erro ao agendar: ${finalMsg}`);
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
    handleLeitura("Formulário de agendamento cancelado e redefinido.");
  };

  const handleConfirmarClick = async () => {
    if (!validarFormulario()) return;

    if (estaLogado && paciente) {
      await submeterFormulario(paciente);
    } else {
      const msg = 'Você precisa fazer login ou se cadastrar para agendar a consulta.';
      setError(msg);
      handleLeitura(msg);
      setShowLoginModal(true);
    }
  };


  const handleLoginSucesso = async (pacienteNovo: TipoPaciente) => {
    login(pacienteNovo); 
    setShowLoginModal(false); 
    setError(null);
    
    // Após o login, submete o formulário com os dados já preenchidos
    await submeterFormulario(pacienteNovo);
  };


  if (isConfirmed) {
    return (
      <div className="container">
        <div className="success-container">
          <h2 
            className="success-title"
            onMouseEnter={() => handleLeitura("Consulta Confirmada! Clique na tela para ouvir os detalhes.")}
            onFocus={() => handleLeitura("Consulta Confirmada! Clique na tela para ouvir os detalhes.")}
            onMouseLeave={pararLeitura}
            tabIndex={0}
          >
            <span className="success-icon">
              <img src="https://img.icons8.com/?size=100&id=5576&format=png&color=FFFFFF" alt="sucesso" />
            </span>
            Consulta Confirmada!
          </h2>
          <pre 
            className="success-message"
            onMouseEnter={() => handleLeitura(confirmationMessage.replace(/\n/g, ' - '))}
            onFocus={() => handleLeitura(confirmationMessage.replace(/\n/g, ' - '))}
            onMouseLeave={pararLeitura}
            tabIndex={0}
          >
            {confirmationMessage}
          </pre>
        </div>
        <button 
          onClick={() => { setIsConfirmed(false); resetForm(); }} 
          className="button-form-success"
          onMouseEnter={() => handleLeitura("Botão: Agendar Nova Consulta")}
          onFocus={() => handleLeitura("Botão: Agendar Nova Consulta")}
          onMouseLeave={pararLeitura}
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
        <p 
          className="loading-text"
          onMouseEnter={() => handleLeitura("Carregando formulário. Aguarde.")}
          onFocus={() => handleLeitura("Carregando formulário. Aguarde.")}
          onMouseLeave={pararLeitura}
          tabIndex={0}
        >
          Carregando formulário...
        </p>
      </div>
    );
  }

  return (
    <>
      
      <div className="container">
        <h2 
          className="form-title"
          onMouseEnter={() => handleLeitura("Título do Formulário: Agendar Consulta")}
          onFocus={() => handleLeitura("Título do Formulário: Agendar Consulta")}
          onMouseLeave={pararLeitura}
          tabIndex={0}
        >
          Agendar Consulta
        </h2>
        
        {error && (
          <div 
            className="erro"
            onMouseEnter={() => handleLeitura(`Mensagem de Erro: ${error}`)}
            onFocus={() => handleLeitura(`Mensagem de Erro: ${error}`)}
            onMouseLeave={pararLeitura}
            tabIndex={0}
          >
            Erro! {error}
          </div>
        )}
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <div>
            <label htmlFor="data" className="form-label">Data da Consulta *</label>
            <input 
              id="data" 
              type="date" 
              value={data} 
              onChange={e => setData(e.target.value)} 
              className="input-field" 
              min={new Date().toISOString().split('T')[0]} 
              required
              onFocus={() => handleLeitura("Campo: Data da Consulta. Escolha uma data futura.")}
              onMouseLeave={pararLeitura}
            />
          </div>
          
          <div>
            <label htmlFor="horario" className="form-label">Horário (07:00 - 18:00) *</label>
            <input 
              id="horario" 
              type="time" 
              value={horario} 
              onChange={e => setHorario(e.target.value)} 
              className="input-field" 
              min="07:00" 
              max="18:00" 
              required 
              onFocus={() => handleLeitura("Campo: Horário da Consulta. Deve ser entre 07:00 e 18:00.")}
              onMouseLeave={pararLeitura}
            />
          </div>
          
          <div>
            <label htmlFor="especialidade" className="form-label">Especialidade *</label>
            <select 
              id="especialidade" 
              value={especialidadeId === '' ? '' : String(especialidadeId)} 
              onChange={e => setEspecialidadeId(e.target.value ? Number(e.target.value) : '')} 
              className="input-field" 
              required
              onFocus={() => handleLeitura("Campo de seleção: Especialidade. Escolha a especialidade desejada.")}
              onMouseLeave={pararLeitura}
            >
              <option value="">Selecione uma especialidade</option>
              {especialidades.map(esp => (
                <option key={esp.idEspecialidade} value={String(esp.idEspecialidade)}>{esp.nome}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="unidade" className="form-label">Unidade de Atendimento *</label>
            <select 
              id="unidade" 
              value={unidadeId === '' ? '' : String(unidadeId)} 
              onChange={e => setUnidadeId(e.target.value ? Number(e.target.value) : '')} 
              className="input-field" 
              required
              onFocus={() => handleLeitura("Campo de seleção: Unidade de Atendimento. Escolha o local da consulta.")}
              onMouseLeave={pararLeitura}
            >
              <option value="">Selecione uma unidade</option>
              {unidades.map(u => (
                <option key={u.idUnidade} value={String(u.idUnidade)}>{u.cdUnidade || u.codigo} - {u.endereco}</option>
              ))}
            </select>
          </div>
          
          {especialidadeId !== '' && unidadeId !== '' && (
            <div>
              <label htmlFor="medico" className="form-label">Médico *</label>
              <select 
                id="medico" 
                value={medicoId === '' ? '' : String(medicoId)} 
                onChange={e => setMedicoId(e.target.value ? Number(e.target.value) : '')} 
                className="input-field" 
                disabled={medicos.length === 0} 
                required
                onFocus={() => handleLeitura(`Campo de seleção: Médico. ${medicos.length === 0 ? 'Nenhum médico disponível para esta combinação.' : 'Escolha o profissional que irá te atender.'}`)}
                onMouseLeave={pararLeitura}
              >
                <option value="">Selecione um médico</option>
                {medicos.map(m => (
                  <option key={m.idMedico} value={String(m.idMedico)}>{m.nome} - {m.crm}</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label 
              className="form-label" 
              style={{display: 'block', marginBottom: '10px'}}
              onMouseEnter={() => handleLeitura("Tipo de Atendimento. Escolha entre Presencial ou Teleconsulta.")}
              onFocus={() => handleLeitura("Tipo de Atendimento. Escolha entre Presencial ou Teleconsulta.")}
              onMouseLeave={pararLeitura}
              tabIndex={0}
            >
              Tipo de Atendimento *
            </label>
            <div className="radio-container">
              <label 
                className={`radio-label ${tipoAtendimento === 'PRESENCIAL' ? 'selected' : ''}`}
                onMouseEnter={() => handleLeitura("Opção: Presencial")}
                onFocus={() => handleLeitura("Opção: Presencial")}
                onMouseLeave={pararLeitura}
              >
                <input type="radio" value="PRESENCIAL" checked={tipoAtendimento === 'PRESENCIAL'} onChange={e => setTipoAtendimento(e.target.value as 'PRESENCIAL')} className="radio-input"/>
                <span>Presencial</span>
              </label>
              <label 
                className={`radio-label ${tipoAtendimento === 'TELECONSULTA' ? 'selected' : ''}`}
                onMouseEnter={() => handleLeitura("Opção: Teleconsulta")}
                onFocus={() => handleLeitura("Opção: Teleconsulta")}
                onMouseLeave={pararLeitura}
              >
                <input type="radio" value="TELECONSULTA" checked={tipoAtendimento === 'TELECONSULTA'} onChange={e => setTipoAtendimento(e.target.value as 'TELECONSULTA')} className="radio-input"/>
                <span>Teleconsulta</span>
              </label>
            </div>
          </div>
          
          <div className="center-button">
            <button 
              type="button" 
              onClick={resetForm} 
              className="button-form" 
              disabled={loading}
              onMouseEnter={() => handleLeitura("Botão: Cancelar e limpar o formulário")}
              onFocus={() => handleLeitura("Botão: Cancelar e limpar o formulário")}
              onMouseLeave={pararLeitura}
            >
              Cancelar
            </button>
            <button 
              type="button" 
              onClick={handleConfirmarClick}
              className="button-form" 
              disabled={loading}
              onMouseEnter={() => handleLeitura("Botão: Confirmar Agendamento. Será necessário fazer login se você ainda não estiver logado.")}
              onFocus={() => handleLeitura("Botão: Confirmar Agendamento. Será necessário fazer login se você ainda não estiver logado.")}
              onMouseLeave={pararLeitura}
            >
              {loading ? 'Agendando...' : 'Confirmar Agendamento'}
            </button>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <Modal 
          onClose={() => { 
            setShowLoginModal(false); 
            handleLeitura("Modal de login fechado.");
          }}
        >
          <SistemaLogin 
            onLoginSucesso={handleLoginSucesso} 
          />
        </Modal>
      )}
    </>
  );
}