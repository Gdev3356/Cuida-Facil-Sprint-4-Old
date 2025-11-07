import { useForm, type SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import Logo from '../../components/Logo/Logo';
import CabecalhoMenu from '../../components/Cabecalho/CabecalhoMenu';

type FormInputs = {
    name: string;
    email: string;
    message: string;
};

const Contato = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setIsSubmitting(true);
        setIsSuccess(false);
        setError(null);

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
                reset();
                setTimeout(() => setIsSuccess(false), 5000); 
            } else {
                const result = await response.json();
                setError(result.message || "Erro ao enviar o formulário. Verifique seu e-mail de ativação.");
            }

        } catch (err) {
            setError("Erro de conexão. Tente novamente mais tarde.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main>
            <Logo/>
            <CabecalhoMenu/>
            <div className='auth-container'>
            <h1>Fale Conosco</h1>
            {isSuccess && <p className="sucesso" style={{ color: 'green', fontWeight: 'bold' }}> Mensagem enviada com sucesso!</p>}
            {error && <p className="erro-envio" style={{ color: 'red', fontWeight: 'bold' }}> {error}</p>}

            <form 
                onSubmit={handleSubmit(onSubmit)}
            >      
                <input className='input-field'
                    type="text" 
                    placeholder="Nome"
                    {...register("name", { required: "O nome é obrigatório" })}
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
                />
                {errors.email && <span className="erro">{errors.email.message}</span>}

                <textarea className='input-field'
                    placeholder="Mensagem" 
                    rows={5} 
                    {...register("message", { required: "A mensagem é obrigatória" })}
                ></textarea>
                {errors.message && <span className="erro">{errors.message.message}</span>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
            </div>
        </main>
    );
};

export default Contato;