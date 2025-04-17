import React, { useState, useEffect } from 'react';
// Importar CSS
import "../styles/DashboardV2.css"; // Mudei para DashboardV2.css para corresponder ao nome do componente

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

interface Obra {
  id: number;
  nome: string;
}

// API simulada para desenvolvimento
const apiSimulada = {
  obterObras: () => [
    { id: 1, nome: 'Obra Ferroviária Setúbal' },
    { id: 2, nome: 'Ponte Vasco da Gama - Manutenção' },
    { id: 3, nome: 'Ampliação Terminal Portuário' },
    { id: 4, nome: 'Reabilitação Urbana Baixa' }
  ],
  
  obterResumo: (obraId?: number) => {
    const resumo = {
      projetos: 7,
      checklists: 42,
      ensaios: 18,
      naoConformidades: 5,
      documentos: 124,
      acoesPendentes: 8
    };
    
    if (obraId) {
      // Ajustar dados para obra específica
      return {
        projetos: Math.max(1, Math.floor(resumo.projetos / 3)),
        checklists: Math.floor(resumo.checklists / 4),
        ensaios: Math.floor(resumo.ensaios / 3),
        naoConformidades: Math.floor(resumo.naoConformidades / 2),
        documentos: Math.floor(resumo.documentos / 5),
        acoesPendentes: Math.floor(resumo.acoesPendentes / 2)
      };
    }
    
    return resumo;
  },
  
  obterProjetos: (obraId?: number) => {
    const projetos = [
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
      },
      { 
        id: 4, 
        nome: 'Reabilitação Urbana Baixa', 
        progresso: 15, 
        status: 'Iniciado',
        ultimaAtualizacao: '10/04/2025'
      }
    ];
    
    if (obraId) {
      return projetos.filter(p => p.id === obraId);
    }
    
    return projetos;
  },
  
  obterAtividades: (obraId?: number) => {
    const atividades = [
      { 
        id: 1, 
        tipo: 'ensaio',
        descricao: 'Ensaio de Compressão - Betão', 
        data: '16/04/2025', 
        usuario: 'João Silva',
        projeto: 'Obra Ferroviária Setúbal',
        resultado: 'Conforme'
      },
      { 
        id: 2, 
        tipo: 'naoConformidade',
        descricao: 'Desvio na espessura do betão', 
        data: '15/04/2025', 
        usuario: 'Ana Costa',
        projeto: 'Obra Ferroviária Setúbal',
        resultado: 'Aberta'
      },
      { 
        id: 3, 
        tipo: 'checklist',
        descricao: 'Inspeção de Execução - Fundações', 
        data: '15/04/2025', 
        usuario: 'Ricardo Pereira',
        projeto: 'Ampliação Terminal Portuário',
        resultado: 'Completo'
      },
      { 
        id: 4, 
        tipo: 'documento',
        descricao: 'Especificação Técnica - Betão C30/37', 
        data: '14/04/2025', 
        usuario: 'Carlos Oliveira',
        projeto: 'Ponte Vasco da Gama - Manutenção',
        resultado: 'Aprovado'
      }
    ];
    
    if (obraId) {
      return atividades.filter(a => a.projeto.includes(obraId.toString()));
    }
    
    return atividades;
  },
  
  obterAcoes: (obraId?: number) => {
    const acoes = [
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
    ];
    
    if (obraId) {
      // Filtro simplificado para demonstração
      return acoes.slice(0, Math.max(1, acoes.length - 1));
    }
    
    return acoes;
  },
  
  concluirAcao: (id: number) => {
    console.log(`Ação ${id} concluída`);
    return true;
  }
};

