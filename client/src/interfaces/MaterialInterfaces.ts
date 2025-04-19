// Tipos auxiliares reutilizáveis
export type StatusGeral = 'pendente' | 'aprovado' | 'rejeitado' | 'concluído';
export type StatusCertificacao = 'válido' | 'expirado' | 'pendente';
export type StatusLote = 'disponível' | 'parcialmente utilizado' | 'esgotado';
export type StatusNC = 'aberta' | 'em análise' | 'resolvida' | 'fechada';
export type SeveridadeNC = 'baixa' | 'média' | 'alta' | 'crítica';
export type ResultadoEnsaio = 'conforme' | 'não conforme' | 'pendente';
export type Prioridade = 'baixa' | 'normal' | 'alta' | 'urgente';
export type TipoMovimentacao = 'entrada' | 'saída' | 'transferência' | 'ajuste';
export type Ordem = 'asc' | 'desc';
export type OrdenarPor =
  | 'nome'
  | 'codigo'
  | 'categoria'
  | 'preco'
  | 'stock';

// Interface base
export interface EntidadeBase {
  id: number;
}

// Dados principais do material
export interface Material extends EntidadeBase {
  codigo: string;
  nome: string;
  descricao: string;
  categoria: string;
  subcategoria?: string;
  unidade: string;
  preco_unitario: number;
  foto_url?: string;
  data_criacao: string;
  ultima_atualizacao: string;
}

// Detalhes técnicos e rastreabilidade
export interface MaterialDetalhes extends Material {
  especificacoes_tecnicas: string;
  dimensoes?: string;
  peso?: number;
  fabricante?: string;
  modelo?: string;
  normas_aplicaveis: string[];
  observacoes?: string;
}

// Stock disponível em obra
export interface MaterialStock extends EntidadeBase {
  material_id: number;
  obra_id: number;
  obra_nome: string;
  quantidade_disponivel: number;
  quantidade_reservada: number;
  quantidade_minima: number;
  localizacao: string;
  data_atualizacao: string;
}

// Dados de fornecedor
export interface MaterialFornecedor {
  fornecedor_id: number;
  fornecedor_nome: string;
  material_id: number;
  material_nome: string;
  codigo_referencia_fornecedor?: string;
  preco: number;
  prazo_entrega: number;
  ultima_compra?: string;
  avaliacao: number;
  is_preferencial: boolean;
}

// Certificações técnicas
export interface MaterialCertificacao extends EntidadeBase {
  material_id: number;
  material_nome: string;
  nome_certificacao: string;
  entidade_certificadora: string;
  numero_certificacao: string;
  data_emissao: string;
  data_validade?: string;
  documento_url?: string;
  observacoes?: string;
  status: StatusCertificacao;
}

// Rastreabilidade de lotes
export interface MaterialLote extends EntidadeBase {
  material_id: number;
  material_nome: string;
  numero_lote: string;
  fornecedor_id: number;
  fornecedor_nome: string;
  data_recepcao: string;
  quantidade: number;
  guia_remessa: string;
  observacoes?: string;
  status: StatusLote;
}

// Histórico de utilizações
export interface MaterialUtilizacao extends EntidadeBase {
  material_id: number;
  material_nome: string;
  projeto_id: number;
  projeto_nome: string;
  obra_id: number;
  obra_nome: string;
  quantidade: number;
  data_utilizacao: string;
  lote_id?: number;
  lote_numero?: string;
  autorizado_por: string;
  observacoes?: string;
}

// Ensaios laboratoriais
export interface MaterialEnsaio extends EntidadeBase {
  material_id: number;
  material_nome: string;
  ensaio_id: number;
  ensaio_tipo: string;
  lote_id?: number;
  lote_numero?: string;
  data_ensaio: string;
  resultado: ResultadoEnsaio;
  laboratorio: string;
  observacoes?: string;
  relatorio_url?: string;
}

// Não conformidades associadas
export interface MaterialNaoConformidade extends EntidadeBase {
  material_id: number;
  material_nome: string;
  lote_id?: number;
  lote_numero?: string;
  fornecedor_id: number;
  fornecedor_nome: string;
  data_detecao: string;
  descricao: string;
  severidade: SeveridadeNC;
  status: StatusNC;
  acao_corretiva?: string;
  responsavel: string;
  data_resolucao?: string;
}

// Requisições
export interface MaterialRequisicao extends EntidadeBase {
  data_requisicao: string;
  requisitante: string;
  obra_id: number;
  obra_nome: string;
  projeto_id?: number;
  projeto_nome?: string;
  status: StatusGeral | 'parcialmente aprovada';
  aprovador?: string;
  data_aprovacao?: string;
  observacoes?: string;
  itens: MaterialRequisicaoItem[];
}

export interface MaterialRequisicaoItem extends EntidadeBase {
  requisicao_id: number;
  material_id: number;
  material_nome: string;
  quantidade_solicitada: number;
  quantidade_aprovada?: number;
  prioridade: Prioridade;
  justificativa?: string;
  status: StatusGeral | 'parcialmente aprovado' | 'entregue';
}

// Estatísticas do dashboard
export interface MaterialDashboardStats {
  total_materiais: number;
  materiais_por_categoria: { categoria: string; quantidade: number }[];
  valor_total_inventario: number;
  itens_abaixo_estoque_minimo: number;
  requisicoes_pendentes: number;
  certificacoes_a_expirar: number;
  nao_conformidades_abertas: number;
  ultimas_movimentacoes: MaterialMovimentacao[];
}

// Histórico de movimentações
export interface MaterialMovimentacao extends EntidadeBase {
  data: string;
  tipo: TipoMovimentacao;
  material_id: number;
  material_nome: string;
  quantidade: number;
  origem?: string;
  destino?: string;
  responsavel: string;
  observacoes?: string;
}

// Filtros de pesquisa
export interface MaterialFiltros {
  termo_pesquisa?: string;
  categorias?: string[];
  fornecedores?: number[];
  obras?: number[];
  com_stock_minimo?: boolean;
  com_certificacao_valida?: boolean;
  com_nao_conformidades?: boolean;
  ordenar_por?: OrdenarPor;
  ordem?: Ordem;
  pagina: number;
  itens_por_pagina: number;
}
