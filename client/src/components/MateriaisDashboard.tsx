import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { MaterialDashboardStats, MaterialMovimentacao } from '../interfaces/MaterialInterfaces';
import '../styles/MateriaisDashboard.css';

const MateriaisDashboard: React.FC = () => {
  const [stats, setStats] = useState<MaterialDashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [periodoFiltro, setPeriodoFiltro] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [categorias, setCategorias] = useState<string[]>([]);
  const [obraFiltro, setObraFiltro] = useState<number | null>(null);
  const [obras, setObras] = useState<{id: number, nome: string}[]>([]);
  
  // Carregar dados do dashboard
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      
      try {
        // Carregar estatísticas do dashboard
        let query = supabase.rpc('get_materiais_stats', {
          periodo: periodoFiltro,
          categoria: categoriaFiltro === 'todas' ? null : categoriaFiltro,
          obra_id: obraFiltro
        });
        
        const { data, error } = await query;
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data) {
          setStats(data as MaterialDashboardStats);
        }
        
        // Carregar lista de categorias para filtro
        const { data: categoriasData, error: categoriasError } = await supabase
          .from('materiais')
          .select('categoria')
          .order('categoria');
        
        if (categoriasError) {
          console.error('Erro ao carregar categorias:', categoriasError);
        } else if (categoriasData) {
          // Extrair categorias únicas
          const uniqueCategorias = Array.from(new Set(categoriasData.map(item => item.categoria)));
          setCategorias(uniqueCategorias);
        }
        
        // Carregar lista de obras para filtro
        const { data: obrasData, error: obrasError } = await supabase
          .from('obras')
          .select('id, nome')
          .order('nome');
        
        if (obrasError) {
          console.error('Erro ao carregar obras:', obrasError);
        } else if (obrasData) {
          setObras(obrasData as {id: number, nome: string}[]);
        }
        
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocorreu um erro ao carregar as estatísticas');
        }
        console.error('Erro:', err);
        
        // Dados simulados para desenvolvimento
        setStats({
          total_materiais: 156,
          materiais_por_categoria: [
            { categoria: 'Betão', quantidade: 15 },
            { categoria: 'Aço', quantidade: 28 },
            { categoria: 'Alvenaria', quantidade: 32 },
            { categoria: 'Pintura', quantidade: 18 },
            { categoria: 'Estrutura Metálica', quantidade: 12 },
            { categoria: 'Madeira', quantidade: 9 },
            { categoria: 'Cobertura', quantidade: 7 },
            { categoria: 'Impermeabilização', quantidade: 5 },
            { categoria: 'Outros', quantidade: 30 }
          ],
          valor_total_inventario: 754250.85,
          itens_abaixo_estoque_minimo: 12,
          requisicoes_pendentes: 8,
          certificacoes_a_expirar: 5,
          nao_conformidades_abertas: 3,
          ultimas_movimentacoes: [
            {
              id: 1,
              data: '2025-04-15',
              tipo: 'entrada',
              material_id: 1,
              material_nome: 'Betão C30/37',
              quantidade: 50,
              origem: 'BetãoLisboa, Lda.',
              destino: 'Obra Ferroviária Setúbal',
              responsavel: 'João Silva',
              observacoes: 'Entrega programada'
            },
            {
              id: 2,
              data: '2025-04-14',
              tipo: 'saída',
              material_id: 2,
              material_nome: 'Aço A500 NR',
              quantidade: 2500,
              origem: 'Armazém Principal',
              destino: 'Obra Ferroviária Setúbal',
              responsavel: 'Ana Costa',
              observacoes: 'Para armaduras de fundações'
            },
            {
              id: 3,
              data: '2025-04-12',
              tipo: 'ajuste',
              material_id: 3,
              material_nome: 'Tijolo cerâmico 30x20x15',
              quantidade: -25,
              destino: 'Obra Ponte Vasco da Gama',
              responsavel: 'Ricardo Pereira',
              observacoes: 'Ajuste por quebra'
            },
            {
              id: 4,
              data: '2025-04-10',
              tipo: 'transferência',
              material_id: 5,
              material_nome: 'Perfil IPE 200',
              quantidade: 15,
              origem: 'Armazém Principal',
              destino: 'Obra Ampliação Terminal Portuário',
              responsavel: 'Carlos Oliveira',
              observacoes: 'Transferência entre obras'
            },
            {
              id: 5,
              data: '2025-04-08',
              tipo: 'entrada',
              material_id: 4,
              material_nome: 'Tinta acrílica branca',
              quantidade: 75,
              origem: 'Tintas & Cores, S.A.',
              destino: 'Armazém Principal',
              responsavel: 'João Silva',
              observacoes: 'Reposição de stock'
            }
          ]
        });
        
        // Categorias simuladas
        setCategorias(['Betão', 'Aço', 'Alvenaria', 'Pintura', 'Estrutura Metálica', 'Madeira', 'Cobertura', 'Impermeabilização', 'Outros']);
        
        // Obras simuladas
        setObras([
          { id: 1, nome: 'Obra Ferroviária Setúbal' },
          { id: 2, nome: 'Ponte Vasco da Gama - Manutenção' },
          { id: 3, nome: 'Ampliação Terminal Portuário' },
          { id: 4, nome: 'Reabilitação Urbana Baixa' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, [periodoFiltro, categoriaFiltro, obraFiltro]);
  
  // Manipuladores para filtros
  const handlePeriodoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriodoFiltro(e.target.value as '7d' | '30d' | '90d' | '12m');
  };
  
  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoriaFiltro(e.target.value);
  };
  
  const handleObraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setObraFiltro(valor === 'todas' ? null : parseInt(valor));
  };
  
  // Formatação de valores
  const formatarValor = (valor: number): string => {
    return valor.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
  };
  
  // Renderizar ícone baseado no tipo de movimentação
  const renderizarIconeMovimentacao = (tipo: string): JSX.Element => {
    switch (tipo) {
      case 'entrada':
        return <i className="fas fa-arrow-circle-down" style={{ color: 'var(--success-color)' }}></i>;
      case 'saída':
        return <i className="fas fa-arrow-circle-up" style={{ color: 'var(--danger-color)' }}></i>;
      case 'transferência':
        return <i className="fas fa-exchange-alt" style={{ color: 'var(--info-color)' }}></i>;
      case 'ajuste':
        return <i className="fas fa-balance-scale" style={{ color: 'var(--warning-color)' }}></i>;
      default:
        return <i className="fas fa-question-circle"></i>;
    }
  };
  
  // Obter classe CSS baseada no tipo de movimentação
  const obterClasseMovimentacao = (tipo: string): string => {
    switch (tipo) {
      case 'entrada':
        return 'movimento-entrada';
      case 'saída':
        return 'movimento-saida';
      case 'transferência':
        return 'movimento-transferencia';
      case 'ajuste':
        return 'movimento-ajuste';
      default:
        return '';
    }
  };
  
  if (loading && !stats) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>A carregar estatísticas de materiais...</p>
      </div>
    );
  }
  
  return (
    <div className="materiais-dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Dashboard de Materiais</h2>
          <p>Estatísticas e análises do módulo de materiais</p>
        </div>
        
        <div className="dashboard-filters">
          <div className="filter-group">
            <label htmlFor="periodo-filtro">Período:</label>
            <select 
              id="periodo-filtro" 
              value={periodoFiltro}
              onChange={handlePeriodoChange}
              className="select-filtro"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="12m">Últimos 12 meses</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="categoria-filtro">Categoria:</label>
            <select 
              id="categoria-filtro" 
              value={categoriaFiltro}
              onChange={handleCategoriaChange}
              className="select-filtro"
            >
              <option value="todas">Todas as Categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="obra-filtro">Obra:</label>
            <select 
              id="obra-filtro" 
              value={obraFiltro?.toString() || 'todas'}
              onChange={handleObraChange}
              className="select-filtro"
            >
              <option value="todas">Todas as Obras</option>
              {obras.map((obra) => (
                <option key={obra.id} value={obra.id.toString()}>
                  {obra.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      {stats && (
        <>
          {/* Cards de resumo */}
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <div className="card-icon">
                <i className="fas fa-boxes"></i>
              </div>
              <div className="card-content">
                <h3>Total de Materiais</h3>
                <div className="card-value">{stats.total_materiais}</div>
                <span className="card-subtitle">Materiais cadastrados</span>
              </div>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <i className="fas fa-euro-sign"></i>
              </div>
              <div className="card-content">
                <h3>Valor do Inventário</h3>
                <div className="card-value">{formatarValor(stats.valor_total_inventario)}</div>
                <span className="card-subtitle">Total em stock</span>
              </div>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon warning">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <div className="card-content">
                <h3>Itens Abaixo do Mínimo</h3>
                <div className="card-value">{stats.itens_abaixo_estoque_minimo}</div>
                <span className="card-subtitle">Necessitam reposição</span>
              </div>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon info">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <div className="card-content">
                <h3>Requisições Pendentes</h3>
                <div className="card-value">{stats.requisicoes_pendentes}</div>
                <span className="card-subtitle">Aguardando aprovação</span>
              </div>
            </div>
          </div>
          
          <div className="dashboard-row">
            {/* Gráfico de materiais por categoria */}
            <div className="dashboard-chart-container">
              <div className="chart-header">
                <h3>Materiais por Categoria</h3>
              </div>
              <div className="categories-chart">
                {stats.materiais_por_categoria.map((item, index) => (
                  <div key={item.categoria} className="category-bar-container">
                    <div className="category-bar-label">{item.categoria}</div>
                    <div className="category-bar-wrapper">
                      <div 
                        className="category-bar" 
                        style={{ 
                          width: `${(item.quantidade / Math.max(...stats.materiais_por_categoria.map(c => c.quantidade))) * 100}%`,
                          backgroundColor: `hsl(${(index * 25) % 360}, 70%, 50%)`
                        }}
                      ></div>
                      <span className="category-value">{item.quantidade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Indicadores e alertas */}
            <div className="dashboard-alerts-container">
              <div className="alerts-header">
                <h3>Alertas e Indicadores</h3>
              </div>
              
              <div className="alerts-content">
                <div className="alert-item">
                  <div className="alert-icon warning">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <div className="alert-details">
                    <h4>Itens Abaixo do Stock Mínimo</h4>
                    <p>{stats.itens_abaixo_estoque_minimo} materiais necessitam reposição urgente</p>
                    <Link to="/materiais/inventario" className="alert-link">Ver Detalhes</Link>
                  </div>
                </div>
                
                <div className="alert-item">
                  <div className="alert-icon info">
                    <i className="fas fa-certificate"></i>
                  </div>
                  <div className="alert-details">
                    <h4>Certificações a Expirar</h4>
                    <p>{stats.certificacoes_a_expirar} certificações expiram nos próximos 30 dias</p>
                    <Link to="/materiais/certificacoes" className="alert-link">Ver Detalhes</Link>
                  </div>
                </div>
                
                <div className="alert-item">
                  <div className="alert-icon danger">
                    <i className="fas fa-exclamation-circle"></i>
                  </div>
                  <div className="alert-details">
                    <h4>Não Conformidades Abertas</h4>
                    <p>{stats.nao_conformidades_abertas} não conformidades aguardam resolução</p>
                    <Link to="/materiais/rastreabilidade" className="alert-link">Ver Detalhes</Link>
                  </div>
                </div>
                
                <div className="alert-item">
                  <div className="alert-icon primary">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <div className="alert-details">
                    <h4>Requisições Pendentes</h4>
                    <p>{stats.requisicoes_pendentes} requisições aguardam aprovação</p>
                    <Link to="/materiais/requisicoes" className="alert-link">Ver Detalhes</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Últimas movimentações */}
          <div className="dashboard-movimentacoes">
            <div className="movimentacoes-header">
              <h3>Últimas Movimentações</h3>
              <Link to="/materiais/movimentacoes" className="btn-secondary">
                Ver Todas
              </Link>
            </div>
            
            <div className="movimentacoes-table">
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Material</th>
                    <th>Quantidade</th>
                    <th>Origem</th>
                    <th>Destino</th>
                    <th>Responsável</th>
                    <th>Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.ultimas_movimentacoes.map((movimento) => (
                    <tr key={movimento.id} className={obterClasseMovimentacao(movimento.tipo)}>
                      <td>{movimento.data}</td>
                      <td>
                        <div className="movimento-tipo">
                          {renderizarIconeMovimentacao(movimento.tipo)}
                          <span>{movimento.tipo.charAt(0).toUpperCase() + movimento.tipo.slice(1)}</span>
                        </div>
                      </td>
                      <td>
                        <Link to={`/materiais/${movimento.material_id}`}>
                          {movimento.material_nome}
                        </Link>
                      </td>
                      <td className={`quantidade ${movimento.tipo === 'saída' || (movimento.tipo === 'ajuste' && movimento.quantidade < 0) ? 'negativo' : 'positivo'}`}>
                        {Math.abs(movimento.quantidade)}
                      </td>
                      <td>{movimento.origem || '-'}</td>
                      <td>{movimento.destino || '-'}</td>
                      <td>{movimento.responsavel}</td>
                      <td>{movimento.observacoes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Ações rápidas */}
          <div className="dashboard-acoes-rapidas">
            <h3>Ações Rápidas</h3>
            <div className="acoes-grid">
              <Link to="/materiais/novo" className="acao-card">
                <div className="acao-icon">
                  <i className="fas fa-plus-circle"></i>
                </div>
                <div className="acao-texto">
                  <h4>Novo Material</h4>
                  <p>Adicionar um novo material ao sistema</p>
                </div>
              </Link>
              
              <Link to="/materiais/inventario" className="acao-card">
                <div className="acao-icon">
                  <i className="fas fa-clipboard-list"></i>
                </div>
                <div className="acao-texto">
                  <h4>Gestão de Stock</h4>
                  <p>Controlar entradas e saídas de stock</p>
                </div>
              </Link>
              
              <Link to="/materiais/requisicoes" className="acao-card">
                <div className="acao-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="acao-texto">
                  <h4>Requisições</h4>
                  <p>Gerir requisições de materiais</p>
                </div>
              </Link>
              
              <Link to="/materiais/reports" className="acao-card">
                <div className="acao-icon">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <div className="acao-texto">
                  <h4>Relatórios</h4>
                  <p>Gerar relatórios personalizados</p>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MateriaisDashboard;
