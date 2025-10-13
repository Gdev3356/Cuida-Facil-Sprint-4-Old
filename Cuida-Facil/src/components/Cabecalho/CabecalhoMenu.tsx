import { Link } from 'react-router-dom';

export default function CabecalhoMenu() {

    return (
        <header>
            <nav>
                <Link to="/">Início</Link>
                <Link to="/ajuda">Ajuda</Link>
                <Link to="/faq">FAQ</Link>
                <Link to="/contato">Contato</Link>
                <Link to="/integrantes">Integrantes</Link>
            </nav>
        </header>
    );
}