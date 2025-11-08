import { useForm, type SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import Logo from '../../components/Logo/Logo';
import CabecalhoMenu from '../../components/Cabecalho/CabecalhoMenu';
import { useAccessibility } from '../../context/AcessibilityContext';

type FormInputs = {
    name: string;
    email: string;
    message: string;
};

const Contato = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormInputs>();
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { lerTexto, pararLeitura } = useAccessibility();

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setIsSuccess(false);
        setError(null);
        lerTexto("Enviando mensagem, aguarde.");

        try {
            const response = await fetch("https://formsubmit.co/ajax/cuidafaciloficial@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setIsSuccess(true);
                lerTexto("Mensagem enviada com sucesso! Obrigado pelo contato.");
                reset();
                setTimeout(() => setIsSuccess(false), 5000); 
            } else {
                const result = await response.json();
                const msg = result.message || "Erro ao enviar a mensagem. Tente novamente mais tarde.";
                setError(msg);
                lerTexto(`Erro ao enviar: ${msg}`);
            }
        } catch (e) {
            const msg = "Falha de conexão. Verifique sua rede.";
            setError(msg);
            lerTexto(`Erro: ${msg}`);
        }
    };

    const handleLeituraCampo = (nomeCampo: string, erro?: string | null) => {
        let texto = `Campo: ${nomeCampo}.`;
        if (erro) {
            texto += ` Erro: ${erro}`;
        }
        lerTexto(texto);
    };

    return (
        <main>
            <Logo/>
            <CabecalhoMenu/>
            <h1
                onMouseEnter={() => lerTexto("Título: Fale Conosco")}
                onFocus={() => lerTexto("Título: Fale Conosco")}
                onMouseLeave={pararLeitura}
                tabIndex={0}
            >
                Fale Conosco
            </h1>
            <div className="contact-form-container">
            
            {isSuccess && (
                <div 
                    className="success-message"
                    onMouseEnter={() => lerTexto("Mensagem de Sucesso: Sua mensagem foi enviada. Em breve entraremos em contato.")}
                    onFocus={() => lerTexto("Mensagem de Sucesso: Sua mensagem foi enviada. Em breve entraremos em contato.")}
                    onMouseLeave={pararLeitura}
                    tabIndex={0}
                >
                    Sua mensagem foi enviada. Em breve entraremos em contato.
                </div>
            )}

            {error && !isSuccess && (
                <div 
                    className="erro"
                    onMouseEnter={() => lerTexto(`Mensagem de Erro: ${error}`)}
                    onFocus={() => lerTexto(`Mensagem de Erro: ${error}`)}
                    onMouseLeave={pararLeitura}
                    tabIndex={0}
                >
                    Erro! {error}
                </div>
            )}

            <form 
                onSubmit={handleSubmit(onSubmit)}
                aria-label="Formulário de Contato"
            >      
                <input className='input-field'
                    type="text" 
                    placeholder="Nome"
                    {...register("name", { required: "O nome é obrigatório" })}
                    onFocus={() => handleLeituraCampo("Nome", errors.name?.message)}
                    onMouseLeave={pararLeitura}
                />
                {errors.name && <span className="erro">{errors.name.message}</span>}

                <input className='input-field'
                    type="email" 
                    placeholder="E-mail"
                    {...register("email", {
                        required: "O e-mail é obrigatório",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Endereço de e-mail inválido"
                        }
                    })}
                    onFocus={() => handleLeituraCampo("E-mail", errors.email?.message)}
                    onMouseLeave={pararLeitura}
                />
                {errors.email && <span className="erro">{errors.email.message}</span>}

                <textarea className='input-field'
                    placeholder="Mensagem" 
                    rows={5} 
                    {...register("message", { required: "A mensagem é obrigatória" })}
                    onFocus={() => handleLeituraCampo("Mensagem", errors.message?.message)}
                    onMouseLeave={pararLeitura}
                ></textarea>
                {errors.message && <span className="erro">{errors.message.message}</span>}

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    onMouseEnter={() => lerTexto(isSubmitting ? 'Enviando mensagem' : 'Botão: Enviar mensagem')}
                    onFocus={() => lerTexto(isSubmitting ? 'Enviando mensagem' : 'Botão: Enviar mensagem')}
                    onMouseLeave={pararLeitura}
                >
                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
            </div>
        </main>
    );
};

export default Contato;