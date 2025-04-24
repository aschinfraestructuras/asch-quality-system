import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import "../styles/DashboardPro.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardCounts, getTarefasPendentes } from '../services/dashboardService';
import ProjetosChart from '../components/dashboard/charts/ProjetosChart';
import DocumentosChart from '../components/dashboard/charts/DocumentosChart';



// Interfaces para tipagem
interface KPIData {
  valor: number;
  label: string;
  subtitulo: string;
  variacao?: number; // Variação percentual em relação ao período anterior
  icone: string;
  cor: string;
}

interface ResumoDados {
  projetos: KPIData;
  documentos: KPIData;
  ensaios: KPIData;
  naoConformidades: KPIData;
  checklists: KPIData;
  materiais: KPIData;
}

interface Projeto {
  id: number;
  nome: string;
  progresso: number;
  status: string;
  ultimaAtualizacao: string;
  responsavel: string;
  tipo: string;
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

interface DadosGrafico {
  nome: string;
  valor: number;
  categoria?: string;
}

interface ProjetoProgress {
  nome: string;
  mes1: number;
  mes2: number;
  mes3: number;
  atual: number;
}

interface NaoConformidadeStats {
  categoria: string;
  abertas: number;
  fechadas: number;
  total: number;
}

// Dados simulados (usados como fallback quando o Supabase falha)
const dadosSimulados = {
  obterObras: (): Obra[] => [
    { id: 1, nome: 'Obra Ferroviária Setúbal' },
    { id: 2, nome: 'Ponte Vasco da Gama - Manutenção' },
    { id: 3, nome: 'Ampliação Terminal Portuário' },
    { id: 4, nome: 'Reabilitação Urbana Baixa' },
    { id: 5, nome: 'Metro de Lisboa - Expansão' }
  ],
  
  obterResumo: (obraId?: number): ResumoDados => {
    const resumoBase = {
      projetos: {
        valor: 7,
        label: "Projetos",
        subtitulo: "Ativos",
        variacao: 5,
        icone: "building",
        cor: "azul"
      },
      documentos: {
        valor: 124,
        label: "Documentos",
        subtitulo: "Total",
        variacao: 12,
        icone: "file-alt",
        cor: "ciano"
      },
      ensaios: {
        valor: 18,
        label: "Ensaios",
        subtitulo: "Em andamento",
        variacao: -3,
        icone: "flask",
        cor: "roxo"
      },
      naoConformidades: {
        valor: 5,
        label: "Não Conformidades",
        subtitulo: "Em aberto",
        variacao: -15,
        icone: "exclamation-triangle",
        cor: "vermelho"
      },
      checklists: {
        valor: 42,
        label: "Checklists",
        subtitulo: "Completados",
        variacao: 8,
        icone: "clipboard-check",
        cor: "verde"
      },
      materiais: {
        valor: 86,
        label: "Materiais",
        subtitulo: "Em estoque",
        variacao: 4,
        icone: "boxes",
        cor: "laranja"
      }
    };
    
    if (obraId) {
      // Ajustar dados para obra específica
      const fator = obraId / 2.5;
      return {
        projetos: {...resumoBase.projetos, valor: Math.max(1, Math.floor(resumoBase.projetos.valor / fator))},
        documentos: {...resumoBase.documentos, valor: Math.floor(resumoBase.documentos.valor / fator)},
        ensaios: {...resumoBase.ensaios, valor: Math.floor(resumoBase.ensaios.valor / fator)},
        naoConformidades: {...resumoBase.naoConformidades, valor: Math.floor(resumoBase.naoConformidades.valor / fator)},
        checklists: {...resumoBase.checklists, valor: Math.floor(resumoBase.checklists.valor / fator)},
        materiais: {...resumoBase.materiais, valor: Math.floor(resumoBase.materiais.valor / fator)}
      };
    }
    
    return resumoBase;
  },
  
  obterProjetos: (obraId?: number): Projeto[] => {
    const projetos = [
      { 
        id: 1, 
        nome: 'Obra Ferroviária Setúbal', 
        progresso: 75, 
        status: 'Em andamento',
        ultimaAtualizacao: '16/04/2025',
        responsavel: 'António Silva',
        tipo: 'Ferrovia'
      },
      { 
        id: 2, 
        nome: 'Ponte Vasco da Gama - Manutenção', 
        progresso: 30, 
        status: 'Planeado',
        ultimaAtualizacao: '15/04/2025',
        responsavel: 'Maria Gomes',
        tipo: 'Manutenção'
      },
      { 
        id: 3, 
        nome: 'Ampliação Terminal Portuário', 
        progresso: 45, 
        status: 'Em andamento',
        ultimaAtualizacao: '14/04/2025',
        responsavel: 'José Santos',
        tipo: 'Portuário'
      },
      { 
        id: 4, 
        nome: 'Reabilitação Urbana Baixa', 
        progresso: 15, 
        status: 'Iniciado',
        ultimaAtualizacao: '10/04/2025',
        responsavel: 'Ana Ferreira',
        tipo: 'Reabilitação'
      },
      { 
        id: 5, 
        nome: 'Metro de Lisboa - Expansão', 
        progresso: 60, 
        status: 'Em andamento',
        ultimaAtualizacao: '12/04/2025',
        responsavel: 'Pedro Costa',
        tipo: 'Metro'
      }
    ];
    
    if (obraId) {
      return projetos.filter(p => p.id === obraId);
    }
    
    return projetos;
  },
  
  obterAtividades: (obraId?: number): Atividade[] => {
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
      },
      { 
        id: 5, 
        tipo: 'material',
        descricao: 'Recepção de Aço CA-50', 
        data: '13/04/2025', 
        usuario: 'Teresa Lima',
        projeto: 'Metro de Lisboa - Expansão',
        resultado: 'Aprovado'
      },
      { 
        id: 6, 
        tipo: 'ensaio',
        descricao: 'Teste de Estanqueidade', 
        data: '12/04/2025', 
        usuario: 'Mário Ferreira',
        projeto: 'Reabilitação Urbana Baixa',
        resultado: 'Não Conforme'
      }
    ];
    
    if (obraId) {
      return atividades.filter(a => a.projeto.includes(obraId.toString()));
    }
    
