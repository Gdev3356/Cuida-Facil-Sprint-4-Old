import { Link } from 'react-router-dom';
import { useAccessibility } from '../../context/AcessibilityContext';

export default function Rodape() {
    const { lerTexto, leitorAtivo, pararLeitura } = useAccessibility();

    const handleLeitura = (texto: string) => {
      if (leitorAtivo) {
        lerTexto(texto);
      }
    };

    return (
        <footer className="footer">
            <div className="footer-links">
                <Link 
                    to="/ajuda" 
                    className="footer-link"
                    onMouseEnter={() => handleLeitura("Ajuda")}
                    onFocus={() => handleLeitura("Ajuda")}
                    onMouseLeave={pararLeitura}
                >
                    Ajuda
                </Link>
                <Link 
                    to="/faq" 
                    className="footer-link"
                    onMouseEnter={() => handleLeitura("FAQ")}
                    onFocus={() => handleLeitura("FAQ")}
                    onMouseLeave={pararLeitura}
                >
                    FAQ
                </Link>
                <Link 
                    to="/integrantes" 
                    className="footer-link"
                    onMouseEnter={() => handleLeitura("Integrantes")}
                    onFocus={() => handleLeitura("Integrantes")}
                    onMouseLeave={pararLeitura}
                >
                    Integrantes
                </Link>
                <Link 
                    to="/contato" 
                    className="footer-link"
                    onMouseEnter={() => handleLeitura("Contato")}
                    onFocus={() => handleLeitura("Contato")}
                    onMouseLeave={pararLeitura}
                >
                    Contato
                </Link>
                
                <div className='footer-small'>
                 <p 
                    className="footer-copyright"
                    onMouseEnter={() => handleLeitura("© 2025 CuidaFácil | Feito com empatia para você.")}
                    onFocus={() => handleLeitura("© 2025 CuidaFácil | Feito com empatia para você.")}
                    onMouseLeave={pararLeitura}
                    tabIndex={0}
                 >
                    &copy; 2025 CuidaFácil | Feito com empatia para você.
                </p>
                </div>
            </div>
        </footer>
    );
}