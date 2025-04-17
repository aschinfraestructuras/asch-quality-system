import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/DashboardV2.css';

// Interfaces para tipagem
interface ResumoDados {
  projetos: number;
  checklists: number;
  ensaios: number;
  naoConformidades: number;
  documentos: number;
  acoesPendentes: number;
}

interface Projeto {
  id: number;
  obraId: number;
  nome: string;
  progresso: number;
  status: string;
  ultimaAtualizacao: string;
}

interface Atividade {
  id: number;
  tipo: string;
  descricao: string;
  data: string;
  usuario: string;
  projeto: string;
  resultado: string;
}

interface Acao {
  id: number;
  obraId: number;
  descricao: string;
  tipo: string;
  prioridade: string;
  prazo: string;
  responsavel: string;
}

interface Fornecedor {
  id: number;
  nome: string;
  categoria: string;
  qualidade: number;
  prazo: number;
  documentacaoAtualizada: boolean;
  ultimaAvaliacao: string;
}

interface Material {
  id: number;
  nome: string;
  quantidade: string;
  recebido: string;
  ensaiosPendentes: number;
  ensaiosRealizados: number;
  conformidade: string;
  fichaTecnica: boolean;
  ultimoRecebimento: string;
}

interface Obra {
  id: number;
  nome: string;
}

