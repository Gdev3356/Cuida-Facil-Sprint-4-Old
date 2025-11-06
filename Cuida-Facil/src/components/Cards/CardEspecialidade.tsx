import { useEffect, useState } from 'react';
import Card from './Card';
import type { TipoEspecialidade } from '../../types/TipoEspecialidade';
import { especialidadesAPI } from '../../services/api';

export default function CardContainerEspecialidades() {
    const [especialidades, setEspecialidades] = useState<TipoEspecialidade[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        carregarEspecialidades();
    }, []);

    const carregarEspecialidades = async () => {
        try {
            setLoading(true);
            const data = await especialidadesAPI.findAll();
            setEspecialidades(data);
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Erro ao carregar especialidades');
        } finally {
            setLoading(false);
        }
    };

    // Gera classe CSS baseada no nome da especialidade
    const gerarCssClass = (nome: string) => {
        return `card-${nome
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/\s+/g, '-')}`; // Substitui espaços por hífens
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando especialidades...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="container">
                <p className="erro">⚠ {erro}</p>
            </div>
        );
    }

    if (especialidades.length === 0) {
        return (
            <div className="container">
                <p>Nenhuma especialidade encontrada.</p>
            </div>
        );
    }

    return (
        <main className="cards-especialidades-medicas">
            {especialidades.map((especialidade) => (
                <Card
                    key={especialidade.idEspecialidade}
                    id={especialidade.idEspecialidade}
                    titulo={especialidade.nome}
                    descricao={especialidade.descricao || undefined}
                    cssClass={gerarCssClass(especialidade.nome)}
                    imagemUrl={especialidade.urlImagem || undefined}
                />
            ))}
        </main>
    );
}