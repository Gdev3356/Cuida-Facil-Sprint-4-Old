import { Link } from 'react-router-dom';

export default function Rodape() {
    return (
        <footer className="footer">
            <div className="footer-links">
                <Link to="/ajuda" className="footer-link">Ajuda</Link>
                <Link to="/faq" className="footer-link">FAQ</Link>
                <Link to="/integrantes" className="footer-link">Integrantes</Link>
                <Link to="/contato" className="footer-link">Contato</Link>
                <div className='footer-small'>
                 <p className="footer-copyright">
                    &copy; 2025 CuidaFácil | Feito com empatia para você.
                </p>
                </div>
            </div>
        </footer>
    );
}