// API simulada para desenvolvimento
const apiSimulada = {
  get: async (url: string, params?: any): Promise<any> => {
    // Simular atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));

    // Lista de obras para filtro global
    if (url.includes('/obras')) {
      return {
        data: [
          { id: 1, nome: 'Obra Ferroviária Setúbal' },
          { id: 2, nome: 'Ponte Vasco da Gama - Manutenção' },
          { id: 3, nome: 'Ampliação Terminal Portuário' },
          { id: 4, nome: 'Reabilitação Urbana Baixa' },
          { id: 5, nome: 'Metro Lisboa - Expansão Norte' }
        ]
      };
    }

    // Dados de resumo adaptados com base no filtro de obra
    if (url.includes('/dashboard/resumo')) {
      const obraId = params?.obraId || 'todas';
      
      const dadosBase = {
        projetos: 7,
        checklists: 42,
        ensaios: 18,
        naoConformidades: 5,
        documentos: 124,
        acoesPendentes: 8
      };
      
      // Se filtrado por obra específica, ajustar os números
      if (obraId !== 'todas') {
        return { 
          data: {
            projetos: obraId === '1' ? 1 : obraId === '2' ? 1 : obraId === '3' ? 1 : 0,
            checklists: Math.round(dadosBase.checklists / (Math.random() * 2 + 2)),
            ensaios: Math.round(dadosBase.ensaios / (Math.random() * 2 + 2)),
            naoConformidades: Math.round(dadosBase.naoConformidades / (Math.random() * 2 + 2)),
            documentos: Math.round(dadosBase.documentos / (Math.random() * 2 + 3)),
            acoesPendentes: Math.round(dadosBase.acoesPendentes / (Math.random() * 2 + 2))
          }
        };
      }
      
      return { data: dadosBase };
    } 
    
    // Projetos ativos
    else if (url.includes('/projetos/ativos')) {
      const obraId = params?.obraId || 'todas';
      const todosProjetos = [
        { 
          id: 1, 
          obraId: 1,
          nome: 'Obra Ferroviária Setúbal', 
          progresso: 75, 
          status: 'Em andamento',
          ultimaAtualizacao: '16/04/2025'
        },
        { 
          id: 2, 
          obraId: 2,
          nome: 'Ponte Vasco da Gama - Manutenção', 
          progresso: 30, 
          status: 'Planeado',
          ultimaAtualizacao: '15/04/2025'
        },
        { 
          id: 3, 
          obraId: 3,
          nome: 'Ampliação Terminal Portuário', 
          progresso: 45, 
          status: 'Em andamento',
          ultimaAtualizacao: '14/04/2025'
        },
        { 
          id: 4, 
          obraId: 4,
          nome: 'Reabilitação Urbana Baixa', 
          progresso: 15, 
          status: 'Iniciado',
          ultimaAtualizacao: '10/04/2025'
        },
        { 
          id: 5, 
          obraId: 5,
          nome: 'Metro Lisboa - Expansão Norte', 
          progresso: 5, 
          status: 'Planeado',
          ultimaAtualizacao: '08/04/2025'
        }
      ];
      
      // Filtrar por obra se necessário
      if (obraId !== 'todas') {
        return {
          data: todosProjetos.filter(proj => proj.obraId.toString() === obraId)
        };
      }
      
      return { data: todosProjetos };
    } 
    
    // Atividades recentes adaptadas ao filtro de obra
    else if (url.includes('/atividades/recentes')) {
      const obraId = params?.obraId || 'todas';
      const offset = params?.offset || 0;
      const limite = params?.limite || 5;
      
      const todasAtividades = [
        { 
          id: 1, 
          obraId: 1,
          origem: 'ensaios',
          descricao: 'Ensaio de Compressão - Concreto', 
          data: '2025-04-16', 
          usuario: 'João Silva',
          projeto: 'Obra Ferroviária Setúbal',
          estado: 'Conforme'
        },
        { 
          id: 2, 
          obraId: 1,
          origem: 'naoConformidades',
          descricao: 'Desvio na espessura do betão', 
          data: '2025-04-15', 
          usuario: 'Ana Costa',
          projeto: 'Obra Ferroviária Setúbal',
          estado: 'Aberta'
        },
        { 
          id: 3, 
          obraId: 3,
          origem: 'checklists',
          descricao: 'Inspeção de Execução - Fundações', 
          data: '2025-04-15', 
          usuario: 'Ricardo Pereira',
          projeto: 'Ampliação Terminal Portuário',
          estado: 'Completo'
        },
        { 
          id: 4, 
          obraId: 1,
          origem: 'ensaios',
          descricao: 'Análise Granulométrica - Balastro', 
          data: '2025-04-14', 
          usuario: 'Sofia Martins',
          projeto: 'Obra Ferroviária Setúbal',
          estado: 'Em análise'
        },
        { 
          id: 5, 
          obraId: 2,
          origem: 'documentos',
          descricao: 'Especificação Técnica - Betão C30/37', 
          data: '2025-04-14', 
          usuario: 'Carlos Oliveira',
          projeto: 'Ponte Vasco da Gama - Manutenção',
          estado: 'Aprovado'
        },
        { 
          id: 6, 
          obraId: 2,
          origem: 'naoConformidades',
          descricao: 'Fissuras em junta dilatação', 
          data: '2025-04-13', 
          usuario: 'Miguel Santos',
          projeto: 'Ponte Vasco da Gama - Manutenção',
          estado: 'Em análise'
        },
        { 
          id: 7, 
          obraId: 4,
          origem: 'documentos',
          descricao: 'Plano de Segurança Atualizado', 
          data: '2025-04-12', 
          usuario: 'Teresa Almeida',
          projeto: 'Reabilitação Urbana Baixa',
          estado: 'Aprovado'
        },
        { 
          id: 8, 
          obraId: 3,
          origem: 'checklists',
          descricao: 'Verificação Estrutura Metálica', 
          data: '2025-04-12', 
          usuario: 'André Ferreira',
          projeto: 'Ampliação Terminal Portuário',
          estado: 'Não Conforme'
        }
      ];
      
      // Filtrar por obra se necessário
      let atividadesFiltradas = todasAtividades;
      if (obraId !== 'todas') {
        atividadesFiltradas = todasAtividades.filter(
          ativ => ativ.obraId.toString() === obraId
        );
      }
      
      // Aplicar paginação
      const atividadesPaginadas = atividadesFiltradas.slice(offset, offset + limite);
      
      return {
        data: atividadesPaginadas,
        meta: {
          total: atividadesFiltradas.length,
          offset,
          limite
        }
      };
    } 
    
    // Ações pendentes adaptadas ao filtro de obra
    else if (url.includes('/acoes/pendentes')) {
      const obraId = params?.obraId || 'todas';
      
      const todasAcoes = [
        {
          id: 1,
          obraId: 1,
          descricao: 'Aprovar relatório de ensaios',
          tipo: 'ensaio',
          prioridade: 'Alta',
          prazo: '20/04/2025',
          responsavel: 'João Silva'
        },
        {
          id: 2,
          obraId: 2,
          descricao: 'Revisar plano de qualidade',
          tipo: 'documento',
          prioridade: 'Média',
          prazo: '25/04/2025',
          responsavel: 'Ana Costa'
        },
        {
          id: 3,
          obraId: 1,
          descricao: 'Corrigir não conformidade #125',
          tipo: 'naoConformidade',
          prioridade: 'Alta',
          prazo: '18/04/2025',
          responsavel: 'Ricardo Pereira'
        },
        {
          id: 4,
          obraId: 3,
          descricao: 'Verificar materiais entregues',
          tipo: 'material',
          prioridade: 'Média',
          prazo: '22/04/2025',
          responsavel: 'Sofia Martins'
        },
        {
          id: 5,
          obraId: 4,
          descricao: 'Atualizar plano de emergência',
          tipo: 'documento',
          prioridade: 'Baixa',
          prazo: '30/04/2025',
          responsavel: 'Miguel Rodrigues'
        },
        {
          id: 6,
          obraId: 2,
          descricao: 'Responder a RFI #78',
          tipo: 'rfi',
          prioridade: 'Alta',
          prazo: '19/04/2025',
          responsavel: 'Teresa Almeida'
        }
      ];
      
      // Filtrar por obra se necessário
      if (obraId !== 'todas') {
        return {
          data: todasAcoes.filter(acao => acao.obraId.toString() === obraId)
        };
      }
      
      return { data: todasAcoes };
    } 
    
    // Dados para gráficos
    else if (url.includes('/dashboard/graficos')) {
      const obraId = params?.obraId || 'todas';
      
      // Dados gerais de conformidade
      const dados = {
        conformidade: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [
            {
              label: 'Conformidade (%)',
              data: [87, 85, 91, 89, 92, 95],
              backgroundColor: 'rgba(46, 204, 113, 0.2)',
              borderColor: 'rgba(46, 204, 113, 1)',
              borderWidth: 2,
              tension: 0.4
            }
          ]
        },
        acoesResolvidas: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [
            {
              label: 'Ações Criadas',
              data: [12, 8, 15, 11, 9, 7],
              backgroundColor: 'rgba(52, 152, 219, 0.5)',
              borderColor: 'rgba(52, 152, 219, 0.8)',
              borderWidth: 1
            },
            {
              label: 'Ações Resolvidas',
              data: [10, 7, 13, 10, 8, 6],
              backgroundColor: 'rgba(46, 204, 113, 0.5)',
              borderColor: 'rgba(46, 204, 113, 0.8)',
              borderWidth: 1
            }
          ]
        }
      };
      
      // Dados específicos por obra, se necessário
      if (obraId !== 'todas') {
        // Ajustar dados ligeiramente para cada obra para mostrar variação
        const offset = parseInt(obraId) * 3;
        dados.conformidade.datasets[0].data = dados.conformidade.datasets[0].data.map(
          val => Math.max(75, Math.min(98, val + (Math.random() * offset - offset/2)))
        );
        
        dados.acoesResolvidas.datasets[0].data = dados.acoesResolvidas.datasets[0].data.map(
          val => Math.max(3, Math.min(20, val + (Math.random() * offset - offset/2)))
        );
        
        dados.acoesResolvidas.datasets[1].data = dados.acoesResolvidas.datasets[1].data.map(
          (val, idx) => Math.min(dados.acoesResolvidas.datasets[0].data[idx], val + (Math.random() * offset - offset/2))
        );
      }
      
      return { data: dados };
    }
    
    // Fornecedores (nova seção)
    else if (url.includes('/fornecedores')) {
      return {
        data: [
          {
            id: 1,
            nome: 'Cimentos Portugal, Lda.',
            categoria: 'Materiais',
            qualidade: 4.5,
            prazo: 4.0,
            documentacaoAtualizada: true,
            ultimaAvaliacao: '2025-03-15'
          },
          {
            id: 2,
            nome: 'Aços e Estruturas, S.A.',
            categoria: 'Materiais',
            qualidade: 4.8,
            prazo: 4.7,
            documentacaoAtualizada: true,
            ultimaAvaliacao: '2025-03-20'
          },
          {
            id: 3,
            nome: 'Transportes Rápidos',
            categoria: 'Logística',
            qualidade: 3.6,
            prazo: 3.2,
            documentacaoAtualizada: false,
            ultimaAvaliacao: '2025-02-10'
          },
          {
            id: 4,
            nome: 'Serviços Técnicos Especializados',
            categoria: 'Consultoria',
            qualidade: 4.9,
            prazo: 4.5,
            documentacaoAtualizada: true,
            ultimaAvaliacao: '2025-04-01'
          }
        ]
      };
    }
    
    // Materiais (nova seção)
    else if (url.includes('/materiais')) {
      return {
        data: [
          {
            id: 1,
            nome: 'Betão C30/37',
            quantidade: '450 m³',
            recebido: '350 m³',
            ensaiosPendentes: 2,
            ensaiosRealizados: 15,
            conformidade: '98%',
            fichaTecnica: true,
            ultimoRecebimento: '2025-04-10'
          },
          {
            id: 2,
            nome: 'Aço A500 NR',
            quantidade: '120 ton',
            recebido: '95 ton',
            ensaiosPendentes: 0,
            ensaiosRealizados: 8,
            conformidade: '100%',
            fichaTecnica: true,
            ultimoRecebimento: '2025-04-05'
          },
          {
            id: 3,
            nome: 'Brita 12/20',
            quantidade: '800 ton',
            recebido: '650 ton',
            ensaiosPendentes: 1,
            ensaiosRealizados: 6,
            conformidade: '100%',
            fichaTecnica: true,
            ultimoRecebimento: '2025-04-12'
          }
        ]
      };
    }
    
    return { data: [] };
  },
  
  post: async (url: string): Promise<any> => {
    // Simulando resposta de sucesso para todas as requisições POST
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

const DashboardV2: React.FC = () => {
  // Estado para a obra selecionada
  const [obraAtiva, setObraAtiva] = useState<string>('todas');
  const [obras, setObras] = useState<Obra[]>([]);
  
  // Estados para dados
  const [resumoDados, setResumoDados] = useState<ResumoDados>({
    projetos: 0,
    checklists: 0,
    ensaios: 0,
    naoConformidades: 0,
    documentos: 0,
    acoesPendentes: 0
  });
  const [projetosAtivos, setProjetosAtivos] = useState<Projeto[]>([]);
  const [atividadesRecentes, setAtividadesRecentes] = useState<Atividade[]>([]);
  const [acoesPendentes, setAcoesPendentes] = useState<Acao[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [materiais, setMateriais] = useState<Material[]>([]);
  
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  
  // Carregar lista de obras
  useEffect(() => {
    const carregarObras = async () => {
      try {
        const response = await apiSimulada.get('/obras');
        setObras(response.data);
        
        // Verificar se há obra salva no localStorage
        const obraSalva = localStorage.getItem('obraAtiva');
        if (obraSalva) {
          setObraAtiva(obraSalva);
        }
      } catch (error) {
        console.error("Erro ao carregar obras:", error);
      }
    };
    
    carregarObras();
  }, []);
  
  // Carregar dados com base na obra selecionada
  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      setErro(null);
      
      try {
        // Salvar escolha no localStorage
        localStorage.setItem('obraAtiva', obraAtiva);
        
        // Carregar dados de resumo
        const resumoResponse = await apiSimulada.get('/dashboard/resumo', { obraId: obraAtiva });
        setResumoDados(resumoResponse.data);
        
        // Carregar projetos ativos
        const projetosResponse = await apiSimulada.get('/projetos/ativos', { obraId: obraAtiva });
        setProjetosAtivos(projetosResponse.data);
        
        // Carregar atividades recentes
        const atividadesResponse = await apiSimulada.get('/atividades/recentes', { 
          obraId: obraAtiva,
          limite: 5
        });
        setAtividadesRecentes(formatarAtividades(atividadesResponse.data));
        
        // Carregar ações pendentes
        const acoesResponse = await apiSimulada.get('/acoes/pendentes', { obraId: obraAtiva });
        setAcoesPendentes(acoesResponse.data);
        
        // Carregar fornecedores
        const fornecedoresResponse = await apiSimulada.get('/fornecedores');
        setFornecedores(fornecedoresResponse.data);
        
        // Carregar materiais
        const materiaisResponse = await apiSimulada.get('/materiais');
        setMateriais(materiaisResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        setErro("Ocorreu um erro ao carregar os dados. Por favor, tente novamente mais tarde.");
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, [obraAtiva]);
  
  // Função para formatar as atividades recentes
  const formatarAtividades = (atividades: any[]): Atividade[] => {
    return atividades.map(atividade => {
      // Determina o tipo de atividade baseado na origem
      let tipo = 'documento';
      if (atividade.origem === 'ensaios') tipo = 'ensaio';
      if (atividade.origem === 'checklists') tipo = 'checklist';
      if (atividade.origem === 'naoConformidades') tipo = 'naoConformidade';
      
      return {
        id: atividade.id,
        tipo: tipo,
        descricao: atividade.descricao || atividade.titulo || '',
        data: formatarData(atividade.data),
        usuario: atividade.usuario || atividade.responsavel || '',
        projeto: atividade.projeto || '',
        resultado: atividade.estado || atividade.resultado || ''
      };
    });
  };
  
  // Função para formatar datas
  const formatarData = (data: string): string => {
    if (!data) return '';
    try {
      const dataObj = new Date(data);
      return dataObj.toLocaleDateString('pt-PT');
    } catch (e) {
      return data; // Retorna o formato original se houver erro na conversão
    }
  };
  
  // Função para marcar ação como concluída
  const concluirAcao = async (id: number) => {
    try {
      await apiSimulada.post(`/acoes/${id}/concluir`);
      
      // Atualizar lista de ações pendentes
      const novasAcoes = acoesPendentes.filter(acao => acao.id !== id);
      setAcoesPendentes(novasAcoes);
      
      // Atualizar contagem no resumo
      setResumoDados({
        ...resumoDados,
        acoesPendentes: resumoDados.acoesPendentes - 1
      });
    } catch (error) {
      console.error("Erro ao concluir ação:", error);
      alert("Não foi possível concluir a ação. Por favor, tente novamente.");
    }
  };
  
  // Função para carregar mais atividades
  const carregarMaisAtividades = async () => {
    try {
      const offset = atividadesRecentes.length;
      const limite = 5;
      
      const response = await apiSimulada.get('/atividades/recentes', { 
        obraId: obraAtiva,
        offset,
        limite
      });
      
      if (response.data && response.data.length > 0) {
        const novasAtividades = formatarAtividades(response.data);
        setAtividadesRecentes([...atividadesRecentes, ...novasAtividades]);
      } else {
        alert("Não há mais atividades para carregar.");
      }
    } catch (error) {
      console.error("Erro ao carregar mais atividades:", error);
      alert("Não foi possível carregar mais atividades. Por favor, tente novamente.");
    }
  };
  
  // Função para lidar com a mudança de obra
  const handleMudancaObra = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setObraAtiva(e.target.value);
  };
  
  // Botões de ação rápida
  const botoesAcaoRapida = [
    { nome: 'Novo Checklist', icone: 'fa-tasks', link: '/checklists/novo' },
    { nome: 'Novo Ensaio', icone: 'fa-flask', link: '/ensaios/novo' },
    { nome: 'Novo Documento', icone: 'fa-file-alt', link: '/documentos/novo' },
    { nome: 'Nova NC', icone: 'fa-exclamation-triangle', link: '/nao-conformidades/nova' }
  ];
  
  if (carregando && !resumoDados.projetos) {
    return <div className="dashboard-v2-loading">A carregar dados do dashboard...</div>;
  }
  
  if (erro) {
    return <div className="dashboard-v2-error">{erro}</div>;
  }
  
  return (
    <div className="dashboard-v2-container">
      <div className="dashboard-v2-toolbar">
        <div className="dashboard-v2-header">
          <h1><i className="fas fa-tachometer-alt"></i> Dashboard</h1>
          <div className="dashboard-v2-obra-selector">
            <label htmlFor="obra-select">Obra Ativa:</label>
            <select 
              id="obra-select"
              value={obraAtiva} 
              onChange={handleMudancaObra}
              className="dashboard-v2-obra-dropdown"
            >
              <option value="todas">🔁 Todas as Obras</option>
              {obras.map(obra => (
                <option key={obra.id} value={obra.id.toString()}>
                  {obra.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="dashboard-v2-quick-actions">
          {botoesAcaoRapida.map((botao, index) => (
            <Link key={index} to={botao.link} className="dashboard-v2-action-button">
              <i className={`fas ${botao.icone}`}></i>
              <span>{botao.nome}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="dashboard-v2-resumo-cards">
        <div className="dashboard-v2-card projetos">
          <div className="dashboard-v2-card-icon">
            <i className="fas fa-building"></i>
          </div>
          <div className="dashboard-v2-card-info">
            <span className="dashboard-v2-card-title">Projetos</span>
            <span className="dashboard-v2-card-value">{resumoDados.projetos}</span>
            <span className="dashboard-v2-card-subtitle">Abertas</span>
          </div>
        </div>
        
        <div className="dashboard-v2-card documentos">
          <div className="dashboard-v2-card-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="dashboard-v2-card-info">
            <span className="dashboard-v2-card-title">Documentos</span>
            <span className="dashboard-v2-card-value">{resumoDados.documentos}</span>
            <span className="dashboard-v2-card-subtitle">Total</span>
          </div>
        </div>
        
        <div className="dashboard-v2-card pendentes">
          <div className="dashboard-v2-card-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="dashboard-v2-card-info">
            <span className="dashboard-v2-card-title">Ações Pendentes</span>
            <span className="dashboard-v2-card-value">{resumoDados.acoesPendentes}</span>
            <span className="dashboard-v2-card-subtitle">A resolver</span>
          </div>
        </div>
      </div>

      <div className="dashboard-v2-main-grid">
        <div className="dashboard-v2-left-column">
          {/* Projetos em Andamento */}
          <div className="dashboard-v2-widget projetos-andamento">
            <div className="dashboard-v2-widget-header">
              <h2><i className="fas fa-building"></i> Projetos em Andamento</h2>
              <div className="dashboard-v2-widget-actions">
                <Link to="/projetos" className="dashboard-v2-btn-link">
                  Ver Todos
                </Link>
                <Link to="/projetos/novo" className="dashboard-v2-btn-primary">
                  <i className="fas fa-plus"></i> Novo
                </Link>
              </div>
            </div>
            <div className="dashboard-v2-widget-content">
              {projetosAtivos.length > 0 ? (
                <div className="dashboard-v2-projetos-lista">
                  {projetosAtivos.map(projeto => (
                    <div key={projeto.id} className="dashboard-v2-projeto-item">
                      <div className="dashboard-v2-projeto-header">
                        <h3>{projeto.nome}</h3>
                        <span className={`dashboard-v2-badge ${projeto.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {projeto.status}
                        </span>
                      </div>
                      <div className="dashboard-v2-projeto-progresso">
                        <div className="dashboard-v2-progresso-info">
                          <span className="dashboard-v2-progresso-label">Progresso</span>
                          <span className="dashboard-v2-progresso-valor">{projeto.progresso}%</span>
                        </div>
                        <div className="dashboard-v2-progresso-barra-container">
                          <div 
                            className="dashboard-v2-progresso-barra" 
                            style={{ width: `${projeto.progresso}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="dashboard-v2-projeto-footer">
                        <span className="dashboard-v2-projeto-atualizacao">
                          <i className="far fa-calendar-alt"></i> {projeto.ultimaAtualizacao}
                        </span>
                        <div className="dashboard-v2-projeto-acoes">
                          <Link to={`/projetos/${projeto.id}`} className="dashboard-v2-btn-secondary">
                            <i className="fas fa-eye"></i> Detalhes
                          </Link>
                          <Link to={`/projetos/${projeto.id}/editar`} className="dashboard-v2-btn-outline">
                            <i className="fas fa-pencil-alt"></i> Editar
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard-v2-empty-state">
                  <i className="fas fa-folder-open"></i>
                  <p>Não existem projetos em andamento</p>
                  <Link to="/projetos/novo" className="dashboard-v2-btn-primary">
                    <i className="fas fa-plus"></i> Criar Projeto
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Gráficos e KPIs (Versão Simplificada sem Chart.js) */}
          <div className="dashboard-v2-widget graficos">
            <div className="dashboard-v2-widget-header">
              <h2><i className="fas fa-chart-line"></i> Indicadores de Desempenho</h2>
              <div className="dashboard-v2-widget-actions">
                <button className="dashboard-v2-btn-outline" onClick={() => alert('Exportar PDF')}>
                  <i className="fas fa-file-pdf"></i> Exportar PDF
                </button>
              </div>
            </div>
            <div className="dashboard-v2-widget-content">
              <div className="dashboard-v2-kpi-cards">
                <div className="dashboard-v2-kpi-card">
                  <div className="dashboard-v2-kpi-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="dashboard-v2-kpi-content">
                    <h4>Conformidade Atual</h4>
                    <div className="dashboard-v2-kpi-value">
                      95%
                    </div>
                    <div className="dashboard-v2-kpi-trend positive">
                      <i className="fas fa-arrow-up"></i> 3% desde o mês anterior
                    </div>
                  </div>
                </div>
                <div className="dashboard-v2-kpi-card">
                  <div className="dashboard-v2-kpi-icon">
                    <i className="fas fa-tasks"></i>
                  </div>
                  <div className="dashboard-v2-kpi-content">
                    <h4>Taxa de Resolução</h4>
                    <div className="dashboard-v2-kpi-value">
                      86%
                    </div>
                    <div className="dashboard-v2-kpi-trend positive">
                      <i className="fas fa-arrow-up"></i> 5% desde o mês anterior
                    </div>
                  </div>
                </div>
                <div className="dashboard-v2-kpi-card">
                  <div className="dashboard-v2-kpi-icon">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div className="dashboard-v2-kpi-content">
                    <h4>Cumprimento de Prazos</h4>
                    <div className="dashboard-v2-kpi-value">
                      92%
                    </div>
                    <div className="dashboard-v2-kpi-trend positive">
                      <i className="fas fa-arrow-up"></i> 2% desde o mês anterior
                    </div>
                  </div>
                </div>
              </div>
              <div className="dashboard-v2-grafico-placeholder">
                <div className="dashboard-v2-grafico-info">
                  <i className="fas fa-chart-line"></i>
                  <p>Para ativar os gráficos avançados, instale as dependências:</p>
                  <code>npm install chart.js react-chartjs-2</code>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-v2-right-column">
          {/* Ações Pendentes */}
          <div className="dashboard-v2-widget acoes-pendentes">
            <div className="dashboard-v2-widget-header">
              <h2><i className="fas fa-clock"></i> Ações Pendentes</h2>
              <div className="dashboard-v2-widget-actions">
                <Link to="/acoes" className="dashboard-v2-btn-link">
                  Ver Todas
                </Link>
              </div>
            </div>
            <div className="dashboard-v2-widget-content">
              {acoesPendentes.length > 0 ? (
                <div className="dashboard-v2-acoes-lista">
                  {acoesPendentes.map(acao => (
                    <div key={acao.id} className="dashboard-v2-acao-item">
                      <div className={`dashboard-v2-acao-prioridade ${acao.prioridade.toLowerCase()}`}>
                        {acao.prioridade}
                      </div>
                      <div className="dashboard-v2-acao-conteudo">
                        <h3 className="dashboard-v2-acao-descricao">{acao.descricao}</h3>
                        <div className="dashboard-v2-acao-meta">
                          <span className="dashboard-v2-acao-tipo">
                            <i className={`fas ${
                              acao.tipo === 'ensaio' ? 'fa-flask' : 
                              acao.tipo === 'documento' ? 'fa-file-alt' : 
                              acao.tipo === 'naoConformidade' ? 'fa-exclamation-triangle' : 
                              acao.tipo === 'rfi' ? 'fa-question-circle' : 
                              acao.tipo === 'material' ? 'fa-box' : 'fa-tasks'
                            }`}></i> {acao.tipo}
                          </span>
                          <span className="dashboard-v2-acao-responsavel">
                            <i className="fas fa-user"></i> {acao.responsavel}
                          </span>
                        </div>
                      </div>
                      <div className="dashboard-v2-acao-prazo">
                        <div className="dashboard-v2-prazo-data">
                          <i className="far fa-calendar-alt"></i> {acao.prazo}
                        </div>
                        <button 
                          className="dashboard-v2-btn-success" 
                          onClick={() => concluirAcao(acao.id)}
                        >
                          <i className="fas fa-check"></i> Concluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard-v2-empty-state">
                  <i className="fas fa-check-circle"></i>
                  <p>Não existem ações pendentes</p>
                </div>
              )}
            </div>
          </div>

          {/* Atividades Recentes */}
          <div className="dashboard-v2-widget atividades-recentes">
            <div className="dashboard-v2-widget-header">
              <h2><i className="fas fa-history"></i> Atividades Recentes</h2>
              <div className="dashboard-v2-widget-actions">
                <select className="dashboard-v2-select">
                  <option value="todos">Todos os Tipos</option>
                  <option value="ensaio">Ensaios</option>
                  <option value="checklist">Checklists</option>
                  <option value="naoConformidade">Não Conformidades</option>
                  <option value="documento">Documentos</option>
                </select>
              </div>
            </div>
            <div className="dashboard-v2-widget-content">
              {atividadesRecentes.length > 0 ? (
                <div className="dashboard-v2-atividades-lista">
                  {atividadesRecentes.map(atividade => (
                    <div key={atividade.id} className={`dashboard-v2-atividade-item ${atividade.tipo}`}>
                      <div className="dashboard-v2-atividade-icone">
                        <i className={`fas ${
                          atividade.tipo === 'ensaio' ? 'fa-flask' : 
                          atividade.tipo === 'checklist' ? 'fa-tasks' : 
                          atividade.tipo === 'naoConformidade' ? 'fa-exclamation-triangle' : 'fa-file-alt'
                        }`}></i>
                      </div>
                      <div className="dashboard-v2-atividade-conteudo">
                        <div className="dashboard-v2-atividade-header">
                          <span className="dashboard-v2-atividade-data">
                            <i className="far fa-calendar-alt"></i> {atividade.data}
                          </span>
                          <span className="dashboard-v2-atividade-usuario">
                            <i className="fas fa-user"></i> {atividade.usuario}
                          </span>
                        </div>
                        <h3 className="dashboard-v2-atividade-descricao">{atividade.descricao}</h3>
                        <div className="dashboard-v2-atividade-footer">
                          <span className="dashboard-v2-atividade-projeto">
                            <i className="fas fa-building"></i> {atividade.projeto}
                          </span>
                          <span className={`dashboard-v2-badge ${atividade.resultado.toLowerCase().replace(/\s+/g, '-')}`}>
                            {atividade.resultado}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard-v2-empty-state">
                  <i className="fas fa-history"></i>
                  <p>Não existem atividades recentes</p>
                </div>
              )}
            </div>
            <div className="dashboard-v2-widget-footer">
              <button className="dashboard-v2-btn-outline" onClick={carregarMaisAtividades}>
                <i className="fas fa-sync"></i> Carregar Mais
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-v2-secondary-sections">
        {/* Fornecedores */}
        <div className="dashboard-v2-widget fornecedores">
          <div className="dashboard-v2-widget-header">
            <h2><i className="fas fa-truck"></i> Fornecedores</h2>
            <div className="dashboard-v2-widget-actions">
              <button className="dashboard-v2-btn-outline">
                <i className="fas fa-upload"></i> Upload Certificado
              </button>
              <Link to="/fornecedores" className="dashboard-v2-btn-primary">
                <i className="fas fa-plus"></i> Novo
              </Link>
            </div>
          </div>
          <div className="dashboard-v2-widget-content">
            {fornecedores.length > 0 ? (
              <div className="dashboard-v2-tabela-container">
                <table className="dashboard-v2-tabela">
                  <thead>
                    <tr>
                      <th>Fornecedor</th>
                      <th>Categoria</th>
                      <th>Qualidade</th>
                      <th>Prazo</th>
                      <th>Documentação</th>
                      <th>Última Avaliação</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fornecedores.map(fornecedor => (
                      <tr key={fornecedor.id}>
                        <td>{fornecedor.nome}</td>
                        <td>{fornecedor.categoria}</td>
                        <td>
                          <div className="dashboard-v2-rating">
                            {Array(5).fill(0).map((_, i) => (
                              <i 
                                key={i}
                                className={`${i < Math.floor(fornecedor.qualidade) ? 'fas' : 'far'} fa-star ${
                                  fornecedor.qualidade >= 4 ? 'excelente' : 
                                  fornecedor.qualidade >= 3 ? 'bom' : 
                                  fornecedor.qualidade >= 2 ? 'medio' : 'fraco'
                                }`}
                              ></i>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="dashboard-v2-rating">
                            {Array(5).fill(0).map((_, i) => (
                              <i 
                                key={i}
                                className={`${i < Math.floor(fornecedor.prazo) ? 'fas' : 'far'} fa-star ${
                                  fornecedor.prazo >= 4 ? 'excelente' : 
                                  fornecedor.prazo >= 3 ? 'bom' : 
                                  fornecedor.prazo >= 2 ? 'medio' : 'fraco'
                                }`}
                              ></i>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className={`dashboard-v2-badge ${
                            fornecedor.documentacaoAtualizada ? 'sucesso' : 'alerta'
                          }`}>
                            {fornecedor.documentacaoAtualizada ? 'Atualizada' : 'Pendente'}
                          </span>
                        </td>
                        <td>{formatarData(fornecedor.ultimaAvaliacao)}</td>
                        <td>
                          <div className="dashboard-v2-acoes-tabela">
                            <button className="dashboard-v2-btn-icon" title="Ver detalhes">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="dashboard-v2-btn-icon" title="Editar">
                              <i className="fas fa-pencil-alt"></i>
                            </button>
                            <button className="dashboard-v2-btn-icon" title="Ver documentos">
                              <i className="fas fa-folder-open"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="dashboard-v2-empty-state">
                <i className="fas fa-truck"></i>
                <p>Não existem fornecedores cadastrados</p>
                <Link to="/fornecedores/novo" className="dashboard-v2-btn-primary">
                  <i className="fas fa-plus"></i> Adicionar Fornecedor
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Materiais */}
        <div className="dashboard-v2-widget materiais">
          <div className="dashboard-v2-widget-header">
            <h2><i className="fas fa-box"></i> Materiais</h2>
            <div className="dashboard-v2-widget-actions">
              <button className="dashboard-v2-btn-outline">
                <i className="fas fa-file-upload"></i> Importar Lista
              </button>
              <Link to="/materiais/novo" className="dashboard-v2-btn-primary">
                <i className="fas fa-plus"></i> Novo
              </Link>
            </div>
          </div>
          <div className="dashboard-v2-widget-content">
            {materiais.length > 0 ? (
              <div className="dashboard-v2-tabela-container">
                <table className="dashboard-v2-tabela">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Quantidade</th>
                      <th>Recebido</th>
                      <th>Ensaios</th>
                      <th>Conformidade</th>
                      <th>Ficha Técnica</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materiais.map(material => (
                      <tr key={material.id}>
                        <td>{material.nome}</td>
                        <td>{material.quantidade}</td>
                        <td>{material.recebido}</td>
                        <td>
                          {material.ensaiosPendentes > 0 ? (
                            <span className="dashboard-v2-badge alerta">
                              {material.ensaiosPendentes} pendentes
                            </span>
                          ) : (
                            <span className="dashboard-v2-badge sucesso">
                              {material.ensaiosRealizados} realizados
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`dashboard-v2-badge ${
                            parseInt(material.conformidade) === 100 ? 'sucesso' :
                            parseInt(material.conformidade) >= 90 ? 'bom' : 'alerta'
                          }`}>
                            {material.conformidade}
                          </span>
                        </td>
                        <td>
                          {material.fichaTecnica ? (
                            <button className="dashboard-v2-btn-outline">
                              <i className="fas fa-file-pdf"></i> Ver PDF
                            </button>
                          ) : (
                            <button className="dashboard-v2-btn-warning">
                              <i className="fas fa-upload"></i> Upload
                            </button>
                          )}
                        </td>
                        <td>
                          <div className="dashboard-v2-acoes-tabela">
                            <button className="dashboard-v2-btn-icon" title="Ver detalhes">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="dashboard-v2-btn-icon" title="Adicionar ensaio">
                              <i className="fas fa-flask"></i>
                            </button>
                            <button className="dashboard-v2-btn-icon" title="Atualizar quantidade">
                              <i className="fas fa-edit"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="dashboard-v2-empty-state">
                <i className="fas fa-box"></i>
                <p>Não existem materiais cadastrados</p>
                <Link to="/materiais/novo" className="dashboard-v2-btn-primary">
                  <i className="fas fa-plus"></i> Adicionar Material
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardV2;Ativos</span>
          </div>
        </div>
        
        <div className="dashboard-v2-card checklists">
          <div className="dashboard-v2-card-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="dashboard-v2-card-info">
            <span className="dashboard-v2-card-title">Checklists</span>
            <span className="dashboard-v2-card-value">{resumoDados.checklists}</span>
            <span className="dashboard-v2-card-subtitle">Esta semana</span>
          </div>
        </div>
        
        <div className="dashboard-v2-card ensaios">
          <div className="dashboard-v2-card-icon">
            <i className="fas fa-flask"></i>
          </div>
          <div className="dashboard-v2-card-info">
            <span className="dashboard-v2-card-title">Ensaios</span>
            <span className="dashboard-v2-card-value">{resumoDados.ensaios}</span>
            <span className="dashboard-v2-card-subtitle">Em andamento</span>
          </div>
        </div>
        
        <div className="dashboard-v2-card nao-conformidades">
          <div className="dashboard-v2-card-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="dashboard-v2-card-info">
            <span className="dashboard-v2-card-title">Não Conformidades</span>
            <span className="dashboard-v2-card-value">{resumoDados.naoConformidades}</span>
            <span className="dashboard-v2-card-subtitle"></span>
            