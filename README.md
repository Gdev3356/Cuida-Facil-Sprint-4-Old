
---

# 🩺 CuidaFácil - Front-End (Sprint 4, CONTÉM O HISTÓRICO ORIGINAL PORÉM.CASO ESTEJA PROCURANDO A VERSÃO QUE LHE ENVIEI, ESTÁ NO LINK ABAIXO)


[Link dorepositório no GitHub (O CORRESPONDENTE DO ARQUIVO ENVIADO)](https://github.com/Gdev3356/Cuida-Facil-Sprint-4.git)

**CuidaFácil** é um Single Page Application (SPA) desenvolvido para o Hospital das Clínicas (HC FMUSP) com foco em **inclusão digital e acessibilidade (WCAG 2.1 AA)**. Nossa missão é simplificar a jornada do paciente, especialmente idosos e usuários com dificuldades tecnológicas, para o acesso aos serviços de saúde.

O sistema atua como o *front-end* acessível do agendamento, garantindo uma experiência intuitiva, centralizando informações e serviços essenciais, como:

* 🗓️ Agendamento de consultas em **3 etapas simples**.
* 🗣️ **Modo Acessibilidade** (Alto Contraste e Suporte de Voz).
* 🔒 **Autenticação** e área logada ("Minhas Consultas").
* 🏥 Localização das unidades e informações de contato.
* 📖 Tutorial interativo para novos usuários.

---

## 🚀 Tecnologias Utilizadas

* ⚛️ **React** (com **Vite** para build rápido)
* 📄 **TypeScript** (tipagem estática e segurança de código)
* 🎨 **Tailwind CSS** (estilização e responsividade)
* 🛣️ **React Router DOM** (navegação entre páginas)
* 🔄 **Context API** (Gerenciamento de estado global de Autenticação e Acessibilidade)
* 🗣️ **Web Speech API** (Para o modo de acessibilidade por voz)
* 🛜 **Axios** (Para consumo da API RESTful, configurado em `services/api.ts`)
* 📦 **Vercel** (Hospedagem e Deploy)

---

## 🗂️ Estrutura de Pastas (Sprint 4)

A estrutura foi organizada para suportar escalabilidade, separando componentes, páginas, contextos e serviços.

```
Cuida-Facil/
├── public/
├── src/
│   ├── components/       # Componentes React reutilizáveis
│   │   ├── Acessibilidade/ # Botões e lógicas do modo acessibilidade
│   │   ├── Breadcrumb/     # Breadcrumb, adapta baseado na página
│   │   ├── Cabecalho/
│   │   ├── Cards/
│   │   ├── Formulario/
│   │   ├── Login/
│   │   ├── Modal/
│   │   ├── PageHero/
│   │   ├── ProtectedRoute/ # Rota protegida por autenticação
│   │   ├── Notificacao/ # Contém NotificationContainer e NotificationToast, ambos componentes usados pelo sistema de notificação
│   │   └── ... (Rodape, UnidadesGrid, Voltar)
│   │
│   ├── context/            # Context API para estado global
│   │   ├── AcessibilityContext.tsx
│   │   └── AuthContext.tsx
│   │
│   ├── data/               # Dados Estáticos
│   │
│   ├── pages/              # Páginas principais da aplicação
│   │   ├── Home/
│   │   ├── Integrantes/      
│   │   ├── Login/
│   │   ├── MinhasConsultas/     # Página para agendamento, remarcar e cancelamento de consultas do paciente!
│   │   └── Unidades/      
│   │
│   ├── services/           # Configuração de API
│   │   ├── api.ts          # Responsável por funcionamento da API RESTful na aplicação
│   │   └── auth.ts         # Responsável pelo sistema de verificação local de login
│   ├── hooks/              # Contém o hook utilizado para chamar notificações de consultas
│   │   └── useConsultaNotification.ts      
│   │
│   ├── types/              # Tipagens TypeScript
│   │
│   ├── App.tsx            # Estrutura principal da aplicação
│   ├── globals.css        # Estilos globais (com Tailwind + customizações)
│   └── main.tsx           # Ponto de entrada da aplicação React
│
├── .env                     
├── index.html             # HTML principal
├── package-lock.json      # Garantia de instalação de dependências
├── package.json           # Dependências e scripts
├── package.app.json       # Configuração da Aplicação
├── tsconfig.json          # Configuração do TypeScript
├── tsconfignode.json      # Configuração do Node
└── vite.config.ts         # Configurações do Vite
```

---

---

## ✅ Funcionalidades (Destaques Sprint 4)

* **🔒 Sistema de Autenticação:** Fluxo de login completo com gerenciamento de estado via `AuthContext` e rotas protegidas (`ProtectedRoute`) para páginas como "Minhas Consultas".
* **👓 Modo Acessibilidade Global:** Gerenciamento de estado via `AcessibilityContext` para aplicar Alto Contraste e ativar/desativar a `Web Speech API` em toda a aplicação.
* **🗓️ Gestão de Consultas:** Página "Minhas Consultas" que consome dados da API para o usuário logado.
* **🧩 Componentização Robusta:** Interface construída com componentes reutilizáveis e de alta qualidade como `Modal`, `Breadcrumb`, `PageHero` e `Cards` customizados.
* **📞 Consumo de API:** Estrutura de `services` bem definida para conectar o front-end ao back-end (Java/Python) para buscar e enviar dados de forma organizada.

---

## ⚡ Como Executar Localmente

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Gdev3356/Cuida-Facil-Sprint-4.git
    cd Cuida-Facil-Sprint-4
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Execute em ambiente de desenvolvimento:**
    ```bash
    npm run dev
    ```
4.  **Acesse no navegador:**
    `http://localhost:5173`
---
## 👥 Integrante

* **Gustavo Keiji Okada** – RM563428
    [GitHub](https://github.com/Gdev3356) | [LinkedIn](https://www.linkedin.com/in/gustavo-okada-53a3b8359)

---

## 🔗 Repositório do Projeto

[👉 Acesse o repositório no GitHub (O ENVIADO)](https://github.com/Gdev3356/Cuida-Facil-Sprint-4.git)
[👉 OU acesse a página remota na Vercel(ATUALIZADO)](https://cuida-facil-sprint-4.vercel.app/)
---# Cuida-Facil-Sprint-4
