import { useEffect, useState } from 'react';
import Card from './Card';
import type { TipoUnidade } from '../../types/TipoUnidade';
import { unidadesAPI } from '../../services/api';

const IMAGENS_FALLBACK: Record<string, string> = {
    'hc-pinheiros': '/assets/img/hcpinheiros.png',
    'ichc-central': '/assets/img/hccentral.png',
    'imrea-vila-mariana': '/assets/img/hcvilamariana.png',
};

export default function CardContainerUnidades() {
    const [unidades, setUnidades] = useState<TipoUnidade[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        carregarUnidades();
    }, []);

    const carregarUnidades = async () => {
        try {
            setLoading(true);
            const data = await unidadesAPI.findAll();
            setUnidades(data);
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Erro ao carregar');
        } finally {
            setLoading(false);
        }
    };

    const gerarCssClass = (codigo: string) => 
        `card-${codigo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`;

    const obterImagem = (unidade: TipoUnidade, cssClass: string) => 
        unidade.urlImagemUnidades || unidade.urlImagem || IMAGENS_FALLBACK[cssClass.replace('card-', '')];

    const extrairServicos = (unidade: TipoUnidade) => {
        const servicos = [];
        if (unidade.horario?.includes('24h')) servicos.push('Emergência 24h');
        else servicos.push('Consultas Eletivas');
        if (!servicos.includes('Emergência 24h')) servicos.push('Consultas');
        servicos.push('Exames');
        if (unidade.cdUnidade?.toLowerCase().includes('pinheiros')) servicos.push('Day Clinic');
        return servicos;
    };

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div><p>Carregando...</p></div>;
    if (erro) return <div className="container"><p className="erro">❌ {erro}</p></div>;
    if (unidades.length === 0) return <div className="container"><p>Nenhuma unidade encontrada.</p></div>;

    return (
        <div className="cards-especialidades-medicas">
            {unidades.map((unidade) => {
                const cssClass = gerarCssClass(unidade.cdUnidade);
                return (
                    <Card
                        key={unidade.idUnidade}
                        id={unidade.idUnidade}
                        titulo={unidade.cdUnidade}
                        cssClass={cssClass}
                        endereco={unidade.endereco}
                        telefone={unidade.telefone || 'Não informado'}
                        horario={unidade.horario || 'Consultar unidade'}
                        servicos={extrairServicos(unidade)}
                        imagemUrl={obterImagem(unidade, cssClass)}
                    />
                );
            })}
        </div>
    );
}