    return atividades;
  },
  
  obterAcoes: (obraId?: number): Acao[] => {
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
      },
      {
        id: 4,
        descricao: 'Verificar certificação de material',
        tipo: 'material',
        prioridade: 'Baixa',
        prazo: '30/04/2025',
        responsavel: 'Teresa Lima'
      },
      {
        id: 5,
        descricao: 'Completar checklist de fundação',
        tipo: 'checklist',
        prioridade: 'Média',
        prazo: '22/04/2025',
        responsavel: 'Mário Ferreira'
      }
    ];
    
    if (obraId) {
      // Filtro simplificado para demonstração
      return acoes.slice(0, Math.max(2, acoes.length - obraId));
    }
    
    return acoes;
  },
  
  obterDadosGraficoEnsaios: (): DadosGrafico[] => [
    { nome: 'Betão', valor: 35 },
    { nome: 'Solo', valor: 22 },
    { nome: 'Aço', valor: 18 },
    { nome: 'Água', valor: 7 },
    { nome: 'Outros', valor: 8 }
  ],
  
  obterDadosProgressoMensal: (): ProjetoProgress[] => [
    { nome: 'Obra Ferroviária', mes1: 45, mes2: 60, mes3: 68, atual: 75 },
    { nome: 'Ponte Vasco da Gama', mes1: 10, mes2: 15, mes3: 22, atual: 30 },
    { nome: 'Terminal Portuário', mes1: 15, mes2: 28, mes3: 38, atual: 45 },
    { nome: 'Reab. Urbana', mes1: 0, mes2: 5, mes3: 10, atual: 15 },
    { nome: 'Metro Lisboa', mes1: 25, mes2: 40, mes3: 52, atual: 60 }
  ],
  
  obterNaoConformidadesStats: (): NaoConformidadeStats[] => [
    { categoria: 'Materiais', abertas: 2, fechadas: 8, total: 10 },
    { categoria: 'Execução', abertas: 3, fechadas: 12, total: 15 },
    { categoria: 'Projeto', abertas: 0, fechadas: 5, total: 5 },
    { categoria: 'Procedimentos', abertas: 1, fechadas: 7, total: 8 }
  ],
  
  concluirAcao: (id: number): boolean => {
    console.log(`Ação ${id} concluída`);
    return true;
  }
};

