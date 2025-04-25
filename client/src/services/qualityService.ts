// Serviço Completo de Gestão da Qualidade com Segurança Avançada

import { createClient, SupabaseClient, User } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

// Tipos Avançados
interface MetadadosUpload {
  id?: string
  nome: string
  url: string
  tipo: string
  tamanho: number
  data_upload?: Date
}

interface OpcoesFiltro {
  ordem?: string
  limite?: number
  filtros?: Record<string, any>
}

interface UtilizadorPerfil {
  id: string
  nome: string
  email: string
  role: 'admin_sistema' | 'gestor_qualidade' | 'tecnico_campo' | 'consulta' | 'fornecedor' | 'auditor_externo'
  obra_padrao?: string
  departamento?: string
  status: 'ativo' | 'inativo' | 'suspenso'
}

class SistemaQualidadeService {
  private supabase: SupabaseClient
  private usuarioAtual: User | null = null
  private perfilUtilizador: UtilizadorPerfil | null = null

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL, 
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )

    // Configurar listener de autenticação
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        await this.carregarPerfilUtilizador()
      } else if (event === 'SIGNED_OUT') {
        this.limparSessao()
      }
    })
  }

  // Verificação de Sessão e Permissões
  async verificarSessao(permissoesNecessarias: string[] = []) {
    const { data: { user }, error } = await this.supabase.auth.getUser()

    if (error || !user) {
      throw new Error('Usuário não autenticado')
    }

    this.usuarioAtual = user

    // Carregar perfil do utilizador
    await this.carregarPerfilUtilizador()

    // Verificar permissões
    if (permissoesNecessarias.length > 0) {
      this.verificarPermissoes(permissoesNecessarias)
    }

    return this.usuarioAtual
  }

  // Carregar Perfil Detalhado do Utilizador
  private async carregarPerfilUtilizador() {
    if (!this.usuarioAtual) return null

    const { data, error } = await this.supabase
      .from('perfis_utilizadores')
      .select('*')
      .eq('id', this.usuarioAtual.id)
      .single()

    if (error) {
      console.error('Erro ao carregar perfil:', error)
      throw new Error('Perfil de utilizador não encontrado')
    }

    this.perfilUtilizador = data
    return data
  }

  // Verificação de Permissões
  private verificarPermissoes(permissoesNecessarias: string[]) {
    if (!this.perfilUtilizador) {
      throw new Error('Perfil de utilizador não carregado')
    }

    const permissoesValidas = {
      admin_sistema: ['total'],
      gestor_qualidade: ['criar', 'editar', 'visualizar'],
      tecnico_campo: ['criar', 'visualizar'],
      consulta: ['visualizar'],
      fornecedor: ['visualizar'],
      auditor_externo: ['visualizar']
    }

    const permissoesUsuario = permissoesValidas[this.perfilUtilizador.role] || []
    
    const temPermissao = permissoesNecessarias.every(permissao => 
      permissoesUsuario.includes(permissao) || 
      permissoesUsuario.includes('total')
    )

    if (!temPermissao) {
      throw new Error('Permissão negada')
    }
  }

  // Upload Avançado com Múltiplas Opções
  async uploadDocumento(
    file: File, 
    pasta: string = 'documentos', 
    metadados: Partial<MetadadosUpload> = {}
  ): Promise<MetadadosUpload> {
    // Verificar sessão
    await this.verificarSessao(['criar'])

    try {
      // Nome único para arquivo
      const nomeArquivo = `${this.usuarioAtual?.id}/${uuidv4()}_${file.name}`
      const caminhoCompleto = `${pasta}/${nomeArquivo}`

      // Upload para storage
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from('sistema-qualidade')
        .upload(caminhoCompleto, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
          metadata: {
            uploader: this.usuarioAtual?.id,
            role: this.perfilUtilizador?.role
          }
        })

      if (uploadError) throw uploadError

      // Recuperar URL pública
      const { data: { publicUrl } } = this.supabase.storage
        .from('sistema-qualidade')
        .getPublicUrl(caminhoCompleto)

      // Metadados do documento
      const dadosDocumento = {
        id: uuidv4(),
        nome: file.name,
        url: publicUrl,
        tipo: file.type,
        tamanho: file.size,
        data_upload: new Date(),
        uploader_id: this.usuarioAtual?.id,
        obra_id: this.perfilUtilizador?.obra_padrao,
        ...metadados
      }

      // Salvar metadados no banco
      const { data: registroDocumento, error: erroRegistro } = await this.supabase
        .from('documentos')
        .insert(dadosDocumento)
        .select()

      if (erroRegistro) throw erroRegistro

      return dadosDocumento
    } catch (error) {
      console.error('Erro no upload:', error)
      throw error
    }
  }

  // Download Completo
  async downloadDocumento(documentoId: string) {
    // Verificar sessão
    await this.verificarSessao(['visualizar'])

    try {
      // Buscar metadados do documento
      const { data: documento, error: docError } = await this.supabase
        .from('documentos')
        .select('*')
        .eq('id', documentoId)
        .single()

      if (docError) throw docError

      // Baixar arquivo
      const { data: downloadData, error: downloadError } = await this.supabase.storage
        .from('sistema-qualidade')
        .download(documento.url)

      if (downloadError) throw downloadError

      return {
        arquivo: downloadData,
        metadados: documento
      }
    } catch (error) {
      console.error('Erro no download:', error)
      throw error
    }
  }

  // Registro Inteligente
  async criarRegistro(
    tabela: string, 
    dados: any, 
    opcoesEspeciais: {
      validacoes?: (dados: any) => Promise<boolean>,
      transformacao?: (dados: any) => any,
      acaoAposRegistro?: (registro: any) => Promise<void>,
      permissoesNecessarias?: string[]
    } = {}
  ) {
    // Verificar sessão e permissões
    await this.verificarSessao(opcoesEspeciais.permissoesNecessarias || ['criar'])

    try {
      // Validações personalizadas
      if (opcoesEspeciais.validacoes) {
        const valido = await opcoesEspeciais.validacoes(dados)
        if (!valido) throw new Error('Dados inválidos')
      }

      // Transformação opcional
      const dadosTransformados = opcoesEspeciais.transformacao 
        ? opcoesEspeciais.transformacao(dados)
        : dados

      // Adicionar metadados padrão
      const registroCompleto = {
        ...dadosTransformados,
        id: uuidv4(),
        criado_por: this.usuarioAtual?.id,
        obra_id: this.perfilUtilizador?.obra_padrao,
        data_criacao: new Date().toISOString(),
        status: 'ativo'
      }

      // Inserir no Supabase
      const { data, error } = await this.supabase
        .from(tabela)
        .insert(registroCompleto)
        .select()

      if (error) throw error

      // Ação pós-registro
      if (opcoesEspeciais.acaoAposRegistro) {
        await opcoesEspeciais.acaoAposRegistro(data[0])
      }

      return data[0]
    } catch (error) {
      console.error(`Erro ao criar registro em ${tabela}:`, error)
      throw error
    }
  }

  // Consulta Avançada
  async buscarRegistros(
    tabela: string, 
    opcoes: OpcoesFiltro = {},
    permissoesNecessarias: string[] = ['visualizar']
  ) {
    // Verificar sessão e permissões
    await this.verificarSessao(permissoesNecessarias)

    try {
      let consulta = this.supabase.from(tabela).select('*')

      // Aplicar filtros
      if (opcoes.filtros) {
        Object.entries(opcoes.filtros).forEach(([chave, valor]) => {
          consulta = consulta.eq(chave, valor)
        })
      }

      // Ordenação
      if (opcoes.ordem) {
        consulta = consulta.order(opcoes.ordem)
      }

      // Limite
      if (opcoes.limite) {
        consulta = consulta.limit(opcoes.limite)
      }

      const { data, error } = await consulta

      if (error) throw error

      return data
    } catch (error) {
      console.error(`Erro na busca de registros em ${tabela}:`, error)
      throw error
    }
  }

  // Ações Inteligentes
  async executarAcao(
    tabela: string, 
    id: string, 
    acao: string,
    dadosAdicionais: any = {},
    permissoesNecessarias: string[] = ['editar']
  ) {
    // Verificar sessão e permissões
    await this.verificarSessao(permissoesNecessarias)

    try {
      // Mapeamento de ações com lógica personalizada
      const mapaAcoes: Record<string, any> = {
        aprovar: { 
          update: { 
            status: 'aprovado',
            data_aprovacao: new Date().toISOString(),
            aprovador_id: this.usuarioAtual?.id,
            ...dadosAdicionais 
          },
          notificar: true
        },
        rejeitar: { 
          update: { 
            status: 'rejeitado', 
            motivo_rejeicao: dadosAdicionais.motivo || 'Sem motivo especificado',
            data_rejeicao: new Date().toISOString(),
            rejeitado_por: this.usuarioAtual?.id
          },
          notificar: true
        },
        concluir: { 
          update: { 
            status: 'concluido', 
            data_conclusao: new Date().toISOString(),
            concluido_por: this.usuarioAtual?.id,
            ...dadosAdicionais 
          }
        }
      }

      const acaoSelecionada = mapaAcoes[acao]
      if (!acaoSelecionada) {
        throw new Error(`Ação "${acao}" não reconhecida`)
      }

      // Atualizar registro
      const { data, error } = await this.supabase
        .from(tabela)
        .update(acaoSelecionada.update)
        .eq('id', id)
        .select()

      if (error) throw error

      // Lógica de notificação (opcional)
      if (acaoSelecionada.notificar) {
        await this.notificarAcao(tabela, id, acao)
      }

      return data[0]
    } catch (error) {
      console.error('Erro ao executar ação:', error)
      throw error
    }
  }

  // 🔁 Ações específicas para projetos (wrapper da ação genérica)
  async executarAcaoProjeto(
    idProjeto: string,
    acao: 'aprovar' | 'concluir' | 'rejeitar',
    dadosAdicionais: any = {}
  ) {
    return this.executarAcao('projetos', idProjeto, acao, dadosAdicionais, ['editar']);
  }

  // Notificação de Ações
  private async notificarAcao(tabela: string, id: string, acao: string) {
    try {
      // Lógica de notificação - pode ser expandida
      await this.criarRegistro('notificacoes', {
        tabela_origem: tabela,
        registro_id: id,
        tipo_acao: acao,
        mensagem: `Ação "${acao}" executada no registro ${id}`,
        criado_por: this.usuarioAtual?.id
      })
    } catch (error) {
      console.error('Erro na notificação:', error)
    }
  }

  // Relatórios e Métricas
  async gerarRelatorio(
    tabela: string, 
    tipoRelatorio: string, 
    parametros: any = {},
    permissoesNecessarias: string[] = ['visualizar']
  ) {
    // Verificar sessão e permissões
    await this.verificarSessao(permissoesNecessarias)

    try {
      switch(tipoRelatorio) {
        case 'resumo':
          return this.relatorioResumo(tabela, parametros)
        case 'detalhado':
          return this.relatorioDetalhado(tabela, parametros)
        default:
          throw new Error('Tipo de relatório não suportado')
      }
    } catch (error) {
      console.error('Erro na geração de relatório:', error)
      throw error
    }
  }

  private async relatorioResumo(tabela: string, parametros: any) {
    const { data, error } = await this.supabase
      .from(tabela)
      .select('status, count:count(*)')
      

    return data
  }

  private async relatorioDetalhado(tabela: string, parametros: any) {
    const { data, error } = await this.supabase
      .from(tabela)
      .select('*')
      .match(parametros)

    return data
  }

  // Logout Seguro
  async logout() {
    const { error } = await this.supabase.auth.signOut()
    this.limparSessao()
    
    if (error) {
      console.error('Erro no logout:', error)
      throw error
    }
  }

  // Limpar Sessão
  private limparSessao() {
    this.usuarioAtual = null
    this.perfilUtilizador = null
}
}

