import React, { useState, useEffect } from 'react';
// Importar CSS
import "../styles/DashboardV2.css"; // Mudei para DashboardV2.css para corresponder ao nome do componente
// Importar Supabase
import { supabase } from '../services/supabaseClient'; // Adicionar importação do cliente Supabase

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

const DashboardV2: React.FC = () => {
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

  useEffect(() => {
    const carregarObras = async () => {
      try {
        const { data, error } = await supabase
          .from('obras')
          .select('*')
          .order('ultima_atualizacao', { ascending: false });
          
        if (error) {
          console.error('Erro ao carregar obras:', error.message);
          // Fallback para dados simulados
          setObras(apiSimulada.obterProjetos());
        } else {
          setObras(data || []);
        }
        
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

  useEffect(() => {
    const carregarDados = () => {
      setCarregando(true);
      
      try {
        if (obraAtiva) {
          localStorage.setItem('obraAtiva', obraAtiva.toString());
        } else {
          localStorage.removeItem('obraAtiva');
        }
        
        setResumoDados(apiSimulada.obterResumo(obraAtiva));
        setProjetos(apiSimulada.obterProjetos(obraAtiva));
        setAtividades(apiSimulada.obterAtividades(obraAtiva));
        setAcoes(apiSimulada.obterAcoes(obraAtiva));
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, [obraAtiva]);

  const handleMudancaObra = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setObraAtiva(valor === 'todas' ? undefined : parseInt(valor));
  };

  const concluirAcao = (id: number) => {
    try {
      const sucesso = apiSimulada.concluirAcao(id);
      if (sucesso) {
        setAcoes(acoes.filter(acao => acao.id !== id));
        setResumoDados({
          ...resumoDados,
          acoesPendentes: resumoDados.acoesPendentes - 1
        });
      }
    } catch (error) {
      console.error("Erro ao concluir ação:", error);
    }
  };

  if (carregando && !resumoDados.projetos) {
    return <div className="dashboard-v2-carregando">A carregar dados...</div>;
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

        {/* Outras cards */}
      </div>

      {/* Layout de Projetos e Ações Pendentes */}
    </div>
  );
};

export default DashboardV2;
