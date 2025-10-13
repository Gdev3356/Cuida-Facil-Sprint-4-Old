import { useState, useEffect } from 'react';
import type { TipoConsulta } from '../../types/Consulta';

function NotificacaoLembrete({ consultasProximas, fecharNotificacao }: { consultasProximas: TipoConsulta[], fecharNotificacao: () => void }) {
    const mensagem = consultasProximas
        .map(c => `Lembrete: Consulta de ${c.especialidade} às ${c.horario}, na ${c.unidade}.`)
        .join('\n');

    return (
        <div className="notificacao">
            <p>{mensagem}</p>
            <button onClick={fecharNotificacao}>Fechar</button>
        </div>
    );
}


export default function Formulario() {

    const [data, setData] = useState('');
    const [especialidade, setEspecialidade] = useState('');
    const [unidade, setUnidade] = useState('');
    const [horario, setHorario] = useState('');
    

    const [isConfirmed, setIsConfirmed] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    const [notificacao, setNotificacao] = useState<TipoConsulta[] | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const consultas: TipoConsulta[] = JSON.parse(localStorage.getItem("consultas") || "[]");
            const agora = new Date();
            const proximas = consultas.filter(c => {
                const dataHoraConsulta = new Date(`${c.data}T${c.horario}`);
                const diffMin = (dataHoraConsulta.getTime() - agora.getTime()) / 60000;
                return diffMin > 0 && diffMin <= 60;
            });

            if (proximas.length > 0) {
                setNotificacao(proximas);
            }
        }, 5000); 

        return () => clearTimeout(timer); 
    }, []);


    const handleConfirmar = () => {
        if (!data || !especialidade || !unidade || !horario) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataSelecionada = new Date(data);
        dataSelecionada.setMinutes(dataSelecionada.getMinutes() + dataSelecionada.getTimezoneOffset()); // Ajuste de fuso horário

        if (dataSelecionada < hoje) {
            alert("A data selecionada já passou. Por favor, escolha uma data futura.");
            return;
        }

        const hora = parseInt(horario.split(":")[0]);
        if (hora < 7 || hora >= 18) {
            alert("O horário deve ser entre 07:00 e 18:00.");
            return;
        }

        const novaConsulta: TipoConsulta = { data, horario, especialidade, unidade, id: Date.now() };
        const consultas: TipoConsulta[] = JSON.parse(localStorage.getItem("consultas") || "[]");
        consultas.push(novaConsulta);
        localStorage.setItem("consultas", JSON.stringify(consultas));

        setConfirmationMessage(`Consulta marcada para ${data}, às ${horario}, de ${especialidade}, na unidade ${unidade}.`);
        setIsConfirmed(true);
    };

    const resetForm = () => {
        setData('');
        setEspecialidade('');
        setUnidade('');
        setHorario('');
    };

    const handleVoltarFormulario = () => {
        setIsConfirmed(false);
        resetForm();
    };

    return (
        <>
            {!isConfirmed ? (
                <div className="container">
                    <h2 className="form-title">Marcar Consulta</h2>
                    <input type="date" value={data} onChange={e => setData(e.target.value)} className="input-field" />
                    <select value={especialidade} onChange={e => setEspecialidade(e.target.value)} className="input-field">
                        <option value="">Selecione uma especialidade</option>
                        <option value="Cardiologia">Cardiologia</option>
                        <option value="Ortopedia">Ortopedia</option>
                        <option value="Pediatria">Pediatria</option>
                    </select>
                    <select value={unidade} onChange={e => setUnidade(e.target.value)} className="input-field">
                        <option value="">Selecione uma unidade</option>
                        <option value="HC Central">HC Central</option>
                        <option value="HC Pinheiros">HC Pinheiros</option>
                        <option value="IMREA Vila Mariana">IMREA Vila Mariana</option>
                    </select>
                    <input type="time" value={horario} onChange={e => setHorario(e.target.value)} className="input-field" />
                    <div className="buttons">
                        <button onClick={resetForm}>Cancelar</button>
                        <button onClick={handleConfirmar}>Confirmar</button>
                    </div>
                </div>
            ) : (
                <div className="container">
                    <h2 className="form-title">Consulta Marcada</h2>
                    <p>{confirmationMessage}</p>
                    <div className="buttons">
                        <button onClick={handleVoltarFormulario}>Marcar Outra</button>
                    </div>
                </div>
            )}
            {notificacao && (
                <NotificacaoLembrete 
                    consultasProximas={notificacao} 
                    fecharNotificacao={() => setNotificacao(null)} 
                />
            )}
        </>
    );
}