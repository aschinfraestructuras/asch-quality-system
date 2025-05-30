import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

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
  descricao: string;
  tipo: string;
  prioridade: string;
  prazo: string;
  responsavel: string;
}

// API simulada para desenvolvimento
const apiSimulada = {
  get: async (url: string): Promise<any> => {
    // Simulando dados da API
    if (url.includes('/dashboard/resumo')) {
      return { 
        data: {
          projetos: 7,
          checklists: 42,
          ensaios: 18,
          naoConformidades: 5,
          documentos: 124,
          acoesPendentes: 8
        }
      };
    } else if (url.includes('/projetos/ativos')) {
      return {
        data: [
          { 
            id: 1, 
            nome: 'Obra Ferroviária Setúbal', 
            progresso: 75, 
            status: 'Em andamento',
            ultimaAtualizacao: '16/04/2025'
          },
          { 
            id: 2, 
            nome: 'Ponte Vasco da Gama - Manutenção', 
            progresso: 30, 
            status: 'Planeado',
            ultimaAtualizacao: '15/04/2025'
          },
          { 
            id: 3, 
            nome: 'Ampliação Terminal Portuário', 
            progresso: 45, 
            status: 'Em andamento',
            ultimaAtualizacao: '14/04/2025'
          }
        ]
      };
    } else if (url.includes('/atividades/recentes')) {
      return {
        data: [
          { 
            id: 1, 
            origem: 'ensaios',
            descricao: 'Ensaio de Compressão - Concreto', 
            data: '2025-04-16', 
            usuario: 'João Silva',
            projeto: 'Obra Ferroviária Setúbal',
            estado: 'Conforme'
          },
          { 
            id: 2, 
            origem: 'naoConformidades',
            descricao: 'Desvio na espessura do betão', 
            data: '2025-04-15', 
            usuario: 'Ana Costa',
            projeto: 'Obra Ferroviária Setúbal',
            estado: 'Aberta'
          },
          { 
            id: 3, 
            origem: 'checklists',
            descricao: 'Inspeção de Execução - Fundações', 
            data: '2025-04-15', 
            responsavel: 'Ricardo Pereira',
            projeto: 'Ampliação Terminal Portuário',
            estado: 'Completo'
          }
        ]
      };
    } else if (url.includes('/acoes/pendentes')) {
      return {
        data: [
          {
            id: 1,
            descricao: 'Aprovar relatório de ensaios',
            tipo: 'ensaio',
            prioridade: 'Alta',
            prazo: '20/04/2025',
            responsavel: 'João Silva'
          },
          {
            id: 2,
            descricao: 'Revisar plano de qualidade',
            tipo: 'documento',
            prioridade: 'Média',
            prazo: '25/04/2025',
            responsavel: 'Ana Costa'
          },
          {
            id: 3,
            descricao: 'Corrigir não conformidade #125',
            tipo: 'naoConformidade',
            prioridade: 'Alta',
            prazo: '18/04/2025',
            responsavel: 'Ricardo Pereira'
          }
        ]
      };
    }
    return { data: [] };
  },
  post: async (url: string): Promise<any> => {
    // Simulando resposta de sucesso para todas as requisições POST
    return { success: true };
  }
};

