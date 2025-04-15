# Sistema de Gestão de Qualidade ASCH

Sistema completo de gestão documental e controlo de qualidade para todas as obras da empresa ASCH, inspirado nas melhores funcionalidades do Procore, Fieldwire e Softexpert.

## Progresso Atual

- ✅ Configuração básica do projeto (React + TypeScript para frontend, Node.js para backend)
- ✅ Layout principal da aplicação
- ✅ Dashboard principal com estatísticas e painéis informativos
- ✅ Módulo de Checklists (implementado com as seguintes funcionalidades):
  - ✅ Lista de checklists com filtros
  - ✅ Formulário de criação de checklist com fluxo em 4 etapas
  - ✅ Visualização detalhada de checklist
- ⏳ Módulo de Ensaios (em desenvolvimento)
- ⏳ Gestão de Não Conformidades (em desenvolvimento)
- ⏳ Sistema de Relatórios (em desenvolvimento)

## Módulo de Checklists

O módulo de Checklists foi implementado com as seguintes funcionalidades:

### Lista de Checklists
- Visualização de todos os checklists em formato de tabela
- Filtros por tipo, status e projeto
- Barra de pesquisa para localização rápida
- Indicadores visuais de progresso e status

### Criação de Checklist
- Fluxo em 4 etapas: selecionar template, informações básicas, personalizar itens, revisar e finalizar
- Seleção a partir de templates predefinidos
- Personalização de itens e grupos de verificação
- Opção para definir itens obrigatórios

### Visualização de Checklist
- Informações detalhadas do checklist
- Status de cada item (conforme, não conforme, não aplicável, a verificar)
- Comentários e evidências
- Histórico de atividades
- Sistema de aprovação

## Arquitetura do Sistema

O sistema segue uma arquitetura modular, permitindo o desenvolvimento incremental e a adição de novos módulos sem interferir no funcionamento dos existentes.

### Frontend
- React com TypeScript
- Estilos CSS modulares
- Interface responsiva para acesso via desktop e dispositivos móveis

### Backend
- Node.js com Express
- MongoDB para documentos e dados não estruturados
- PostgreSQL para dados relacionais estruturados

### Implantação
- GitHub para controle de versão
- Netlify para hospedagem do frontend
- Render para hospedagem do backend

## Próximos Passos

1. Desenvolver o backend para o Módulo de Checklists
   - Criar APIs para listar, criar, editar e excluir checklists
   - Implementar sistema de autenticação e autorização
   - Adicionar validação de dados

2. Implementar o Módulo de Ensaios
   - Criar interface para cadastro e visualização de ensaios
   - Desenvolver sistema de resultados e conformidade
   - Integrar com laboratórios externos

3. Implementar a Gestão de Não Conformidades
   - Criar interface para registro de não conformidades
   - Desenvolver sistema de classificação e tratamento
   - Implementar workflow de ações corretivas

## Considerações para Continuidade do Desenvolvimento

Para continuar o desenvolvimento em novas sessões:

1. Clone o repositório do GitHub
2. Instale as dependências usando `npm install` nas pastas client e server
3. Inicie o frontend com `npm run dev` na pasta client
4. Inicie o backend com `npm run dev` na pasta server

Cada novo módulo deve seguir a arquitetura modular estabelecida, com:
- Componentes React para a interface
- Estilos CSS específicos para o módulo
- Rotas de API dedicadas
- Modelos de dados apropriados

Para garantir a coerência visual e funcional, siga as diretrizes de design já implementadas nos componentes existentes e use as classes CSS utilitárias definidas no arquivo index.css.

## Código de Continuidade

```
PROJETO: Sistema de Gestão de Qualidade ASCH
ID de Continuação: ASCH-SGQ-001
Versão Atual: 0.2.0
Última Sessão: 15/04/2025
Estado: Em desenvolvimento - Módulo de Checklists implementado
```

Este código deve ser incluído no início de cada nova sessão para garantir a continuidade adequada do desenvolvimento.