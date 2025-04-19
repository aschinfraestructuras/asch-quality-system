import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import '../styles/MateriaisReports.css';

const MateriaisReports: React.FC = () => {
  // Estados para os relatórios
  const [reportType, setReportType] = useState<string>('inventario');
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Filtros para relatórios
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string[]>([]);
  const [obraFiltro, setObraFiltro] = useState<number[]>([]);
  const [fornecedorFiltro, setFornecedorFiltro] = useState<number[]>([]);
  const [formato, setFormato] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  
  // Opções para os selects
  const [categorias, setCategorias] = useState<string[]>([]);
  const [obras, setObras] = useState<{id: number, nome: string}[]>([]);
  const [fornecedores, setFornecedores] = useState<{id: number, nome: string}[]>([]);
  
  // Definição dos tipos de relatórios disponíveis
  const reportTypes = [
    { id: 'inventario', name: 'Inventário de Materiais', description: 'Lista completa de materiais com detalhes de stock atual' },
    { id: 'movimentacoes', name: 'Movimentações de Stock', description: 'Registo de entradas, saídas e transferências de materiais' },
    { id: 'requisicoes', name: 'Requisições de Materiais', description: 'Histórico de requisições de materiais por obra/projeto' },
    { id: 'fornecedores', name: 'Análise de Fornecedores', description: 'Comparativo de fornecedores, preços e entregas' },
    { id: 'certificacoes', name: 'Certificações de Materiais', description: 'Estado das certificações por material' },
    { id: 'nao_conformidades', name: 'Não Conformidades', description: 'Registo de não conformidades por material e fornecedor' },
    { id: 'lotes', name: 'Rastreabilidade de Lotes', description: 'Histórico de lotes e sua aplicação em obra' },
    { id: 'consumo', name: 'Análise de Consumo', description: 'Estatísticas de consumo de materiais por período' }
  ];
  
  // Carregar dados para os filtros
  useEffect(() => {
    const carregarDadosFiltros = async () => {
      try {
        // Carregar categorias
        const { data: categoriasData, error: categoriasError } = await supabase
          .from('materiais')
          .select('categoria')
          .order('categoria');
        
        if (categoriasError) {
          console.error('Erro ao carregar categorias:', categoriasError);
        } else if (categoriasData) {
          const uniqueCategorias = Array.from(new Set(categoriasData.map(item => item.categoria)));
          setCategorias(uniqueCategorias);
        }
        
        // Carregar obras
        const { data: obrasData, error: obrasError } = await supabase
          .from('obras')
          .select('id, nome')
          .order('nome');
        
        if (obrasError) {
          console.error('Erro ao carregar obras:', obrasError);
        } else if (obrasData) {
          setObras(obrasData as {id: number, nome: string}[]);
        }
        
        // Carregar fornecedores
        const { data: fornecedoresData, error: fornecedoresError } = await supabase
          .from('fornecedores')
          .select('id, nome')
          .order('nome');
        
        if (fornecedoresError) {
          console.error('Erro ao carregar fornecedores:', fornecedoresError);
        } else if (fornecedoresData) {
          setFornecedores(fornecedoresData as {id: number, nome: string}[]);
        }
      } catch (err) {
        console.error('Erro ao carregar dados para filtros:', err);
        
        // Dados simulados para desenvolvimento
        setCategorias(['Betão', 'Aço', 'Alvenaria', 'Pintura', 'Estrutura Metálica', 'Madeira', 'Cobertura', 'Impermeabilização']);
        
        setObras([
          { id: 1, nome: 'Obra Ferroviária Setúbal' },
          { id: 2, nome: 'Ponte Vasco da Gama - Manutenção' },
          { id: 3, nome: 'Ampliação Terminal Portuário' },
          { id: 4, nome: 'Reabilitação Urbana Baixa' }
        ]);
        
        setFornecedores([
          { id: 1, nome: 'BetãoLisboa, Lda.' },
          { id: 2, nome: 'Cimentos do Tejo, S.A.' },
          { id: 3, nome: 'Aços & Varões, Lda.' },
          { id: 4, nome: 'Tintas & Cores, S.A.' },
          { id: 5, nome: 'Cerâmicas do Norte, S.A.' }
        ]);
      }
    };
    
    carregarDadosFiltros();
    
    // Inicializar datas para o período selecionado
    updateDateRange(dateRange);
  }, []);
  
  // Atualizar intervalo de datas quando o período muda
  const updateDateRange = (range: '7d' | '30d' | '90d' | 'custom') => {
    const endDate = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case 'custom':
        // Não altera as datas para personalizado
        return;
    }
    
    setStartDate(startDate.toISOString().split('T')[0]);
    setEndDate(endDate.toISOString().split('T')[0]);
  };
  
  // Handler para mudança de período
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRange = e.target.value as '7d' | '30d' | '90d' | 'custom';
    setDateRange(newRange);
    updateDateRange(newRange);
  };
  
  // Handler para mudança de categoria
  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    
    setCategoriaFiltro(selected);
  };
  
  // Handler para mudança de obra
  const handleObraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: number[] = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(parseInt(options[i].value));
      }
    }
    
    setObraFiltro(selected);
  };
  
  // Handler para mudança de fornecedor
  const handleFornecedorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: number[] = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(parseInt(options[i].value));
      }
    }
    
    setFornecedorFiltro(selected);
  };
  
  // Gerar relatório
  const handleGenerateReport = async () => {
    setGenerating(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Validar datas para período personalizado
      if (dateRange === 'custom' && (!startDate || !endDate)) {
        throw new Error('Por favor, selecione uma data de início e fim para o período personalizado');
      }
      
      // Preparar parâmetros para o relatório
      const reportParams = {
        tipo: reportType,
        formato: formato,
        data_inicio: startDate,
        data_fim: endDate,
        categorias: categoriaFiltro.length > 0 ? categoriaFiltro : null,
        obras: obraFiltro.length > 0 ? obraFiltro : null,
        fornecedores: fornecedorFiltro.length > 0 ? fornecedorFiltro : null
      };
      
      // Em um ambiente real, faríamos uma chamada para gerar o relatório
      // const { data, error } = await supabase.rpc('gerar_relatorio_materiais', reportParams);
      
      // Simular um delay para desenvolvimento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular sucesso para desenvolvimento
      console.log('Relatório solicitado com os parâmetros:', reportParams);
      setSuccess(true);
      
      // Em um ambiente real, redirecionaríamos para o download do relatório
      // if (data && data.url) {
      //   window.open(data.url, '_blank');
      // }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao gerar o relatório');
      }
      console.error('Erro ao gerar relatório:', err);
    } finally {
      setGenerating(false);
    }
  };
  
  // Obter informações sobre o tipo de relatório selecionado
  const getSelectedReportInfo = () => {
    return reportTypes.find(r => r.id === reportType) || reportTypes[0];
  };
  
  const selectedReportInfo = getSelectedReportInfo();
  
  return (
    <div className="materiais-reports-container">
      <div className="reports-header">
        <h2>Relatórios de Materiais</h2>
        <p>Gere relatórios detalhados sobre materiais, stock, fornecedores e mais</p>
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
      
      {success && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle"></i>
          <span>Relatório gerado com sucesso! O download irá começar em breve.</span>
          <button onClick={() => setSuccess(false)} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      <div className="reports-content">
        <div className="reports-sidebar">
          <h3>Tipos de Relatórios</h3>
          <div className="report-types-list">
            {reportTypes.map((type) => (
              <div 
                key={type.id}
                className={`report-type-item ${reportType === type.id ? 'active' : ''}`}
                onClick={() => setReportType(type.id)}
              >
                <i className={`fas fa-${
                  type.id === 'inventario' ? 'boxes' : 
                  type.id === 'movimentacoes' ? 'exchange-alt' : 
                  type.id === 'requisicoes' ? 'file-alt' : 
                  type.id === 'fornecedores' ? 'truck' : 
                  type.id === 'certificacoes' ? 'certificate' : 
                  type.id === 'nao_conformidades' ? 'exclamation-triangle' : 
                  type.id === 'lotes' ? 'barcode' : 
                  'chart-line'
                }`}></i>
                <span>{type.name}</span>
              </div>
            ))}
          </div>
          
          <div className="report-format">
            <h3>Formato</h3>
            <div className="format-options">
              <label className={`format-option ${formato === 'pdf' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="formato" 
                  value="pdf" 
                  checked={formato === 'pdf'} 
                  onChange={() => setFormato('pdf')} 
                />
                <i className="fas fa-file-pdf"></i> PDF
              </label>
              
              <label className={`format-option ${formato === 'excel' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="formato" 
                  value="excel" 
                  checked={formato === 'excel'} 
                  onChange={() => setFormato('excel')} 
                />
                <i className="fas fa-file-excel"></i> Excel
              </label>
              
              <label className={`format-option ${formato === 'csv' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="formato" 
                  value="csv" 
                  checked={formato === 'csv'} 
                  onChange={() => setFormato('csv')} 
                />
                <i className="fas fa-file-csv"></i> CSV
              </label>
            </div>
          </div>
        </div>
        
        <div className="report-configuration">
          <div className="report-info">
            <h3>{selectedReportInfo.name}</h3>
            <p>{selectedReportInfo.description}</p>
          </div>
          
          <div className="filter-section">
            <h3>Filtros</h3>
            
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="date-range">Período:</label>
                <select 
                  id="date-range" 
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  className="filter-select"
                >
                  <option value="7d">Últimos 7 dias</option>
                  <option value="30d">Últimos 30 dias</option>
                  <option value="90d">Últimos 90 dias</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
              
              {dateRange === 'custom' && (
                <div className="date-range-inputs">
                  <div className="filter-group">
                    <label htmlFor="start-date">De:</label>
                    <input 
                      type="date" 
                      id="start-date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="filter-group">
                    <label htmlFor="end-date">Até:</label>
                    <input 
                      type="date" 
                      id="end-date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="categorias">Categorias:</label>
                <select 
                  id="categorias" 
                  multiple
                  value={categoriaFiltro}
                  onChange={handleCategoriaChange}
                  className="filter-select"
                  size={4}
                >
                  {categorias.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
                <small className="filter-help">Ctrl+clique para selecionar múltiplos</small>
              </div>
              
              <div className="filter-group">
                <label htmlFor="obras">Obras:</label>
                <select 
                  id="obras" 
                  multiple
                  value={obraFiltro.map(String)}
                  onChange={handleObraChange}
                  className="filter-select"
                  size={4}
                >
                  {obras.map((obra) => (
                    <option key={obra.id} value={obra.id}>
                      {obra.nome}
                    </option>
                  ))}
                </select>
                <small className="filter-help">Ctrl+clique para selecionar múltiplos</small>
              </div>
              
              {(reportType === 'fornecedores' || reportType === 'nao_conformidades') && (
                <div className="filter-group">
                  <label htmlFor="fornecedores">Fornecedores:</label>
                  <select 
                    id="fornecedores" 
                    multiple
                    value={fornecedorFiltro.map(String)}
                    onChange={handleFornecedorChange}
                    className="filter-select"
                    size={4}
                  >
                    {fornecedores.map((fornecedor) => (
                      <option key={fornecedor.id} value={fornecedor.id}>
                        {fornecedor.nome}
                      </option>
                    ))}
                  </select>
                  <small className="filter-help">Ctrl+clique para selecionar múltiplos</small>
                </div>
              )}
            </div>
          </div>
          
          <div className="report-options">
            <h3>Opções</h3>
            
            <div className="options-grid">
              <label className="checkbox-container">
                <input type="checkbox" defaultChecked={true} />
                <span className="checkmark"></span>
                Incluir gráficos
              </label>
              
              <label className="checkbox-container">
                <input type="checkbox" defaultChecked={true} />
                <span className="checkmark"></span>
                Incluir logotipo da empresa
              </label>
              
              <label className="checkbox-container">
                <input type="checkbox" defaultChecked={true} />
                <span className="checkmark"></span>
                Mostrar totais
              </label>
              
              <label className="checkbox-container">
                <input type="checkbox" defaultChecked={true} />
                <span className="checkmark"></span>
                Incluir campos vazios
              </label>
            </div>
          </div>
          
          <div className="report-actions">
            <button className="btn-secondary" disabled={generating}>
              <i className="fas fa-save"></i> Guardar Configuração
            </button>
            
            <button 
              className="btn-primary"
              onClick={handleGenerateReport}
              disabled={generating}
            >
              {generating ? (
                <>
                  <div className="spinner-small"></div>
                  A gerar relatório...
                </>
              ) : (
                <>
                  <i className="fas fa-file-download"></i> Gerar Relatório
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="reports-thumbnails">
        <h3>Relatórios Recentes</h3>
        <div className="thumbnails-grid">
          <div className="report-thumbnail">
            <div className="thumbnail-preview">
              <i className="fas fa-file-pdf"></i>
            </div>
            <div className="thumbnail-info">
              <h4>Inventário de Materiais</h4>
              <p>Gerado em: 15/04/2025</p>
              <div className="thumbnail-actions">
                <button className="btn-secondary" title="Download">
                  <i className="fas fa-download"></i>
                </button>
                <button className="btn-secondary" title="Regenerar">
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div className="report-thumbnail">
            <div className="thumbnail-preview">
              <i className="fas fa-file-excel"></i>
            </div>
            <div className="thumbnail-info">
              <h4>Análise de Fornecedores</h4>
              <p>Gerado em: 10/04/2025</p>
              <div className="thumbnail-actions">
                <button className="btn-secondary" title="Download">
                  <i className="fas fa-download"></i>
                </button>
                <button className="btn-secondary" title="Regenerar">
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div className="report-thumbnail">
            <div className="thumbnail-preview">
              <i className="fas fa-file-pdf"></i>
            </div>
            <div className="thumbnail-info">
              <h4>Movimentações de Stock</h4>
              <p>Gerado em: 05/04/2025</p>
              <div className="thumbnail-actions">
                <button className="btn-secondary" title="Download">
                  <i className="fas fa-download"></i>
                </button>
                <button className="btn-secondary" title="Regenerar">
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MateriaisReports;