// Componente principal - Renomeado para DashboardV2
const DashboardV2: React.FC = () => {
  // Estados
  const [obraAtiva, setObraAtiva] = useState<number | undefined>(undefined);
  const [obras, setObras] = useState<Obra[]>([]);
  const [resumoDados, setResumoDados] = useState<ResumoDados>({
    projetos: 0,
    checklists: 0,
    ensaios: 0,
    naoConformidades: 0,
    documentos: 0,
    acoesPendentes: 0
  });
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [acoes, setAcoes] = useState<Acao[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Efeito para carregar obras
  useEffect(() => {
    const carregarObras = () => {
      try {
        const dadosObras = apiSimulada.obterObras();
        setObras(dadosObras);
        
        // Verificar localStorage
        const obraSalva = localStorage.getItem('obraAtiva');
        if (obraSalva) {
          setObraAtiva(parseInt(obraSalva));
        }
      } catch (error) {
        console.error("Erro ao carregar obras:", error);
      }
    };
    
    carregarObras();
  }, []);

  // Efeito para carregar dados com base na obra selecionada
  useEffect(() => {
    const carregarDados = () => {
      setCarregando(true);
      
      try {
        // Salvar escolha no localStorage
        if (obraAtiva) {
          localStorage.setItem('obraAtiva', obraAtiva.toString());
        } else {
          localStorage.removeItem('obraAtiva');
        }
        
        // Carregar dados
        setResumoDados(apiSimulada.obterResumo(obraAtiva));
        setProjetos(apiSimulada.obterProjetos(obraAtiva));
        setAtividades(apiSimulada.obterAtividades(obraAtiva));
        setAcoes(apiSimulada.obterAcoes(obraAtiva));
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, [obraAtiva]);

  // Handler para mudança de obra
  const handleMudancaObra = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setObraAtiva(valor === 'todas' ? undefined : parseInt(valor));
  };

  // Função para concluir ação
  const concluirAcao = (id: number) => {
    try {
      const sucesso = apiSimulada.concluirAcao(id);
      
      if (sucesso) {
        // Atualizar lista de ações
        setAcoes(acoes.filter(acao => acao.id !== id));
        
        // Atualizar contagem no resumo
        setResumoDados({
          ...resumoDados,
          acoesPendentes: resumoDados.acoesPendentes - 1
        });
      }
    } catch (error) {
      console.error("Erro ao concluir ação:", error);
      alert("Não foi possível concluir a ação. Por favor, tente novamente.");
    }
  };

  // Botões de ação rápida
  const botoesAcaoRapida = [
    { nome: 'Novo Checklist', icone: 'clipboard-check', link: '/checklists/novo' },
    { nome: 'Novo Ensaio', icone: 'flask', link: '/ensaios/novo' },
    { nome: 'Novo Documento', icone: 'file-alt', link: '/documentos/novo' },
    { nome: 'Nova NC', icone: 'exclamation-triangle', link: '/nao-conformidades/nova' }
  ];

  if (carregando && !resumoDados.projetos) {
    return <div className="dashboard-v2-carregando">A carregar dados do dashboard...</div>;
  }

  return (
    <div className="dashboard-v2-container">
      {/* Cabeçalho e filtro de obra */}
      <div className="dashboard-v2-header">
        <h1>Dashboard</h1>
        <div className="dashboard-v2-filtro-obra">
          <label htmlFor="obra-select">Obra:</label>
          <select 
            id="obra-select"
            value={obraAtiva?.toString() || 'todas'} 
            onChange={handleMudancaObra}
            className="dashboard-v2-select"
          >
            <option value="todas">Todas as Obras</option>
            {obras.map(obra => (
              <option key={obra.id} value={obra.id.toString()}>
                {obra.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botões de ação rápida */}
      <div className="dashboard-v2-acoes-rapidas">
        {botoesAcaoRapida.map((botao, index) => (
          <a key={index} href={botao.link} className="dashboard-v2-botao-acao">
            <i className={`fas fa-${botao.icone}`}></i>
            <span>{botao.nome}</span>
          </a>
        ))}
      </div>

      {/* Cards de resumo */}
      <div className="dashboard-v2-resumo-cards">
        <div className="dashboard-v2-card projetos">
          <div className="dashboard-v2-card-icon">
            <i className="fas fa-building"></i>
          </div>
          <div className="dashboard-v2-card-info">
            <h3>Projetos</h3>
            <div className="dashboard-v2-card-valor">{resumoDados.projetos}</div>
            <span className="dashboard-v2-card-subtitulo">Ativos</span>
          </div>
        </div>
        
        <div className="dashboard-v2-card documentos">
          <div className="dashboard-v2-card-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="dashboard-v2-card-info">
            <h3>Documentos</h3>
            <div className="dashboard-v2-card-valor">{resumoDados.documentos}</div>
            <span className="dashboard-v2-card-subtitulo">Total</span>
          </div>
        </div>
        
        <div className="dashboard-v2-card ensaios">
          <div className="dashboard-v2-card-icon">
            <i className="fas fa-flask"></i>
          </div>
          <div className="dashboard-v2-card-info">
            <h3>Ensaios</h3>
            <div className="dashboard-v2-card-valor">{resumoDados.ensaios}</div>
            <span className="dashboard-v2-card-subtitulo">Em andamento</span>
          </div>
        </div>
        
        <div className="dashboard-v2-card nao-conformidades">
          <div className="dashboard-v2-card-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="dashboard-v2-card-info">
            <h3>Não Conformidades</h3>
            <div className="dashboard-v2-card-valor">{resumoDados.naoConformidades}</div>
            <span className="dashboard-v2-card-subtitulo">Em aberto</span>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="dashboard-v2-grid">
        {/* Projetos */}
        <div className="dashboard-v2-secao-projetos dashboard-v2-secao">
          <div className="dashboard-v2-secao-cabecalho">
            <h2><i className="fas fa-building"></i> Projetos em Andamento</h2>
            <div className="dashboard-v2-secao-acoes">
              <a href="/projetos" className="dashboard-v2-link-ver-todos">Ver Todos</a>
              <a href="/projetos/novo" className="dashboard-v2-botao-primario">
                <i className="fas fa-plus"></i> Novo
              </a>
            </div>
          </div>
          
          <div className="dashboard-v2-secao-conteudo">
            {projetos.length > 0 ? (
              <div className="dashboard-v2-lista-projetos">
                {projetos.map(projeto => (
                  <div key={projeto.id} className="dashboard-v2-projeto-item">
                    <div className="dashboard-v2-projeto-cabecalho">
                      <h3>{projeto.nome}</h3>
                      <span className={`dashboard-v2-badge ${projeto.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {projeto.status}
                      </span>
                    </div>
                    
                    <div className="dashboard-v2-projeto-progresso">
                      <div className="dashboard-v2-progresso-info">
                        <span>Progresso</span>
                        <span>{projeto.progresso}%</span>
                      </div>
                      <div className="dashboard-v2-progresso-barra-container">
                        <div 
                          className="dashboard-v2-progresso-barra" 
                          style={{ width: `${projeto.progresso}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="dashboard-v2-projeto-acoes">
                      <span className="dashboard-v2-projeto-data">
                        <i className="far fa-calendar-alt"></i> {projeto.ultimaAtualizacao}
                      </span>
                      <div>
                        <a href={`/projetos/${projeto.id}`} className="dashboard-v2-botao-secundario">
                          <i className="fas fa-eye"></i> Detalhes
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-v2-estado-vazio">
                <i className="fas fa-folder-open"></i>
                <p>Não existem projetos ativos</p>
                <a href="/projetos/novo" className="dashboard-v2-botao-primario">
                  <i className="fas fa-plus"></i> Criar Projeto
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Atividades recentes e ações */}
        <div className="dashboard-v2-lado-direito">
          {/* Ações pendentes */}
          <div className="dashboard-v2-secao-acoes dashboard-v2-secao">
            <div className="dashboard-v2-secao-cabecalho">
              <h2><i className="fas fa-clock"></i> Ações Pendentes</h2>
              <a href="/acoes" className="dashboard-v2-link-ver-todos">Ver Todas</a>
            </div>
            
            <div className="dashboard-v2-secao-conteudo">
              {acoes.length > 0 ? (
                <div className="dashboard-v2-lista-acoes">
                  {acoes.map(acao => (
                    <div key={acao.id} className="dashboard-v2-acao-item">
                      <div className={`dashboard-v2-acao-prioridade ${acao.prioridade.toLowerCase()}`}>
                        {acao.prioridade}
                      </div>
                      <div className="dashboard-v2-acao-conteudo">
                        <h3>{acao.descricao}</h3>
                        <div className="dashboard-v2-acao-meta">
                          <span className="dashboard-v2-acao-tipo">
                            <i className={`fas fa-${
                              acao.tipo === 'ensaio' ? 'flask' : 
                              acao.tipo === 'documento' ? 'file-alt' : 
                              acao.tipo === 'naoConformidade' ? 'exclamation-triangle' : 'tasks'
                            }`}></i> {acao.tipo}
                          </span>
                          <span className="dashboard-v2-acao-responsavel">
                            <i className="fas fa-user"></i> {acao.responsavel}
                          </span>
                          <span className="dashboard-v2-acao-prazo">
                            <i className="far fa-calendar-alt"></i> {acao.prazo}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="dashboard-v2-botao-sucesso" 
                        onClick={() => concluirAcao(acao.id)}
                      >
                        <i className="fas fa-check"></i> Concluir
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard-v2-estado-vazio">
                  <i className="fas fa-check-circle"></i>
                  <p>Não existem ações pendentes</p>
                </div>
              )}
            </div>
          </div>

          {/* Atividades recentes */}
          <div className="dashboard-v2-secao-atividades dashboard-v2-secao">
            <div className="dashboard-v2-secao-cabecalho">
              <h2><i className="fas fa-history"></i> Atividades Recentes</h2>
              <select className="dashboard-v2-filtro-atividades dashboard-v2-select">
                <option value="todos">Todos os Tipos</option>
                <option value="ensaio">Ensaios</option>
                <option value="checklist">Checklists</option>
                <option value="naoConformidade">Não Conformidades</option>
                <option value="documento">Documentos</option>
              </select>
            </div>
            
            <div className="dashboard-v2-secao-conteudo">
              {atividades.length > 0 ? (
                <div className="dashboard-v2-lista-atividades">
                  {atividades.map(atividade => (
                    <div key={atividade.id} className={`dashboard-v2-atividade-item ${atividade.tipo}`}>
                      <div className="dashboard-v2-atividade-icone">
                        <i className={`fas fa-${
                          atividade.tipo === 'ensaio' ? 'flask' : 
                          atividade.tipo === 'checklist' ? 'clipboard-check' : 
                          atividade.tipo === 'naoConformidade' ? 'exclamation-triangle' : 'file-alt'
                        }`}></i>
                      </div>
                      <div className="dashboard-v2-atividade-conteudo">
                        <div className="dashboard-v2-atividade-topo">
                          <span className="dashboard-v2-atividade-data">
                            <i className="far fa-calendar-alt"></i> {atividade.data}
                          </span>
                          <span className="dashboard-v2-atividade-usuario">
                            <i className="fas fa-user"></i> {atividade.usuario}
                          </span>
                        </div>
                        <h3 className="dashboard-v2-atividade-descricao">{atividade.descricao}</h3>
                        <div className="dashboard-v2-atividade-rodape">
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
                <div className="dashboard-v2-estado-vazio">
                  <i className="fas fa-history"></i>
                  <p>Não existem atividades recentes</p>
                </div>
              )}
            </div>
            
            <div className="dashboard-v2-secao-rodape">
              <button className="dashboard-v2-botao-outline">
                <i className="fas fa-sync"></i> Carregar Mais
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardV2;