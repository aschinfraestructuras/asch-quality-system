# Sistema de Gestão de Qualidade ASCH

Um sistema completo de gestão documental e controlo de qualidade para obras civis, inspirado nas melhores funcionalidades do Procore, Fieldwire e Softexpert, mas adaptado ao contexto português e com recursos inovadores.

## Visão Geral

O SGQ ASCH é uma aplicação web desenvolvida com React e TypeScript para o frontend e Node.js para o backend. O sistema permite a gestão completa de documentos, checklists, ensaios laboratoriais, não conformidades e relatórios de qualidade para obras de construção civil.

### Estado Atual do Desenvolvimento

- ✅ Configuração básica do projeto
- ✅ Layout principal da aplicação
- ✅ Dashboard principal com estatísticas
- ✅ Módulo de Checklists completo
- ✅ Módulo de Ensaios completo
- ✅ Módulo de Não Conformidades completo
- ✅ Módulo de Relatórios completo
- ⏳ Gestão de Fornecedores (a desenvolver)
- ⏳ Gestão de Materiais (a desenvolver)
- ⏳ Integração completa Dashboard (a refinar)

## Requisitos de Sistema

- Node.js (versão 16.x ou superior)
- npm (versão 8.x ou superior)
- MongoDB (para documentos e dados não estruturados)
- PostgreSQL (para dados relacionais estruturados)

## Configuração do Ambiente de Desenvolvimento

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/sgq-asch.git
cd sgq-asch
```

### 2. Instalar Dependências

```bash
# Instalar dependências do cliente (frontend)
cd client
npm install

# Instalar dependências do servidor (backend)
cd ../server
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `server` com as seguintes variáveis:

```
# Configuração do Servidor
PORT=4000
NODE_ENV=development

# Configuração do MongoDB
MONGO_URI=mongodb://localhost:27017/sgq-asch

# Configuração do PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_USER=seu_usuario
PG_PASSWORD=sua_senha
PG_DATABASE=sgq_asch

# JWT Secret
JWT_SECRET=seu_jwt_secret_seguro
```

Crie também um arquivo `.env` na pasta `client`:

```
REACT_APP_API_URL=http://localhost:4000/api
```

### 4. Iniciar o Servidor de Desenvolvimento

```bash
# Iniciar o frontend (cliente)
cd client
npm run dev

# Em outro terminal, iniciar o backend (servidor)
cd server
npm run dev
```

A aplicação frontend estará disponível em `http://localhost:3000` e a API backend em `http://localhost:4000`.

## Estrutura do Projeto

```
sgq-asch/
├── client/                 # Frontend (React)
│   ├── public/             # Arquivos estáticos
│   └── src/                # Código fonte
│       ├── assets/         # Imagens e outros recursos
│       ├── components/     # Componentes reutilizáveis
│       │   ├── EnsaioRoutes.tsx        # Roteamento para ensaios
│       │   └── NaoConformidadesRoutes.tsx # Roteamento para não conformidades
│       ├── pages/          # Páginas principais
│       │   ├── Dashboard.tsx           # Dashboard principal
│       │   ├── Checklists.tsx          # Gestão de checklists
│       │   ├── Ensaios.tsx             # Gestão de ensaios
│       │   ├── NaoConformidades.tsx    # Gestão de não conformidades
│       │   └── Relatorios.tsx          # Geração de relatórios
│       ├── styles/         # Arquivos CSS
│       ├── utils/          # Utilitários e helpers
│       ├── App.tsx         # Componente principal
│       └── index.tsx       # Ponto de entrada
├── server/                 # Backend (Node.js)
│   ├── src/
│       ├── config/         # Configurações
│       ├── controllers/    # Controladores
│       ├── middleware/     # Middleware
│       ├── models/         # Modelos de dados
│       ├── routes/         # Rotas da API
│       ├── services/       # Serviços
│       └── index.js        # Ponto de entrada
└── README.md               # Este arquivo
```

## Módulos Implementados

### 1. Módulo de Checklists
- Criação e gestão de checklists de inspeção
- Atribuição a projetos e responsáveis
- Verificação de itens com suporte a evidências
- Histórico de alterações

### 2. Módulo de Ensaios
- Gestão de ensaios laboratoriais e de campo
- Dashboard analítico com estatísticas
- Relatórios personalizáveis
- Integração com equipamentos laboratoriais

### 3. Módulo de Não Conformidades
- Registo detalhado de não conformidades
- Sistema de classificação por gravidade
- Gestão de ações corretivas
- Timeline de eventos
- Anexos e evidências documentais

### 4. Módulo de Relatórios
- Diferentes tipos de relatórios predefinidos
- Relatórios personalizáveis com filtros avançados
- Múltiplos formatos de exportação (PDF, Excel, Word, CSV)
- Visualização prévia

## Próximos Passos no Desenvolvimento

Para continuar