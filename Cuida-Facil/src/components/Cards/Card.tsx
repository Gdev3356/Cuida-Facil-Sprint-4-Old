import { useNavigate } from 'react-router-dom';
import type { CSSProperties } from 'react';

// Tipo base unificado
type CardProps = {
    id: number;
    titulo: string;
    cssClass: string;
    
    // Props opcionais dependendo do tipo de card
    descricao?: string;
    rota?: string;
    endereco?: string;
    telefone?: string;
    horario?: string;
    servicos?: string[];
    imagemUrl?: string;
    
    // Controle de comportamento
    clickable?: boolean;
    onClick?: () => void;
}

export default function Card(props: CardProps) {
    const navigate = useNavigate();
    
    const handleClick = () => {
        if (props.rota) {
            navigate(props.rota);
        } else if (props.onClick) {
            props.onClick();
        }
    };
    
    // Estilo inline para imagem de fundo (APENAS se imagemUrl for passada explicitamente)
    const cardStyle: CSSProperties = props.imagemUrl 
        ? {
            backgroundImage: `url(${props.imagemUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }
        : {};
    
    const isClickable = props.clickable || !!props.rota;
    
    // Determina se é card de unidade (tem endereço)
    const isCardUnidade = !!props.endereco;
    const cardClasses = isCardUnidade 
        ? `card card-especialidades-medicas ${props.cssClass}`
        : `card ${props.cssClass}`;
    
    return (
        <div 
            className={cardClasses}
            onClick={isClickable ? handleClick : undefined}
            style={{ 
                ...cardStyle,
                cursor: isClickable ? 'pointer' : 'default' 
            }}
        >
            <div className="card-link">
                <h2>{props.titulo}</h2>
                
                {/* Card de Navegação/Especialidade - apenas descrição */}
                {props.descricao && !props.endereco && (
                    <p>{props.descricao}</p>
                )}
                
                {/* Card de Unidade - informações completas */}
                {props.endereco && (
                    <div className="card-body">
                        <p>
                            <strong>Endereço:</strong> {props.endereco}
                        </p>
                        {props.telefone && (
                            <p>
                                <strong>Telefone:</strong> {props.telefone}
                            </p>
                        )}
                        {props.horario && (
                            <p>
                                <strong>Horário:</strong> {props.horario}
                            </p>
                        )}
                        
                        {props.servicos && props.servicos.length > 0 && (
                            <div className="card-text">
                                <strong>Serviços:</strong>
                                <ul>
                                    {props.servicos.map((servico, index) => (
                                        <li key={index}>{servico}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helpers para facilitar o uso
export const CardNavegacao = (props: Pick<CardProps, 'id' | 'titulo' | 'descricao' | 'rota' | 'cssClass'>) => (
    <Card {...props} clickable />
);

export const CardEspecialidade = (props: Pick<CardProps, 'id' | 'titulo' | 'descricao' | 'cssClass'>) => (
    <Card {...props} />
);

export const CardUnidade = (props: Pick<CardProps, 'id' | 'titulo' | 'cssClass' | 'endereco' | 'telefone' | 'horario' | 'servicos' | 'imagemUrl'>) => (
    <Card {...props} />
);