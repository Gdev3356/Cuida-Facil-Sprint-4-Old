import type { TipoFaqItem } from '../types/Faq';
 
export const faqData: TipoFaqItem[] = [
    {
        pergunta: "Como criar minha conta no Portal?",
        resposta: "<strong>R:</strong> Na tela inicial, use o botão CADASTRAR SENHA. Na próxima tela digite o CPF e clique em LOCALIZAR PACIENTE. O Portal irá buscar seu registro e solicitar a confirmação de alguns dados. Após confirmar, preencha seus dados de contato e crie sua senha. -Tópicos 2 e 3 do Manual**"
    },
    {
        pergunta: "Como acessar o Portal do Paciente?",
        resposta: "<strong>R:</strong> Basta informar seu CPF e senha usados ao criar sua conta no Portal. -Tópico 4 do Manual**"
    },
    {
        pergunta: "Quem pode fazer o cadastro?",
        resposta: "<strong>R:</strong> Qualquer pessoa que tenha realizado exames, consultas ou outro tipo de atendimento no complexo HC pode criar uma conta."
    },
    {
        pergunta: "Não consigo concluir meu cadastro, o que faço?",
        resposta: "<strong>R:</strong> A criação de um cadastro no portal do paciente compara os dados informados no portal com os dados registrados na base de dados do HC. Caso tenha atualizado alguma informação dos seus dados após sua última passagem pelo hospital, é provável que este seja o motivo de sua dificuldade em finalizar o cadastro. Neste caso, você deve regularizar seu cadastro comparecendo no Serviço de Registro ou Matrícula no Instituto em que realizou a consulta ou exame, com seu documento de identificação (RG ou CNH) e comprovante de endereço atualizado."
    },
    {
        pergunta: "Os dados do meu cadastro estão desatualizados, como faço?",
        resposta: "<strong>R:</strong> Você pode atualizar seus dados de contato, tais como email e telefone diretamente através do portal na opção Meus Dados. Outras informações devem ser atualizadas comparecendo no Serviço de Registro ou Matrícula no Instituto em que realizou a consulta ou exame, com seu documento de identificação (RG ou CNH) e comprovante de endereço atualizado."
    },
    {
        pergunta: "Posso compartilhar minha senha com outras pessoas?",
        resposta: "<strong>R:</strong> Não é indicado o compartilhamento da sua senha com outras pessoas. Elas terão acesso aos seus resultados de exames e outras informações disponíveis no portal que podem ser confidenciais."
    },
    {
        pergunta: "Fiz exames e eles não aparecem, o que devo fazer?",
        resposta: "<strong>R:</strong> É possível que você tenha mais de um cadastro ativo no Hospital das Clínicas. Para unificar os registros você deve entrar em contato com a área de matrícula (DAM) do seu instituto de origem ou no local onde fez o último exame."
    },
    {
        pergunta: "Tendo problemas com o Portal do Paciente HC?",
        resposta: "<strong>R:</strong> Envie um email com a descrição do problema, nome completo, RGHC, CPF e último instituto em que foi atendido(a) para o email suporte.appportal@hc.fm.usp.br. Se possível, por favor, envie capturas de tela do problema também."
    },
];