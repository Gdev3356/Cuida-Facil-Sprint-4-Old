import { useEffect, useState } from 'react';
import CardUnidade from './CardUnidade';
import type { TipoCardUnidade } from '../../types/CardTypes';
import type { TipoUnidade } from '../../types/TipoUnidade';
import { unidadesAPI } from '../../services/api';

// Mapeamento de imagens locais (fallback)
const IMAGENS_FALLBACK: Record<string, string> = {
    'hc-pinheiros': '/assets/img/hcpinheiros.png',
    'hc-central': '/assets/img/hccentral.png',
    'imrea-vila-mariana': '/assets/img/hcvilamariana.png',
};

export default function CardsUnidadesContainer() {
    const [cards, setCards] = useState<TipoCardUnidade[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        carregarUnidades();
    }, []);

    const carregarUnidades = async () => {
        try {
            setLoading(true);
            setErro(null);
            
            const unidades = await unidadesAPI.findAll();
            
            const cardsTransformados: TipoCardUnidade[] = unidades.map((unidade) => {
                const cssClass = gerarCssClass(unidade.cdUnidade || unidade.codigo || '');
                
                return {
                    id: unidade.idUnidade,
                    cssClass,
                    titulo: unidade.cdUnidade || unidade.codigo || `Unidade ${unidade.idUnidade}`,
                    endereco: unidade.endereco,
                    telefone: unidade.telefone || 'Não informado',
                    horario: unidade.horario || 'Consultar unidade',
                    servicos: extrairServicos(unidade),
                    // Adiciona URL da imagem se disponível
                    imagemUrl: obterUrlImagem(unidade, cssClass)
                };
            });
            
            setCards(cardsTransformados);
        } catch (error) {
            console.error('Erro ao carregar unidades:', error);
            setErro(error instanceof Error ? error.message : 'Erro ao carregar unidades');
        } finally {
            setLoading(false);
        }
    };

    const gerarCssClass = (codigo: string): string => {
        const codigoNormalizado = codigo
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-');
        
        return `card-${codigoNormalizado}`;
    };

    const obterUrlImagem = (unidade: TipoUnidade, cssClass: string): string | undefined => {
        // Prioridade 1: URL do banco de dados
        if (unidade.urlImagemUnidades || unidade.urlImagem) {
            return unidade.urlImagemUnidades || unidade.urlImagem || undefined;
        }
        
        // Prioridade 2: Imagem local baseada no código
        const codigoChave = cssClass.replace('card-', '');
        return IMAGENS_FALLBACK[codigoChave];
    };

    const extrairServicos = (unidade: TipoUnidade): string[] => {
        const servicos: string[] = [];
        
        // Lógica baseada no horário
        if (unidade.horario) {
            if (unidade.horario.includes('24h') || unidade.horario.includes('24')) {
                servicos.push('Emergência 24h');
            } else {
                servicos.push('Consultas Eletivas');
            }
        }
        
        // Sempre adiciona serviços básicos
        if (!servicos.includes('Emergência 24h')) {
            servicos.push('Consultas');
        }
        servicos.push('Exames');
        
        // Lógica baseada no nome da unidade
        const nome = (unidade.cdUnidade || unidade.codigo || '').toLowerCase();
        if (nome.includes('day clinic') || nome.includes('pinheiros')) {
            servicos.push('Day Clinic');
        }
        
        return servicos;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Carregando unidades...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="container">
                <p className="erro">Erro! {erro}</p>
                <button 
                    className="button-form-success" 
                    onClick={carregarUnidades}
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="container">
                <p>Nenhuma unidade cadastrada no momento.</p>
            </div>
        );
    }

    return (
        <div className="cards-especialidades-medicas">
            {cards.map((card) => (
                <CardUnidade key={card.id} card={card} />
            ))}
        </div>
    );
}