import { Link } from 'react-router-dom';
import { useAccessibility } from '../../context/AcessibilityContext';

export default function Cabecalho() {
  const { lerTexto, pararLeitura } = useAccessibility();

  const handleLeituraLink = () => {
    lerTexto("Link: Voltar para a página inicial");
  };

  return (
    <header className="voltar">
        <Link 
          to="/" 
          className="footer-link"
          onMouseEnter={handleLeituraLink}
          onFocus={handleLeituraLink}
          onMouseLeave={pararLeitura}
        >
          Voltar
        </Link>
    </header>
  );
}