// Instância global do serviço
export const sistemaQualidade = new SistemaQualidadeService()

// Exemplo de Uso Completo
export async function exemploUsoCompleto() {
try {
  // Verificar sessão antes de qualquer ação
  await sistemaQualidade.verificarSessao()

  // Upload de documento
  const fileInput = document.querySelector('input[type="file"]')
  if (!fileInput) {
    throw new Error('File input element not found');
  }
  const file = (fileInput as HTMLInputElement).files?.[0];
  if (!file) {
    throw new Error('No file selected');
  }
  const documentoUpload = await sistemaQualidade.uploadDocumento(file, 'relatorios')

  // Criar registro com verificação de permissão
  const novoEnsaio = await sistemaQualidade.criarRegistro('ensaios', {
    nome: 'Ensaio de Resistência',
    descricao: 'Teste de materiais'
  }, {
    validacoes: async (dados) => {
      // Validação personalizada
      return dados.nome.length > 0
    },
    permissoesNecessarias: ['criar']
  })

  // Buscar registros
  const registrosEnsaio = await sistemaQualidade.buscarRegistros('ensaios', {
    filtros: { status: 'pendente' },
    limite: 10,
    ordem: 'data_criacao'
  })

  // Executar ação de aprovar
  const ensaioAprovado = await sistemaQualidade.executarAcao(
    'ensaios', 
    novoEnsaio.id, 
    'aprovar', 
    { observacoes: 'Aprovação automática' }
  )

  // Gerar relatório
  const relatorioEnsaios = await sistemaQualidade.gerarRelatorio(
    'ensaios', 
    'resumo', 
    {},
    ['visualizar']
  )

  return { 
    documentoUpload, 
    novoEnsaio, 
    registrosEnsaio,
    ensaioAprovado,
    relatorioEnsaios 
  }

} catch (error) {
  console.error('Erro no processo:', error)
  throw error
}
}