const Dashboard: React.FC = () => {
  const [periodoFiltro, setPeriodoFiltro] = useState<string>('semana');
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
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  
  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);
      setErro(null);
      
      try {
        // Carregar dados de resumo
        const resumoResponse = await apiSimulada.get(`/dashboard/resumo?periodo=${periodoFiltro}`);
        setResumoDados(resumoResponse.data);
        
        // Carregar projetos ativos
        const projetosResponse = await apiSimulada.get('/projetos/ativos');
        setProjetosAtivos(projetosResponse.data);
        
        // Carregar atividades recentes
        const atividadesResponse = await apiSimulada.get(`/atividades/recentes?periodo=${periodoFiltro}`);
        const atividadesFormatadas = formatarAtividades(atividadesResponse.data);
        setAtividadesRecentes(atividadesFormatadas);
        
        // Carregar ações pendentes
        const acoesResponse = await apiSimulada.get('/acoes/pendentes');
        setAcoesPendentes(acoesResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        setErro("Ocorreu um erro ao carregar os dados. Por favor, tente novamente mais tarde.");
      } finally {
        setCarregando(false);
      }
    }
    
    carregarDados();
  }, [periodoFiltro]);
  
  // Função para formatar as atividades recentes de diferentes módulos
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
        resultado: atividade.resultado || atividade.estado || ''
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
      
      const response = await apiSimulada.get(`/atividades/recentes?periodo=${periodoFiltro}&offset=${offset}&limite=${limite}`);
      const novasAtividades = formatarAtividades(response.data);
      
      setAtividadesRecentes([...atividadesRecentes, ...novasAtividades]);
    } catch (error) {
      console.error("Erro ao carregar mais atividades:", error);
      alert("Não foi possível carregar mais atividades. Por favor, tente novamente.");
    }
  };
  
  if (carregando) {
    return <div className="dashboard-loading">A carregar dados do dashboard...</div>;
  }
  
  if (erro) {
    return <div className="dashboard-error">{erro}</div>;
  }
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-filters">
          <select 
            value={periodoFiltro} 
            onChange={(e) => setPeriodoFiltro(e.target.value)}
            className="periodo-filter"
          >
            <option value="hoje">Hoje</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="trimestre">Este Trimestre</option>
          </select>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="dashboard-resumo-cards">
        <div className="dashboard-resumo-card projetos">
          <div className="dashboard-card-icon">
            <i className="fas fa-building"></i>
          </div>
          <div className="dashboard-card-info">
            <span className="dashboard-card-title">Projetos</span>
            <span className="dashboard-card-value">{resumoDados.projetos}</span>
            <span className="dashboard-card-subtitle">Ativos</span>
          </div>
        </div>
        
        <div className="dashboard-resumo-card checklists">
          <div className="dashboard-card-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="dashboard-card-info">
            <span className="dashboard-card-title">Checklists</span>
            <span className="dashboard-card-value">{resumoDados.checklists}</span>
            <span className="dashboard-card-subtitle">Esta semana</span>
          </div>
        </div>
        
        <div className="dashboard-resumo-card ensaios">
          <div className="dashboard-card-icon">
            <i className="fas fa-flask"></i>
          </div>
          <div className="dashboard-card-info">
            <span className="dashboard-card-title">Ensaios</span>
            <span className="dashboard-card-value">{resumoDados.ensaios}</span>
            <span className="dashboard-card-subtitle">Em andamento</span>
          </div>
        </div>
        
        <div className="dashboard-resumo-card nao-conformidades">
          <div className="dashboard-card-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="dashboard-card-info">
            <span className="dashboard-card-title">Não Conformidades</span>
            <span className="dashboard-card-value">{resumoDados.naoConformidades}</span>
            <span className="dashboard-card-subtitle">Abertas</span>
          </div>
        </div>
        
        <div className="dashboard-resumo-card documentos">
          <div className="dashboard-card-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="dashboard-card-info">
            <span className="dashboard-card-title">Documentos</span>
            <span className="dashboard-card-value">{resumoDados.documentos}</span>
            <span className="dashboard-card-subtitle">Total</span>
          </div>
        </div>
        
        <div className="dashboard-resumo-card pendentes">
          <div className="dashboard-card-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="dashboard-card-info">
            <span className="dashboard-card-title">Ações Pendentes</span>
            <span className="dashboard-card-value">{resumoDados.acoesPendentes}</span>
            <span className="dashboard-card-subtitle">A resolver</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Projetos em Andamento */}
        <div className="dashboard-card projetos-andamento">
          <div className="dashboard-card-header">
            <h2>Projetos em Andamento</h2>
            <Link to="/projetos" className="dashboard-ver-todos">Ver Todos</Link>
          </div>
          <div className="dashboard-card-content">
            {projetosAtivos.length > 0 ? (
              projetosAtivos.map(projeto => (
                <div key={projeto.id} className="dashboard-projeto-item">
                  <div className="dashboard-projeto-info">
                    <h3>{projeto.nome}</h3>
                    <span className="dashboard-projeto-status">{projeto.status}</span>
                  </div>
                  <div className="dashboard-projeto-progresso">
                    <div className="dashboard-progresso-barra">
                      <div 
                        className="dashboard-progresso-valor" 
                        style={{ width: `${projeto.progresso}%` }}
                      ></div>
                    </div>
                    <span className="dashboard-progresso-percentagem">{projeto.progresso}%</span>
                  </div>
                  <div className="dashboard-projeto-footer">
                    <span className="dashboard-projeto-atualizacao">Atualizado em {projeto.ultimaAtualizacao}</span>
                    <Link to={`/projetos/${projeto.id}`} className="dashboard-btn-detalhes">Detalhes</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="dashboard-empty-state">Não existem projetos em andamento</div>
            )}
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="dashboard-card atividades-recentes">
          <div className="dashboard-card-header">
            <h2>Atividades Recentes</h2>
            <select className="dashboard-filtro-atividades">
              <option value="todos">Todos os Tipos</option>
              <option value="ensaio">Ensaios</option>
              <option value="checklist">Checklists</option>
              <option value="naoConformidade">Não Conformidades</option>
              <option value="documento">Documentos</option>
            </select>
          </div>
          <div className="dashboard-card-content">
            {atividadesRecentes.length > 0 ? (
              <ul className="dashboard-atividades-lista">
                {atividadesRecentes.map(atividade => (
                  <li key={atividade.id} className={`dashboard-atividade-item ${atividade.tipo}`}>
                    <div className="dashboard-atividade-icone">
                      {atividade.tipo === 'ensaio' && <i className="fas fa-flask"></i>}
                      {atividade.tipo === 'checklist' && <i className="fas fa-tasks"></i>}
                      {atividade.tipo === 'naoConformidade' && <i className="fas fa-exclamation-triangle"></i>}
                      {atividade.tipo === 'documento' && <i className="fas fa-file-alt"></i>}
                    </div>
                    <div className="dashboard-atividade-conteudo">
                      <div className="dashboard-atividade-cabecalho">
                        <span className="dashboard-atividade-data">{atividade.data}</span>
                        <span className="dashboard-atividade-usuario">{atividade.usuario}</span>
                      </div>
                      <p className="dashboard-atividade-descricao">{atividade.descricao}</p>
                      <div className="dashboard-atividade-detalhes">
                        <span className="dashboard-atividade-projeto">{atividade.projeto}</span>
                        <span className={`dashboard-atividade-resultado ${atividade.resultado.toLowerCase().replace(' ', '-')}`}>
                          {atividade.resultado}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="dashboard-empty-state">Não existem atividades recentes</div>
            )}
          </div>
          <div className="dashboard-card-footer">
            <button className="dashboard-btn-carregar-mais" onClick={carregarMaisAtividades}>
              Carregar Mais
            </button>
          </div>
        </div>

        {/* Ações Pendentes */}
        <div className="dashboard-card acoes-pendentes">
          <div className="dashboard-card-header">
            <h2>Ações Pendentes</h2>
            <Link to="/acoes" className="dashboard-ver-todos">Ver Todas</Link>
          </div>
          <div className="dashboard-card-content">
            {acoesPendentes.length > 0 ? (
              <ul className="dashboard-acoes-lista">
                {acoesPendentes.map(acao => (
                  <li key={acao.id} className="dashboard-acao-item">
                    <div className="dashboard-acao-prioridade">
                      <span className={`dashboard-prioridade-indicador ${acao.prioridade.toLowerCase()}`}></span>
                    </div>
                    <div className="dashboard-acao-conteudo">
                      <p className="dashboard-acao-descricao">{acao.descricao}</p>
                      <div className="dashboard-acao-detalhes">
                        <span className="dashboard-acao-tipo">{acao.tipo}</span>
                        <span className="dashboard-acao-responsavel">{acao.responsavel}</span>
                      </div>
                    </div>
                    <div className="dashboard-acao-prazo">
                      <span className="dashboard-label-prazo">Prazo</span>
                      <span className="dashboard-data-prazo">{acao.prazo}</span>
                      <button 
                        className="dashboard-btn-concluir" 
                        onClick={() => concluirAcao(acao.id)}
                      >
                        Concluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="dashboard-empty-state">Não existem ações pendentes</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;