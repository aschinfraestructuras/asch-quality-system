# Sistema de Gestão de Qualidade ASCH

Um sistema completo de gestão documental e controlo de qualidade para obras civis, inspirado nas melhores funcionalidades do Procore, Fieldwire e Softexpert, mas adaptado ao contexto português e com recursos inovadores.

## Visão Geral

O SGQ ASCH é uma aplicação web desenvolvida com React e TypeScript para o frontend e Node.js para o backend. O sistema permite a gestão completa de documentos, checklists, ensaios laboratoriais, não conformidades e relatórios de qualidade para obras de construção civil.

### Estado Atual do Desenvolvimento

- ✅ Configuração básica do projeto
- ✅ Layout principal da aplicação
- ✅ Dashboard principal com estatísticas
- ✅ Módulo de Checklists completo
- ✅ Módulo de Ensaios completo (mais recente)
- ⏳ Gestão de Não Conformidades (a desenvolver)
- ⏳ Sistema de Relatórios (a desenvolver)

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
│       ├── pages/          # Páginas principais
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

## Módulo de Ensaios

O módulo de Ensaios, recentemente implementado, oferece uma solução completa para gestão de ensaios laboratoriais e de campo em obras civis. A estrutura específica do módulo é a seguinte:

```
client/src/
├── components/           # Componentes reutilizáveis
│   ├── EnsaioRoutes.tsx      # Roteamento para o módulo de ensaios
│   ├── EnsaiosDashboard.tsx  # Dashboard com estatísticas de ensaios
│   ├── EnsaiosAnalysis.tsx   # Análise avançada com correlações e tendências
│   ├── EnsaiosReports.tsx    # Geração de relatórios personalizáveis
│   ├── EnsaiosWorkflow.tsx   # Gestão de fluxo de trabalho de ensaios
│   └── LabIntegration.tsx    # Integração com equipamentos laboratoriais
│
├── pages/                # Páginas principais
│   ├── Ensaios.tsx           # Componente principal do módulo (container)
│   ├── EnsaiosList.tsx       # Listagem de ensaios com filtros
│   ├── NewEnsaio.tsx         # Criação e edição de ensaios
│   └── ViewEnsaio.tsx        # Visualização detalhada de um ensaio
│
└── styles/               # Arquivos CSS
    ├── EnsaiosModule.css     # Estilos para o componente principal
    ├── Ensaios.css           # Estilos para a listagem 
    ├── NewEnsaio.css         # Estilos para criação/edição
    ├── ViewEnsaio.css        # Estilos para visualização detalhada
    ├── EnsaiosDashboard.css  # Estilos para dashboard
    ├── EnsaiosAnalysis.css   # Estilos para análise avançada
    ├── EnsaiosReports.css    # Estilos para relatórios
    ├── EnsaiosWorkflow.css   # Estilos para fluxo de trabalho
    └── LabIntegration.css    # Estilos para integração laboratorial
```

### Funcionalidades do Módulo de Ensaios

1. **Gestão Básica de Ensaios**
   - Listagem com filtros avançados
   - Criação com fluxo em etapas
   - Visualização detalhada com resultados
   - Controle de conformidade

2. **Dashboard Analítico**
   - Estatísticas gerais de ensaios
   - Distribuição por projeto e tipo
   - Taxa de conformidade
   - Tendências mensais

3. **Análise Avançada**
   - Correlações entre parâmetros
   - Análise de tendências
   - Estatísticas detalhadas
   - Interpretação automática de resultados

4. **Relatórios Personalizáveis**
   - Vários modelos de relatórios
   - Filtros avançados
   - Exportação em múltiplos formatos
   - Visualização prévia

5. **Fluxo de Trabalho**
   - Modelos de fluxos por tipo de ensaio
   - Acompanhamento de progresso
   - Timeline com histórico
   - Gestão de prazos e responsáveis

6. **Integração Laboratorial**
   - Conexão com equipamentos
   - Importação automática de dados
   - Gestão de calibrações
   - Controle de acessos

## Próximos Passos no Desenvolvimento

Para continuar o desenvolvimento do sistema, as seguintes áreas devem ser priorizadas:

1. **Implementação do Módulo de Não Conformidades**
   - Criação de interfaces para registo e gestão
   - Sistema de classificação e tratamento
   - Fluxo de trabalho para ações corretivas

2. **Desenvolvimento do Sistema de Relatórios**
   - Criar templates personalizáveis
   - Integrar dados de todos os módulos
   - Implementar exportação em diversos formatos

3. **Integração com APIs Externas**
   - Sistemas de gestão de projetos
   - Fornecedores externos de ensaios
   - Entidades reguladoras

4. **Implementação do Backend**
   - Criar modelos de dados para todos os módulos
   - Desenvolver APIs RESTful
   - Implementar autenticação e autorização

## Convenções de Código

Este projeto segue as seguintes convenções:

- **Nomenclatura**: 
  - Componentes React: PascalCase
  - Funções e variáveis: camelCase
  - Constantes: UPPERCASE_SNAKE_CASE
  
- **Estilo**:
  - CSS modular por componente
  - Utilização de classes utilitárias definidas em index.css
  
- **Organização**:
  - Componentes reutilizáveis em `/components`
  - Páginas principais em `/pages`
  - Estilos específicos em `/styles`

## Código de Continuidade para Novas Sessões

Para continuar o desenvolvimento em novas sessões, utilize o seguinte código de continuidade:

```
PROJETO: Sistema de Gestão de Qualidade ASCH
ID de Continuação: ASCH-SGQ-001
Versão Atual: 0.3.0
Última Sessão: 16/04/2025
Estado: Em desenvolvimento - Módulos de Checklists e Ensaios implementados
```

## Contribuição

Para contribuir com o projeto:

1. Crie um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Contacto

Para questões ou sugestões relacionadas ao projeto:
- Email: suporte@asch.pt
- Website: https://sgq.asch.pt