export type TipoCardBase = {
    id: number;
    titulo: string;
    cssClass: string;
}

export type TipoCardNavegacao = TipoCardBase & {
    descricao: string;
    rota: string;
}

export type TipoCardEspecialidade = TipoCardBase & {
    descricao: string;
}

export type TipoCardUnidade = TipoCardBase & {
    endereco: string;
    telefone: string;
    horario: string;
    servicos: string[];
}