// Componente principal
const DashboardPro: React.FC = () => {
  // Estados
  const [obraAtiva, setObraAtiva] = useState<number | undefined>(undefined);
  const [visaoAtiva, setVisaoAtiva] = useState<string>('geral');
  const [obras, setObras] = useState<Obra[]>([]);
  const [resumoDados, setResumoDados] = useState<ResumoDados>({} as ResumoDados);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [acoes, setAcoes] = useState<Acao[]>([]);
  const [dadosEnsaios, setDadosEnsaios] = useState<DadosGrafico[]>([]);
  const [dadosProgresso, setDadosProgresso] = useState<ProjetoProgress[]>([]);
  const [dadosNC, setDadosNC] = useState<NaoConformidadeStats[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);
  const [modoOffline, setModoOffline] = useState<boolean>(false);
  
  // Estado do filtro de data
  const [filtroData, setFiltroData] = useState<string>('ultimos30dias');
  
  // Tipos de visualização de gráficos
  const [tipoGraficoEnsaios, setTipoGraficoEnsaios] = useState<string>('pizza');
  const [tipoGraficoProgresso, setTipoGraficoProgresso] = useState<string>('linha');
  const [tipoGraficoNC, setTipoGraficoNC] = useState<string>('barra');

// Novos estados do primeiro ficheiro
const [counts, setCounts] = useState({
  projetos: 0,
  documentos: 0,
  ensaios: 0,
  naoConformidades: 0,
  checklists: 0,
  materiais: 0
});

interface Tarefa {
  id: number;
  descricao: string;
  // Add other properties as needed
}

const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  // Efeito para carregar obras
  useEffect(() => {
    const carregarObras = async () => {
      try {
        setCarregando(true);
        setErroCarregamento(null);
        
        // Tentar obter dados do Supabase
        const { data, error } = await supabase
          .from('obras')
          .select('*')
          .order('ultima_atualizacao', { ascending: false });
          
        if (error) {
          console.warn('Erro ao carregar obras do Supabase:', error.message);
          // Fallback para dados simulados
          console.info('Utilizando dados simulados como fallback');
          setObras(dadosSimulados.obterObras());
          setModoOffline(true);
        } else {
          // Usar dados do Supabase se estiverem disponíveis
          if (data && data.length > 0) {
            setObras(data);
            setModoOffline(false);
          } else {
            console.info('Nenhum dado encontrado no Supabase, utilizando dados simulados como fallback');
            setObras(dadosSimulados.obterObras());
            setModoOffline(true);
          }
        }
        
        // Verificar localStorage
        const obraSalva = localStorage.getItem('obraAtiva');
        if (obraSalva) {
          setObraAtiva(parseInt(obraSalva));
        }
        
        // Verificar visualização salva
        const visaoSalva = localStorage.getItem('visaoAtiva');
        if (visaoSalva) {
          setVisaoAtiva(visaoSalva);
        }
        
        setCarregando(false);
      } catch (error) {
        console.error("Erro ao carregar obras:", error);
        setErroCarregamento("Não foi possível carregar os dados. Modo offline ativado.");
        // Fallback para dados simulados em caso de exceção
        setObras(dadosSimulados.obterObras());
        setModoOffline(true);
        setCarregando(false);
      }
    };
    
    carregarObras();
  }, []);

  // Efeito para carregar dados com base na obra selecionada
  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      
      try {
        // Salvar escolha no localStorage
        if (obraAtiva) {
          localStorage.setItem('obraAtiva', obraAtiva.toString());
        } else {
          localStorage.removeItem('obraAtiva');
        }
        
        try {
          // Adicionar estas linhas
          const countsData = await getDashboardCounts();
          const tarefasData = await getTarefasPendentes();
          
          setCounts(countsData);
          setTarefas(tarefasData);
        
          // Resto do código existente...
        } catch (error) {
          console.error("Erro ao carregar dados do dashboard:", error);
          setErroCarregamento("Erro ao carregar dados. Usando dados de demonstração.");
        } finally {
          setCarregando(false);
        }


        // Carregar dados (tenta Supabase primeiro, se falhar usa fallback)
        if (!modoOffline) {
          try {
            // Aqui implementaria a lógica para buscar dados do Supabase
            // Se houver erro, cairia no catch e usaria dados simulados
            
            // Exemplo (não implementado completamente):
            // const { data, error } = await supabase.from('resumo').select('*');
            // if (error) throw error;
            // setResumoDados(data);
            
            // Por simplicidade e sem acesso à sua estrutura Supabase,
            // vamos usar dados simulados para este exemplo
        
          } catch (error) {
            console.warn("Erro ao buscar dados do Supabase, usando fallback:", error);
            setModoOffline(true);
          }
        }
        
        // Usar dados simulados como fallback
        setResumoDados(dadosSimulados.obterResumo(obraAtiva));
        setProjetos(dadosSimulados.obterProjetos(obraAtiva));
        setAtividades(dadosSimulados.obterAtividades(obraAtiva));
        setAcoes(dadosSimulados.obterAcoes(obraAtiva));
        setDadosEnsaios(dadosSimulados.obterDadosGraficoEnsaios());
        setDadosProgresso(dadosSimulados.obterDadosProgressoMensal());
        setDadosNC(dadosSimulados.obterNaoConformidadesStats());
        
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        setErroCarregamento("Erro ao carregar dados. Usando dados de demonstração.");
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, [obraAtiva, modoOffline]);

  // Efeito para salvar visão ativa no localStorage
  useEffect(() => {
    localStorage.setItem('visaoAtiva', visaoAtiva);
  }, [visaoAtiva]);

  // Handler para mudança de obra
  const handleMudancaObra = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setObraAtiva(valor === 'todas' ? undefined : parseInt(valor));
  };

  // Função para concluir ação
  const concluirAcao = (id: number) => {
    try {
      const sucesso = dadosSimulados.concluirAcao(id);
      
      if (sucesso) {
        // Atualizar lista de ações
        setAcoes(acoes.filter(acao => acao.id !== id));
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
    { nome: 'Nova NC', icone: 'exclamation-triangle', link: '/nao-conformidades/nova' },
    { nome: 'Novo Material', icone: 'boxes', link: '/materiais/novo' }
  ];

  // Menus de navegação do dashboard
  const menusDashboard = [
    { id: 'geral', nome: 'Visão Geral', icone: 'home' },
    { id: 'projetos', nome: 'Projetos', icone: 'building' },
    { id: 'qualidade', nome: 'Qualidade', icone: 'check-circle' },
    { id: 'materiais', nome: 'Materiais', icone: 'boxes' },
    { id: 'analitico', nome: 'Analítico', icone: 'chart-bar' }
  ];

  // Renderizar componente de gráfico de acordo com o tipo selecionado
  const renderGraficoEnsaios = () => {
    return (
      <div className="dashboard-grafico-container">
        <div className="grafico-placeholder" data-tipo={tipoGraficoEnsaios}>
          {dadosEnsaios.map((item, index) => (
            <div 
              key={index} 
              className="grafico-item" 
              style={{ 
                height: `${(item.valor / Math.max(...dadosEnsaios.map(d => d.valor))) * 100}%`,
                width: tipoGraficoEnsaios === 'pizza' ? 'auto' : `${100 / dadosEnsaios.length}%`,
                backgroundColor: `var(--cor-${index + 1})`
              }}
              title={`${item.nome}: ${item.valor}`}
            >
              {tipoGraficoEnsaios !== 'pizza' && (
                <div className="grafico-label">
                  {item.nome}
                </div>
              )}
            </div>
          ))}
          
          {tipoGraficoEnsaios === 'pizza' && (
            <div className="grafico-legenda">
              {dadosEnsaios.map((item, index) => (
                <div key={index} className="legenda-item">
                  <span className="legenda-cor" style={{ backgroundColor: `var(--cor-${index + 1})` }}></span>
                  <span className="legenda-texto">{item.nome} ({item.valor})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGraficoProgresso = () => {
    return (
      <div className="dashboard-grafico-container">
        <div className="grafico-placeholder" data-tipo={tipoGraficoProgresso}>
          <div className="grafico-linhas-container">
            {dadosProgresso.map((projeto, index) => (
              <div key={index} className="grafico-linha">
                <div className="grafico-linha-label">{projeto.nome}</div>
                <div className="grafico-linha-valores">
                  <div className="grafico-ponto" style={{ left: '20%', height: `${projeto.mes1}%` }} title={`Janeiro: ${projeto.mes1}%`}></div>
                  <div className="grafico-ponto" style={{ left: '40%', height: `${projeto.mes2}%` }} title={`Fevereiro: ${projeto.mes2}%`}></div>
                  <div className="grafico-ponto" style={{ left: '60%', height: `${projeto.mes3}%` }} title={`Março: ${projeto.mes3}%`}></div>
                  <div className="grafico-ponto atual" style={{ left: '80%', height: `${projeto.atual}%` }} title={`Abril: ${projeto.atual}%`}></div>
                  
                  {tipoGraficoProgresso === 'linha' && (
                    <>
                      <div className="grafico-linha-path" style={{ 
                        background: `linear-gradient(90deg, 
                          transparent 20%, var(--cor-${index + 1}) 20%, 
                          var(--cor-${index + 1}) 22%, transparent 22%, 
                          transparent 40%, var(--cor-${index + 1}) 40%, 
                          var(--cor-${index + 1}) 42%, transparent 42%, 
                          transparent 60%, var(--cor-${index + 1}) 60%, 
                          var(--cor-${index + 1}) 62%, transparent 62%, 
                          transparent 80%, var(--cor-${index + 1}) 80%, 
                          var(--cor-${index + 1}) 82%, transparent 82%
                        )`,
                        backgroundSize: '100% 2px',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: `center ${100 - ((projeto.mes1 + projeto.mes2 + projeto.mes3 + projeto.atual) / 4)}%`
                      }}></div>
                    </>
                  )}
                </div>
                <div className="grafico-linha-valor">{projeto.atual}%</div>
              </div>
            ))}
          </div>
          
          <div className="grafico-eixo-x">
            <span>Jan</span>
            <span>Fev</span>
            <span>Mar</span>
            <span>Abr</span>
          </div>
        </div>
      </div>
    );
  };
  
  const renderGraficoNC = () => {
    return (
      <div className="dashboard-grafico-container">
        <div className="grafico-placeholder" data-tipo={tipoGraficoNC}>
          {dadosNC.map((item, index) => (
            <div key={index} className="grafico-nc-item">
              <div className="grafico-nc-label">{item.categoria}</div>
              <div className="grafico-nc-barras">
                <div 
                  className="grafico-nc-barra abertas" 
                  style={{ width: `${(item.abertas / item.total) * 100}%` }}
                  title={`Abertas: ${item.abertas}`}
                >
                  {item.abertas > 0 && <span>{item.abertas}</span>}
                </div>
                <div 
                  className="grafico-nc-barra fechadas" 
                  style={{ width: `${(item.fechadas / item.total) * 100}%` }}
                  title={`Fechadas: ${item.fechadas}`}
                >
                  {item.fechadas > 0 && <span>{item.fechadas}</span>}
                </div>
              </div>
              <div className="grafico-nc-total">{item.total}</div>
            </div>
          ))}
          
          <div className="grafico-nc-legenda">
            <div className="legenda-item">
              <span className="legenda-cor abertas"></span>
              <span className="legenda-texto">Abertas</span>
            </div>
            <div className="legenda-item">
              <span className="legenda-cor fechadas"></span>
              <span className="legenda-texto">Fechadas</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente de tela de carregamento
  if (carregando && !resumoDados.projetos) {
    return (
      <div className="dashboard-carregando">
        <div className="spinner"></div>
        <h2>A carregar dados do dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-pro">
   
      {erroCarregamento && (
        <div className="dashboard-erro-banner">
          <i className="fas fa-exclamation-circle"></i>
          {erroCarregamento}
        </div>
      )}
      
      {/* Cabeçalho e filtros */}
      <div className="dashboard-cabecalho">
        <div className="dashboard-titulo">
          <h1><i className="fas fa-tachometer-alt"></i> Dashboard</h1>
          <span className="dashboard-subtitulo">Gestão de Qualidade ASCH</span>
        </div>
        
        <div className="dashboard-filtros">
          <div className="filtro-obra">
            <label htmlFor="obra-select">Obra:</label>
            <select 
              id="obra-select"
              value={obraAtiva?.toString() || 'todas'} 
              onChange={handleMudancaObra}
              className="select-estilizado"
            >
              <option value="todas">Todas as Obras</option>
              {obras.map(obra => (
                <option key={obra.id} value={obra.id.toString()}>
                  {obra.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filtro-periodo">
            <label htmlFor="periodo-select">Período:</label>
            <select 
              id="periodo-select"
              value={filtroData} 
              onChange={(e) => setFiltroData(e.target.value)}
              className="select-estilizado"
            >
              <option value="ultimos7dias">Últimos 7 dias</option>
              <option value="ultimos30dias">Últimos 30 dias</option>
              <option value="ultimos90dias">Últimos 90 dias</option>
              <option value="esteMes">Este mês</option>
              <option value="esteAno">Este ano</option>
            </select>
          </div>
          
          <button className="botao-exportar">
            <i className="fas fa-file-export"></i> Exportar
          </button>
        </div>
      </div>
      
      {/* Navegação do Dashboard */}
      <div className="dashboard-navegacao">
        <ul className="dashboard-menu">
          {menusDashboard.map(menu => (
            <li key={menu.id}>
              <button 
                className={visaoAtiva === menu.id ? 'ativo' : ''}
                onClick={() => setVisaoAtiva(menu.id)}
              >
                <i className={`fas fa-${menu.icone}`}></i>
                <span>{menu.nome}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Botões de ação rápida */}
      <div className="dashboard-acoes-rapidas">
        {botoesAcaoRapida.map((botao, index) => (
          <Link key={index} to={botao.link} className="dashboard-botao-acao">
            <i className={`fas fa-${botao.icone}`}></i>
            <span>{botao.nome}</span>
          </Link>
        ))}
      </div>

      {/* Cards de KPI */}
      <div className="dashboard-kpi-cards">
        <div className={`dashboard-kpi-card ${resumoDados.projetos?.cor}`}>
          <div className="kpi-icone">
            <i className={`fas fa-${resumoDados.projetos?.icone}`}></i>
          </div>
          <div className="kpi-conteudo">
            <h3>{resumoDados.projetos?.label}</h3>
            <div className="kpi-valor">{resumoDados.projetos?.valor}</div>
            <div className="kpi-subtitulo">
              {resumoDados.projetos?.subtitulo}
              {resumoDados.projetos?.variacao !== undefined && (
                <span className={`kpi-variacao ${resumoDados.projetos.variacao >= 0 ? 'positiva' : 'negativa'}`}>
                  <i className={`fas fa-arrow-${resumoDados.projetos.variacao >= 0 ? 'up' : 'down'}`}></i>
                  {Math.abs(resumoDados.projetos.variacao)}%
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className={`dashboard-kpi-card ${resumoDados.documentos?.cor}`}>
          <div className="kpi-icone">
            <i className={`fas fa-${resumoDados.documentos?.icone}`}></i>
          </div>
          <div className="kpi-conteudo">
            <h3>{resumoDados.documentos?.label}</h3>
            <div className="kpi-valor">{resumoDados.documentos?.valor}</div>
            <div className="kpi-subtitulo">
              {resumoDados.documentos?.subtitulo}
              {resumoDados.documentos?.variacao !== undefined && (
                <span className={`kpi-variacao ${resumoDados.documentos.variacao >= 0 ? 'positiva' : 'negativa'}`}>
                  <i className={`fas fa-arrow-${resumoDados.documentos.variacao >= 0 ? 'up' : 'down'}`}></i>
                  {Math.abs(resumoDados.documentos.variacao)}%
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className={`dashboard-kpi-card ${resumoDados.ensaios?.cor}`}>
          <div className="kpi-icone">
            <i className={`fas fa-${resumoDados.ensaios?.icone}`}></i>
          </div>
          <div className="kpi-conteudo">
            <h3>{resumoDados.ensaios?.label}</h3>
            <div className="kpi-valor">{resumoDados.ensaios?.valor}</div>
            <div className="kpi-subtitulo">
              {resumoDados.ensaios?.subtitulo}
              {resumoDados.ensaios?.variacao !== undefined && (
                <span className={`kpi-variacao ${resumoDados.ensaios.variacao >= 0 ? 'positiva' : 'negativa'}`}>
                  <i className={`fas fa-arrow-${resumoDados.ensaios.variacao >= 0 ? 'up' : 'down'}`}></i>
                  {Math.abs(resumoDados.ensaios.variacao)}%
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className={`dashboard-kpi-card ${resumoDados.naoConformidades?.cor}`}>
          <div className="kpi-icone">
            <i className={`fas fa-${resumoDados.naoConformidades?.icone}`}></i>
          </div>
          <div className="kpi-conteudo">
            <h3>{resumoDados.naoConformidades?.label}</h3>
            <div className="kpi-valor">{resumoDados.naoConformidades?.valor}</div>
            <div className="kpi-subtitulo">
              {resumoDados.naoConformidades?.subtitulo}
              {resumoDados.naoConformidades?.variacao !== undefined && (
                <span className={`kpi-variacao ${resumoDados.naoConformidades.variacao >= 0 ? 'negativa' : 'positiva'}`}>
                  <i className={`fas fa-arrow-${resumoDados.naoConformidades.variacao >= 0 ? 'up' : 'down'}`}></i>
                  {Math.abs(resumoDados.naoConformidades.variacao)}%
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className={`dashboard-kpi-card ${resumoDados.checklists?.cor}`}>
          <div className="kpi-icone">
            <i className={`fas fa-${resumoDados.checklists?.icone}`}></i>
          </div>
          <div className="kpi-conteudo">
            <h3>{resumoDados.checklists?.label}</h3>
            <div className="kpi-valor">{resumoDados.checklists?.valor}</div>
            <div className="kpi-subtitulo">
              {resumoDados.checklists?.subtitulo}
              {resumoDados.checklists?.variacao !== undefined && (
                <span className={`kpi-variacao ${resumoDados.checklists.variacao >= 0 ? 'positiva' : 'negativa'}`}>
                  <i className={`fas fa-arrow-${resumoDados.checklists.variacao >= 0 ? 'up' : 'down'}`}></i>
                  {Math.abs(resumoDados.checklists.variacao)}%
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className={`dashboard-kpi-card ${resumoDados.materiais?.cor}`}>
          <div className="kpi-icone">
            <i className={`fas fa-${resumoDados.materiais?.icone}`}></i>
          </div>
          <div className="kpi-conteudo">
            <h3>{resumoDados.materiais?.label}</h3>
            <div className="kpi-valor">{resumoDados.materiais?.valor}</div>
            <div className="kpi-subtitulo">
              {resumoDados.materiais?.subtitulo}
              {resumoDados.materiais?.variacao !== undefined && (
                <span className={`kpi-variacao ${resumoDados.materiais.variacao >= 0 ? 'positiva' : 'negativa'}`}>
                  <i className={`fas fa-arrow-${resumoDados.materiais.variacao >= 0 ? 'up' : 'down'}`}></i>
                  {Math.abs(resumoDados.materiais.variacao)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    

      {/* Conteúdo principal - varia conforme a visão ativa */}
      <div className="dashboard-conteudo-principal">
        {/* Visão Geral */}
        {visaoAtiva === 'geral' && (
          <div className="dashboard-visao-geral">
            <div className="dashboard-projetos-section">
              <div className="dashboard-card">
                <div className="card-cabecalho">
                  <h2><i className="fas fa-building"></i> Projetos em Andamento</h2>
                  <div className="card-acoes">
                    <Link to="/projetos" className="link-ver-todos">Ver Todos</Link>
                    <Link to="/projetos/novo" className="botao-novo">
                      <i className="fas fa-plus"></i> Novo
                    </Link>
                  </div>
                </div>
                
                <div className="card-conteudo">
                  {projetos.length > 0 ? (
                    <div className="lista-projetos">
                      {projetos.map(projeto => (
                        <div key={projeto.id} className="projeto-item">
                          <div className="projeto-cabecalho">
                            <h3>{projeto.nome}</h3>
                            <span className={`badge status-${projeto.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {projeto.status}
                            </span>
                          </div>
                          
                          <div className="projeto-info">
                            <div className="info-item">
                              <i className="fas fa-user"></i> {projeto.responsavel}
                            </div>
                            <div className="info-item">
                              <i className="fas fa-tag"></i> {projeto.tipo}
                            </div>
                            <div className="info-item">
                              <i className="fas fa-calendar-alt"></i> {projeto.ultimaAtualizacao}
                            </div>
                          </div>
                          
                          <div className="projeto-progresso">
                            <div className="progresso-info">
                              <span>Progresso</span>
                              <span>{projeto.progresso}%</span>
                            </div>
                            <div className="progresso-barra-container">
                              <div 
                                className="progresso-barra" 
                                style={{ width: `${projeto.progresso}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="projeto-acoes">
                            <Link to={`/projetos/${projeto.id}`} className="botao-detalhes">
                              <i className="fas fa-eye"></i> Detalhes
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="estado-vazio">
                      <i className="fas fa-folder-open"></i>
                      <p>Não existem projetos ativos</p>
                      <Link to="/projetos/novo" className="botao-primario">
                        <i className="fas fa-plus"></i> Criar Projeto
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="dashboard-lado-direito">
              {/* Ações pendentes */}
              <div className="dashboard-card">
                <div className="card-cabecalho">
                  <h2><i className="fas fa-clock"></i> Ações Pendentes</h2>
                  <Link to="/acoes" className="link-ver-todos">Ver Todas</Link>
                </div>
                
                <div className="card-conteudo">
                  {acoes.length > 0 ? (
                    <div className="lista-acoes">
                      {acoes.map(acao => (
                        <div key={acao.id} className="acao-item">
                          <div className={`acao-prioridade ${acao.prioridade.toLowerCase()}`}>
                            {acao.prioridade}
                          </div>
                          <div className="acao-conteudo">
                            <h3>{acao.descricao}</h3>
                            <div className="acao-meta">
                              <span className="acao-tipo">
                                <i className={`fas fa-${
                                  acao.tipo === 'ensaio' ? 'flask' : 
                                  acao.tipo === 'documento' ? 'file-alt' : 
                                  acao.tipo === 'naoConformidade' ? 'exclamation-triangle' :
                                  acao.tipo === 'material' ? 'boxes' : 'tasks'
                                }`}></i> {acao.tipo}
                              </span>
                              <span className="acao-responsavel">
                                <i className="fas fa-user"></i> {acao.responsavel}
                              </span>
                              <span className="acao-prazo">
                                <i className="far fa-calendar-alt"></i> {acao.prazo}
                              </span>
                            </div>
                          </div>
                          <button 
                            className="botao-concluir" 
                            onClick={() => concluirAcao(acao.id)}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="estado-vazio">
                      <i className="fas fa-check-circle"></i>
                      <p>Não existem ações pendentes</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Atividades recentes */}
              <div className="dashboard-card">
                <div className="card-cabecalho">
                  <h2><i className="fas fa-history"></i> Atividades Recentes</h2>
                  <div className="filtro-tipo">
                    <select className="select-estilizado pequeno">
                      <option value="todos">Todos</option>
                      <option value="ensaio">Ensaios</option>
                      <option value="checklist">Checklists</option>
                      <option value="naoConformidade">Não Conformidades</option>
                      <option value="documento">Documentos</option>
                      <option value="material">Materiais</option>
                    </select>
                  </div>
                </div>
                
                <div className="card-conteudo">
                  {atividades.length > 0 ? (
                    <div className="lista-atividades">
                      {atividades.map(atividade => (
                        <div key={atividade.id} className={`atividade-item ${atividade.tipo}`}>
                          <div className="atividade-icone">
                            <i className={`fas fa-${
                              atividade.tipo === 'ensaio' ? 'flask' : 
                              atividade.tipo === 'checklist' ? 'clipboard-check' : 
                              atividade.tipo === 'naoConformidade' ? 'exclamation-triangle' : 
                              atividade.tipo === 'material' ? 'boxes' : 'file-alt'
                            }`}></i>
                          </div>
                          <div className="atividade-conteudo">
                            <div className="atividade-topo">
                              <span className="atividade-data">
                                <i className="far fa-calendar-alt"></i> {atividade.data}
                              </span>
                              <span className="atividade-usuario">
                                <i className="fas fa-user"></i> {atividade.usuario}
                              </span>
                            </div>
                            <h3 className="atividade-descricao">{atividade.descricao}</h3>
                            <div className="atividade-rodape">
                              <span className="atividade-projeto">
                                <i className="fas fa-building"></i> {atividade.projeto}
                              </span>
                              <span className={`badge ${atividade.resultado.toLowerCase().replace(/\s+/g, '-')}`}>
                                {atividade.resultado}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="estado-vazio">
                      <i className="fas fa-history"></i>
                      <p>Não existem atividades recentes</p>
                    </div>
                  )}
                </div>
                
                <div className="card-rodape">
                  <button className="botao-carregar-mais">
                    <i className="fas fa-sync"></i> Carregar Mais
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Visão de Projetos */}
        {visaoAtiva === 'projetos' && (
          <div className="dashboard-visao-projetos">
            <div className="dashboard-card grafico-card">
              <div className="card-cabecalho">
                <h2><i className="fas fa-chart-line"></i> Progresso dos Projetos</h2>
                <div className="controles-grafico">
                  <div className="tipo-grafico-selector">
                    <button 
                      className={tipoGraficoProgresso === 'barra' ? 'ativo' : ''}
                      onClick={() => setTipoGraficoProgresso('barra')}
                      title="Gráfico de Barras"
                    >
                      <i className="fas fa-chart-bar"></i>
                    </button>
                    <button 
                      className={tipoGraficoProgresso === 'linha' ? 'ativo' : ''}
                      onClick={() => setTipoGraficoProgresso('linha')}
                      title="Gráfico de Linha"
                    >
                      <i className="fas fa-chart-line"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="card-conteudo grafico">
                {renderGraficoProgresso()}
              </div>
              
              <div className="card-rodape grafico-legenda">
                <div className="legenda-info">
                  <strong>Progresso Médio:</strong> {
                    (dadosProgresso.reduce((sum, p) => sum + p.atual, 0) / dadosProgresso.length).toFixed(1)
                  }%
                </div>
                <div className="legenda-info">
                  <strong>Variação Mensal:</strong> +{
                    (
                      (dadosProgresso.reduce((sum, p) => sum + p.atual, 0) / dadosProgresso.length) -
                      (dadosProgresso.reduce((sum, p) => sum + p.mes3, 0) / dadosProgresso.length)
                    ).toFixed(1)
                  }%
                </div>
              </div>
            </div>
            
            <div className="dashboard-projetos-grid">
              {projetos.map(projeto => (
                <div key={projeto.id} className="projeto-card">
                  <div className="projeto-card-cabecalho">
                    <h3>{projeto.nome}</h3>
                    <span className={`badge status-${projeto.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {projeto.status}
                    </span>
                  </div>
                  
                  <div className="projeto-card-conteudo">
                    <div className="projeto-info-grid">
                      <div className="info-item">
                        <i className="fas fa-user"></i>
                        <div>
                          <span className="info-label">Responsável</span>
                          <span className="info-valor">{projeto.responsavel}</span>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <i className="fas fa-calendar-alt"></i>
                        <div>
                          <span className="info-label">Atualização</span>
                          <span className="info-valor">{projeto.ultimaAtualizacao}</span>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <i className="fas fa-tag"></i>
                        <div>
                          <span className="info-label">Tipo</span>
                          <span className="info-valor">{projeto.tipo}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="projeto-progresso">
                      <div className="progresso-info">
                        <span className="progresso-label">Progresso</span>
                        <span className="progresso-valor">{projeto.progresso}%</span>
                      </div>
                      <div className="progresso-barra-container">
                        <div 
                          className="progresso-barra" 
                          style={{ width: `${projeto.progresso}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="projeto-card-acoes">
                    <Link to={`/projetos/${projeto.id}`} className="botao-acoes">
                      <i className="fas fa-eye"></i> Detalhes
                    </Link>
                    <Link to={`/projetos/${projeto.id}/editar`} className="botao-acoes">
                      <i className="fas fa-edit"></i> Editar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Visão de Qualidade */}
        {visaoAtiva === 'qualidade' && (
          <div className="dashboard-visao-qualidade">
            <div className="dashboard-row">
              <div className="dashboard-card grafico-card">
                <div className="card-cabecalho">
                  <h2><i className="fas fa-exclamation-triangle"></i> Não Conformidades</h2>
                  <div className="controles-grafico">
                    <div className="tipo-grafico-selector">
                      <button 
                        className={tipoGraficoNC === 'barra' ? 'ativo' : ''}
                        onClick={() => setTipoGraficoNC('barra')}
                        title="Gráfico de Barras"
                      >
                        <i className="fas fa-chart-bar"></i>
                      </button>
                      <button 
                        className={tipoGraficoNC === 'pizza' ? 'ativo' : ''}
                        onClick={() => setTipoGraficoNC('pizza')}
                        title="Gráfico de Pizza"
                      >
                        <i className="fas fa-chart-pie"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="card-conteudo grafico">
                  {renderGraficoNC()}
                </div>
                
                <div className="card-rodape">
                  <div className="estatisticas-nc">
                    <div className="estatistica-item">
                      <span className="estatistica-numero">{
                        dadosNC.reduce((sum, nc) => sum + nc.total, 0)
                      }</span>
                      <span className="estatistica-label">Total</span>
                    </div>
                    <div className="estatistica-item">
                      <span className="estatistica-numero">{
                        dadosNC.reduce((sum, nc) => sum + nc.abertas, 0)
                      }</span>
                      <span className="estatistica-label">Abertas</span>
                    </div>
                    <div className="estatistica-item">
                      <span className="estatistica-numero">{
                        Math.round(
                          (dadosNC.reduce((sum, nc) => sum + nc.fechadas, 0) / 
                           dadosNC.reduce((sum, nc) => sum + nc.total, 0)) * 100
                        )
                      }%</span>
                      <span className="estatistica-label">Resolvidas</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="dashboard-card grafico-card">
                <div className="card-cabecalho">
                  <h2><i className="fas fa-flask"></i> Tipos de Ensaios</h2>
                  <div className="controles-grafico">
                    <div className="tipo-grafico-selector">
                      <button 
                        className={tipoGraficoEnsaios === 'barra' ? 'ativo' : ''}
                        onClick={() => setTipoGraficoEnsaios('barra')}
                        title="Gráfico de Barras"
                      >
                        <i className="fas fa-chart-bar"></i>
                      </button>
                      <button 
                        className={tipoGraficoEnsaios === 'pizza' ? 'ativo' : ''}
                        onClick={() => setTipoGraficoEnsaios('pizza')}
                        title="Gráfico de Pizza"
                      >
                        <i className="fas fa-chart-pie"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="card-conteudo grafico">
                  {renderGraficoEnsaios()}
                </div>
                
                <div className="card-rodape">
                  <div className="estatisticas-ensaios">
                    <div className="estatistica-item">
                      <span className="estatistica-numero">{
                        dadosEnsaios.reduce((sum, item) => sum + item.valor, 0)
                      }</span>
                      <span className="estatistica-label">Total</span>
                    </div>
                    <div className="estatistica-item">
                      <span className="estatistica-numero">{dadosEnsaios[0]?.nome}</span>
                      <span className="estatistica-label">Mais Frequente</span>
                    </div>
                    <div className="estatistica-item">
                      <span className="estatistica-numero">
                        {Math.round(
                          (dadosEnsaios[0]?.valor / dadosEnsaios.reduce((sum, item) => sum + item.valor, 0)) * 100
                        )}%
                      </span>
                      <span className="estatistica-label">Do Total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-card">
              <div className="card-cabecalho">
                <h2><i className="fas fa-clipboard-check"></i> Checklists em Andamento</h2>
                <Link to="/checklists" className="link-ver-todos">Ver Todos</Link>
              </div>
              
              <div className="card-conteudo">
                <div className="tabela-checklists">
                  <div className="tabela-cabecalho">
                    <div className="coluna">Título</div>
                    <div className="coluna">Projeto</div>
                    <div className="coluna">Responsável</div>
                    <div className="coluna">Data</div>
                    <div className="coluna">Progresso</div>
                    <div className="coluna">Ações                    </div>
                  </div>
                  
                  <div className="tabela-corpo">
                    <div className="tabela-linha">
                      <div className="coluna">Inspeção de Fundações</div>
                      <div className="coluna">Obra Ferroviária Setúbal</div>
                      <div className="coluna">Ricardo Pereira</div>
                      <div className="coluna">15/04/2025</div>
                      <div className="coluna">
                        <div className="progresso-mini">
                          <div className="progresso-barra" style={{ width: '75%' }}></div>
                          <span>75%</span>
                        </div>
                      </div>
                      <div className="coluna">
                        <Link to="/checklists/1" className="botao-mini">
                          <i className="fas fa-eye"></i>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="tabela-linha">
                      <div className="coluna">Verificação de Estrutura Metálica</div>
                      <div className="coluna">Terminal Portuário</div>
                      <div className="coluna">Ana Costa</div>
                      <div className="coluna">14/04/2025</div>
                      <div className="coluna">
                        <div className="progresso-mini">
                          <div className="progresso-barra" style={{ width: '45%' }}></div>
                          <span>45%</span>
                        </div>
                      </div>
                      <div className="coluna">
                        <Link to="/checklists/2" className="botao-mini">
                          <i className="fas fa-eye"></i>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="tabela-linha">
                      <div className="coluna">Impermeabilização de Cobertura</div>
                      <div className="coluna">Reabilitação Urbana</div>
                      <div className="coluna">José Martins</div>
                      <div className="coluna">12/04/2025</div>
                      <div className="coluna">
                        <div className="progresso-mini">
                          <div className="progresso-barra" style={{ width: '90%' }}></div>
                          <span>90%</span>
                        </div>
                      </div>
                      <div className="coluna">
                        <Link to="/checklists/3" className="botao-mini">
                          <i className="fas fa-eye"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Visão de Materiais */}
        {visaoAtiva === 'materiais' && (
          <div className="dashboard-visao-materiais">
            <div className="dashboard-card">
              <div className="card-cabecalho">
                <h2><i className="fas fa-boxes"></i> Materiais Recentes</h2>
                <Link to="/materiais" className="link-ver-todos">Ver Todos</Link>
              </div>
              
              <div className="card-conteudo">
                <div className="tabela-materiais">
                  <div className="tabela-cabecalho">
                    <div className="coluna">Material</div>
                    <div className="coluna">Fornecedor</div>
                    <div className="coluna">Projeto</div>
                    <div className="coluna">Data Recebimento</div>
                    <div className="coluna">Estado</div>
                    <div className="coluna">Ações</div>
                  </div>
                  
                  <div className="tabela-corpo">
                    <div className="tabela-linha">
                      <div className="coluna">Betão C30/37</div>
                      <div className="coluna">Cimpor</div>
                      <div className="coluna">Obra Ferroviária Setúbal</div>
                      <div className="coluna">16/04/2025</div>
                      <div className="coluna">
                        <span className="badge conforme">Aprovado</span>
                      </div>
                      <div className="coluna acoes">
                        <Link to="/materiais/1" className="botao-mini">
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link to="/materiais/1/certificacoes" className="botao-mini">
                          <i className="fas fa-certificate"></i>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="tabela-linha">
                      <div className="coluna">Aço A500</div>
                      <div className="coluna">Siderurgia Nacional</div>
                      <div className="coluna">Terminal Portuário</div>
                      <div className="coluna">14/04/2025</div>
                      <div className="coluna">
                        <span className="badge pendente">Pendente</span>
                      </div>
                      <div className="coluna acoes">
                        <Link to="/materiais/2" className="botao-mini">
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link to="/materiais/2/certificacoes" className="botao-mini">
                          <i className="fas fa-certificate"></i>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="tabela-linha">
                      <div className="coluna">Isolamento Térmico</div>
                      <div className="coluna">Iberfibran</div>
                      <div className="coluna">Reabilitação Urbana</div>
                      <div className="coluna">10/04/2025</div>
                      <div className="coluna">
                        <span className="badge conforme">Aprovado</span>
                      </div>
                      <div className="coluna acoes">
                        <Link to="/materiais/3" className="botao-mini">
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link to="/materiais/3/certificacoes" className="botao-mini">
                          <i className="fas fa-certificate"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-row">
              <div className="dashboard-card">
                <div className="card-cabecalho">
                  <h2><i className="fas fa-certificate"></i> Certificações Pendentes</h2>
                </div>
                
                <div className="analytics-content">
  <div className="charts-grid">
    <div className="chart-card">
      <h3>Distribuição de Projetos</h3>
      <ProjetosChart />
    </div>
    <div className="chart-card">
      <h3>Documentos por Tipo</h3>
      <DocumentosChart />
    </div>
  </div>
</div>



                <div className="card-conteudo">
                  <div className="lista-certificacoes">
                    <div className="certificacao-item">
                      <div className="certificacao-icon">
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <div className="certificacao-detalhes">
                        <h3>Certificado Qualidade - Aço A500</h3>
                        <div className="certificacao-meta">
                          <span><i className="fas fa-building"></i> Siderurgia Nacional</span>
                          <span><i className="fas fa-calendar-alt"></i> 14/04/2025</span>
                        </div>
                      </div>
                      <div className="certificacao-acoes">
                        <button className="botao-aprovar">
                          <i className="fas fa-check"></i> Aprovar
                        </button>
                        <button className="botao-rejeitar">
                          <i className="fas fa-times"></i> Rejeitar
                        </button>
                      </div>
                    </div>
                    
                    <div className="certificacao-item">
                      <div className="certificacao-icon">
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <div className="certificacao-detalhes">
                        <h3>Certificado Ambiental - Madeira</h3>
                        <div className="certificacao-meta">
                          <span><i className="fas fa-building"></i> Madeiras do Sul</span>
                          <span><i className="fas fa-calendar-alt"></i> 11/04/2025</span>
                        </div>
                      </div>
                      <div className="certificacao-acoes">
                        <button className="botao-aprovar">
                          <i className="fas fa-check"></i> Aprovar
                        </button>
                        <button className="botao-rejeitar">
                          <i className="fas fa-times"></i> Rejeitar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="dashboard-card">
                <div className="card-cabecalho">
                  <h2><i className="fas fa-exclamation-circle"></i> Alertas de Inventário</h2>
                </div>
                
                <div className="card-conteudo">
                  <div className="lista-alertas">
                    <div className="alerta-item nivel-critico">
                      <div className="alerta-icon">
                        <i className="fas fa-exclamation-triangle"></i>
                      </div>
                      <div className="alerta-detalhes">
                        <h3>Nível crítico: Betão C25/30</h3>
                        <div className="alerta-meta">
                          <span><i className="fas fa-cubes"></i> 2 m³ restantes</span>
                          <span><i className="fas fa-warehouse"></i> Armazém Principal</span>
                        </div>
                      </div>
                      <Link to="/materiais/inventario" className="botao-acoes">
                        <i className="fas fa-plus"></i> Solicitar
                      </Link>
                    </div>
                    
                    <div className="alerta-item nivel-baixo">
                      <div className="alerta-icon">
                        <i className="fas fa-arrow-down"></i>
                      </div>
                      <div className="alerta-detalhes">
                        <h3>Nível baixo: Tijolos Cerâmicos</h3>
                        <div className="alerta-meta">
                          <span><i className="fas fa-cubes"></i> 500 unidades restantes</span>
                          <span><i className="fas fa-warehouse"></i> Armazém Secundário</span>
                        </div>
                      </div>
                      <Link to="/materiais/inventario" className="botao-acoes">
                        <i className="fas fa-plus"></i> Solicitar
                      </Link>
                    </div>
                    
                    <div className="alerta-item nivel-aviso">
                      <div className="alerta-icon">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="alerta-detalhes">
                        <h3>Expiração próxima: Tinta de Exterior</h3>
                        <div className="alerta-meta">
                          <span><i className="fas fa-calendar-day"></i> Expira em 05/05/2025</span>
                          <span><i className="fas fa-warehouse"></i> Armazém Químicos</span>
                        </div>
                      </div>
                      <Link to="/materiais/inventario" className="botao-acoes">
                        <i className="fas fa-eye"></i> Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Visão Analítica */}
        {visaoAtiva === 'analitico' && (
          <div className="dashboard-visao-analitica">
            <div className="dashboard-row">
              <div className="dashboard-card">
                <div className="card-cabecalho">
                  <h2><i className="fas fa-chart-line"></i> Tendências de Qualidade</h2>
                  <div className="card-acoes">
                    <button className="botao-exportar-pequeno">
                      <i className="fas fa-file-export"></i> Excel
                    </button>
                    <button className="botao-exportar-pequeno">
                      <i className="fas fa-file-pdf"></i> PDF
                    </button>
                  </div>
                </div>
                
                <div className="card-conteudo tendencias-qualidade">
                  <div className="tendencia-item melhoria">
                    <div className="tendencia-valor">-15%</div>
                    <div className="tendencia-detalhes">
                      <h3>Não Conformidades</h3>
                      <p>Redução de 15% em comparação ao período anterior</p>
                    </div>
                    <div className="tendencia-icone">
                      <i className="fas fa-arrow-down"></i>
                    </div>
                  </div>
                  
                  <div className="tendencia-item melhoria">
                    <div className="tendencia-valor">+8%</div>
                    <div className="tendencia-detalhes">
                      <h3>Checklists Concluídos</h3>
                      <p>Aumento de 8% em comparação ao período anterior</p>
                    </div>
                    <div className="tendencia-icone">
                      <i className="fas fa-arrow-up"></i>
                    </div>
                  </div>
                  
                  <div className="tendencia-item piora">
                    <div className="tendencia-valor">-3%</div>
                    <div className="tendencia-detalhes">
                      <h3>Ensaios Conformes</h3>
                      <p>Redução de 3% em comparação ao período anterior</p>
                    </div>
                    <div className="tendencia-icone">
                      <i className="fas fa-arrow-down"></i>
                    </div>
                  </div>
                  
                  <div className="tendencia-item melhoria">
                    <div className="tendencia-valor">+4%</div>
                    <div className="tendencia-detalhes">
                      <h3>Materiais Certificados</h3>
                      <p>Aumento de 4% em comparação ao período anterior</p>
                    </div>
                    <div className="tendencia-icone">
                      <i className="fas fa-arrow-up"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-row kpi-avancados">
              <div className="kpi-avancado">
                <div className="kpi-avancado-titulo">Taxa de Conformidade</div>
                <div className="kpi-avancado-valor">92%</div>
                <div className="kpi-avancado-grafico">
                  <div className="grafico-circular">
                    <svg viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="2"
                        strokeDasharray="100, 100"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#4caf50"
                        strokeWidth="2"
                        strokeDasharray="92, 100"
                        className="circularChart"
                      />
                    </svg>
                  </div>
                </div>
                <div className="kpi-avancado-descricao">Percentagem de ensaios e inspeções com resultado conforme</div>
              </div>
              
              <div className="kpi-avancado">
                <div className="kpi-avancado-titulo">Eficiência de Resolução</div>
                <div className="kpi-avancado-valor">85%</div>
                <div className="kpi-avancado-grafico">
                  <div className="grafico-circular">
                    <svg viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="2"
                        strokeDasharray="100, 100"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#2196f3"
                        strokeWidth="2"
                        strokeDasharray="85, 100"
                        className="circularChart"
                      />
                    </svg>
                  </div>
                </div>
                <div className="kpi-avancado-descricao">Percentagem de não conformidades resolvidas dentro do prazo</div>
              </div>
              
              <div className="kpi-avancado">
                <div className="kpi-avancado-titulo">Qualidade de Materiais</div>
                <div className="kpi-avancado-valor">97%</div>
                <div className="kpi-avancado-grafico">
                  <div className="grafico-circular">
                    <svg viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="2"
                        strokeDasharray="100, 100"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#ff9800"
                        strokeWidth="2"
                        strokeDasharray="97, 100"
                        className="circularChart"
                      />
                    </svg>
                  </div>
                </div>
                <div className="kpi-avancado-descricao">Percentagem de materiais aprovados em inspeções de recebimento</div>
              </div>
              
              <div className="kpi-avancado">
                <div className="kpi-avancado-titulo">Cumprimento de Prazos</div>
                <div className="kpi-avancado-valor">78%</div>
                <div className="kpi-avancado-grafico">
                  <div className="grafico-circular">
                    <svg viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="2"
                        strokeDasharray="100, 100"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#9c27b0"
                        strokeWidth="2"
                        strokeDasharray="78, 100"
                        className="circularChart"
                      />
                    </svg>
                  </div>
                </div>
                <div className="kpi-avancado-descricao">Percentagem de projetos em dia com o cronograma planejado</div>
              </div>
            </div>
            
            <div className="dashboard-card">
              <div className="card-cabecalho">
                <h2><i className="fas fa-list-ol"></i> Ranking de Projetos por Qualidade</h2>
              </div>
              
              <div className="card-conteudo">
                <div className="tabela-ranking">
                  <div className="tabela-cabecalho">
                    <div className="coluna">Posição</div>
                    <div className="coluna">Projeto</div>
                    <div className="coluna">Score de Qualidade</div>
                    <div className="coluna">Status</div>
                    <div className="coluna">Variação</div>
                    <div className="coluna">Ações</div>
                  </div>
                  
                  <div className="tabela-corpo">
                    <div className="tabela-linha">
                      <div className="coluna posicao">1</div>
                      <div className="coluna">Reabilitação Urbana Baixa</div>
                      <div className="coluna">
                        <div className="score-qualidade excelente">94</div>
                      </div>
                      <div className="coluna">
                        <span className="badge status-iniciado">Iniciado</span>
                      </div>
                      <div className="coluna">
                        <span className="variacao positiva">
                          <i className="fas fa-arrow-up"></i> 3
                        </span>
                      </div>
                      <div className="coluna">
                        <Link to="/projetos/4" className="botao-mini">
                          <i className="fas fa-eye"></i>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="tabela-linha">
                      <div className="coluna posicao">2</div>
                      <div className="coluna">Ponte Vasco da Gama - Manutenção</div>
                      <div className="coluna">
                        <div className="score-qualidade muito-bom">89</div>
                      </div>
                      <div className="coluna">
                        <span className="badge status-planeado">Planeado</span>
                      </div>
                      <div className="coluna">
                        <span className="variacao negativa">
                          <i className="fas fa-arrow-down"></i> 1
                        </span>
                      </div>
                      <div className="coluna">
                        <Link to="/projetos/2" className="botao-mini">
                          <i className="fas fa-eye"></i>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="tabela-linha">
                      <div className="coluna posicao">3</div>
                      <div className="coluna">Metro de Lisboa - Expansão</div>
                      <div className="coluna">
                        <div className="score-qualidade bom">86</div>
                      </div>
                      <div className="coluna">
                        <span className="badge status-em-andamento">Em andamento</span>
                      </div>
                      <div className="coluna">
                        <span className="variacao positiva">
                          <i className="fas fa-arrow-up"></i> 1
                        </span>
                      </div>
                      <div className="coluna">
                        <Link to="/projetos/5" className="botao-mini">
                          <i className="fas fa-eye"></i>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="tabela-linha">
                      <div className="coluna posicao">4</div>
                      <div className="coluna">Obra Ferroviária Setúbal</div>
                      <div className="coluna">
                        <div className="score-qualidade bom">82</div>
                      </div>
                      <div className="coluna">
                        <span className="badge status-em-andamento">Em andamento</span>
                      </div>
                      <div className="coluna">
                        <span className="variacao negativa">
                          <i className="fas fa-arrow-down"></i> 2
                        </span>
                      </div>
                      <div className="coluna">
                        <Link to="/projetos/1" className="botao-mini">
                          <i className="fas fa-eye"></i>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="tabela-linha">
                      <div className="coluna posicao">5</div>
                      <div className="coluna">Ampliação Terminal Portuário</div>
                      <div className="coluna">
                        <div className="score-qualidade razoavel">75</div>
                      </div>
                      <div className="coluna">
                        <span className="badge status-em-andamento">Em andamento</span>
                      </div>
                      <div className="coluna">
                        <span className="variacao neutra">
                          <i className="fas fa-minus"></i> 0
                        </span>
                      </div>
                      <div className="coluna">
                        <Link to="/projetos/3" className="botao-mini">
                          <i className="fas fa-eye"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPro;
