import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { MaterialCertificacao } from '../interfaces/MaterialInterfaces';
import '../styles/MaterialCertificacoes.css';

const MaterialCertificacoes: React.FC = () => {
  // Estados para dados
  const [certificacoes, setCertificacoes] = useState<MaterialCertificacao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estados para o modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentCertificacao, setCurrentCertificacao] = useState<MaterialCertificacao | null>(null);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [materialFiltro, setMaterialFiltro] = useState<number | null>(null);
  const [statusFiltro, setStatusFiltro] = useState<string>('todas');
  const [expirarEmFiltro, setExpirarEmFiltro] = useState<number | null>(null);
  
  // Opções para selects
  const [materiais, setMateriais] = useState<{id: number, nome: string}[]>([]);
  
  // Carregar dados
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      
      try {
        // Carregar certificações
        let query = supabase
          .from('material_certificacoes')
          .select(`
            *,
            materiais:material_id (nome)
          `)
          .order('data_validade', { ascending: true });
        
        // Aplicar filtros
        if (searchTerm) {
          query = query.or(`nome_certificacao.ilike.%${searchTerm}%,numero_certificacao.ilike.%${searchTerm}%,entidade_certificadora.ilike.%${searchTerm}%,materiais.nome.ilike.%${searchTerm}%`);
        }
        
        if (materialFiltro) {
          query = query.eq('material_id', materialFiltro);
        }
        
        if (statusFiltro !== 'todas') {
          query = query.eq('status', statusFiltro);
        }
        
        if (expirarEmFiltro) {
          // Calcular data limite
          const today = new Date();
          const limitDate = new Date();
          limitDate.setDate(today.getDate() + expirarEmFiltro);
          
          const todayStr = today.toISOString().split('T')[0];
          const limitDateStr = limitDate.toISOString().split('T')[0];
          
          query = query
            .gte('data_validade', todayStr)
            .lte('data_validade', limitDateStr)
            .eq('status', 'válido');
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data) {
          // Transformar dados para o formato esperado
          const certificacoesData: MaterialCertificacao[] = data.map(item => ({
            id: item.id,
            material_id: item.material_id,
            material_nome: item.materiais.nome,
            nome_certificacao: item.nome_certificacao,
            entidade_certificadora: item.entidade_certificadora,
            numero_certificacao: item.numero_certificacao,
            data_emissao: item.data_emissao,
            data_validade: item.data_validade,
            documento_url: item.documento_url,
            observacoes: item.observacoes,
            status: item.status
          }));
          
          setCertificacoes(certificacoesData);
        }
        
        // Carregar materiais para o filtro
        const { data: materiaisData, error: materiaisError } = await supabase
          .from('materiais')
          .select('id, nome')
          .order('nome');
        
        if (materiaisError) {
          console.error('Erro ao carregar materiais:', materiaisError);
        } else if (materiaisData) {
          setMateriais(materiaisData as {id: number, nome: string}[]);
        }
        
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocorreu um erro ao carregar as certificações');
        }
        console.error('Erro:', err);
        
        // Dados simulados para desenvolvimento
        gerarDadosSimulados();
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, [searchTerm, materialFiltro, statusFiltro, expirarEmFiltro]);
  
  // Gerar dados simulados para desenvolvimento
  const gerarDadosSimulados = () => {
    // Materiais simulados
    setMateriais([
      { id: 1, nome: 'Betão C30/37' },
      { id: 2, nome: 'Aço A500 NR' },
      { id: 3, nome: 'Tijolo cerâmico 30x20x15' },
      { id: 4, nome: 'Tinta acrílica branca' },
      { id: 5, nome: 'Perfil IPE 200' }
    ]);
    
    // Certificações simuladas
    const hoje = new Date();
    const umMesDepois = new Date();
    umMesDepois.setMonth(hoje.getMonth() + 1);
    
    const tresMesesDepois = new Date();
    tresMesesDepois.setMonth(hoje.getMonth() + 3);
    
    const umAnoDepois = new Date();
    umAnoDepois.setFullYear(hoje.getFullYear() + 1);
    
    const umMesAntes = new Date();
    umMesAntes.setMonth(hoje.getMonth() - 1);
    
    const certificacoesSimuladas: MaterialCertificacao[] = [
      {
        id: 1,
        material_id: 1,
        material_nome: 'Betão C30/37',
        nome_certificacao: 'Certificado de Conformidade CE',
        entidade_certificadora: 'LNEC',
        numero_certificacao: 'CE-1234/2025',
        data_emissao: '2025-01-10',
        data_validade: umAnoDepois.toISOString().split('T')[0],
        documento_url: 'https://example.com/cert/1234',
        status: 'válido'
      },
      {
        id: 2,
        material_id: 1,
        material_nome: 'Betão C30/37',
        nome_certificacao: 'Declaração de Desempenho',
        entidade_certificadora: 'BetãoLisboa, Lda.',
        numero_certificacao: 'DoP-B37-2025',
        data_emissao: '2025-01-15',
        documento_url: 'https://example.com/dop/b37',
        status: 'válido'
      },
      {
        id: 3,
        material_id: 2,
        material_nome: 'Aço A500 NR',
        nome_certificacao: 'Certificado de Qualidade',
        entidade_certificadora: 'IPQ',
        numero_certificacao: 'IPQ-A500-2025',
        data_emissao: '2025-02-05',
        data_validade: umMesDepois.toISOString().split('T')[0],
        observacoes: 'Renovação necessária em breve',
        documento_url: 'https://example.com/cert/aco',
        status: 'válido'
      },
      {
        id: 4,
        material_id: 3,
        material_nome: 'Tijolo cerâmico 30x20x15',
        nome_certificacao: 'Certificado de Conformidade CE',
        entidade_certificadora: 'CERTIF',
        numero_certificacao: 'CERT-TC-2024',
        data_emissao: '2024-10-15',
        data_validade: tresMesesDepois.toISOString().split('T')[0],
        documento_url: 'https://example.com/cert/tijolo',
        status: 'válido'
      },
      {
        id: 5,
        material_id: 4,
        material_nome: 'Tinta acrílica branca',
        nome_certificacao: 'Certificado Ambiental',
        entidade_certificadora: 'ECO-CERT',
        numero_certificacao: 'ECO-2024-456',
        data_emissao: '2024-12-01',
        data_validade: umMesAntes.toISOString().split('T')[0],
        documento_url: 'https://example.com/cert/tinta',
        status: 'expirado'
      }
    ];
    
    setCertificacoes(certificacoesSimuladas);
  };
  
  // Abrir modal para adicionar/editar certificação
  const abrirModal = (tipo: 'add' | 'edit', certificacao?: MaterialCertificacao) => {
    setModalType(tipo);
    setCurrentCertificacao(certificacao || null);
    setShowModal(true);
  };
  
  // Fechar modal
  const fecharModal = () => {
    setShowModal(false);
    setCurrentCertificacao(null);
  };
  
  // Manipuladores para filtros
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setMaterialFiltro(valor === '' ? null : parseInt(valor));
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFiltro(e.target.value);
  };
  
  const handleExpirarEmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setExpirarEmFiltro(valor === '' ? null : parseInt(valor));
  };
  
  // Limpar filtros
  const limparFiltros = () => {
    setSearchTerm('');
    setMaterialFiltro(null);
    setStatusFiltro('todas');
    setExpirarEmFiltro(null);
  };
  
  // Verificar se uma certificação está prestes a expirar
  const estaPrestesAExpirar = (dataValidade?: string): boolean => {
    if (!dataValidade) return false;
    
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const diffTime = validade.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 && diffDays <= 30;
  };
  
  // Calcular estatísticas
  const calcularEstatisticas = () => {
    const validas = certificacoes.filter(c => c.status === 'válido').length;
    const expiradas = certificacoes.filter(c => c.status === 'expirado').length;
    const pendentes = certificacoes.filter(c => c.status === 'pendente').length;
    const prestesAExpirar = certificacoes.filter(c => 
      c.status === 'válido' && estaPrestesAExpirar(c.data_validade)
    ).length;
    
    return {
      validas,
      expiradas,
      pendentes,
      prestesAExpirar
    };
  };
  
  const estatisticas = calcularEstatisticas();
  
  return (
    <div className="material-certificacoes-container">
      <div className="certificacoes-header">
        <div className="certificacoes-title">
          <h2>Certificações de Materiais</h2>
          <p>Gestão de certificações, declarações de desempenho e documentação técnica</p>
        </div>
        
        <div className="certificacoes-actions">
          <button 
            className="btn-primary"
            onClick={() => abrirModal('add')}
          >
            <i className="fas fa-plus-circle"></i> Nova Certificação
          </button>
          <button className="btn-secondary">
            <i className="fas fa-file-import"></i> Importar
          </button>
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
      
      {success && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle"></i>
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      <div className="certificacoes-summary">
        <div className="summary-card">
          <div className="summary-value">{estatisticas.validas}</div>
          <div className="summary-label">Certificações Válidas</div>
        </div>
        <div className="summary-card warning">
          <div className="summary-value">{estatisticas.prestesAExpirar}</div>
          <div className="summary-label">Prestes a Expirar</div>
        </div>
        <div className="summary-card danger">
          <div className="summary-value">{estatisticas.expiradas}</div>
          <div className="summary-label">Expiradas</div>
        </div>
        <div className="summary-card info">
          <div className="summary-value">{estatisticas.pendentes}</div>
          <div className="summary-label">Pendentes</div>
        </div>
      </div>
      
      <div className="certificacoes-filter-section">
        <div className="filter-row">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Pesquisar certificações..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>
          
          <div className="filter-options">
            <div className="filter-group">
              <label htmlFor="material-filtro">Material:</label>
              <select 
                id="material-filtro" 
                value={materialFiltro?.toString() || ''}
                onChange={handleMaterialChange}
                className="filter-select"
              >
                <option value="">Todos os Materiais</option>
                {materiais.map((material) => (
                  <option key={material.id} value={material.id.toString()}>
                    {material.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="status-filtro">Status:</label>
              <select 
                id="status-filtro" 
                value={statusFiltro}
                onChange={handleStatusChange}
                className="filter-select"
              >
                <option value="todas">Todos</option>
                <option value="válido">Válidos</option>
                <option value="expirado">Expirados</option>
                <option value="pendente">Pendentes</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="expirar-filtro">Expirar em:</label>
              <select 
                id="expirar-filtro" 
                value={expirarEmFiltro?.toString() || ''}
                onChange={handleExpirarEmChange}
                className="filter-select"
              >
                <option value="">Qualquer data</option>
                <option value="30">30 dias</option>
                <option value="60">60 dias</option>
                <option value="90">90 dias</option>
              </select>
            </div>
            
            <button 
              className="btn-outline" 
              onClick={limparFiltros}
              title="Limpar filtros"
            >
              <i className="fas fa-times"></i> Limpar
            </button>
          </div>
        </div>
      </div>
      
      <div className="certificacoes-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>A carregar certificações...</p>
          </div>
        ) : certificacoes.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-certificate"></i>
            <h3>Nenhuma certificação encontrada</h3>
            <p>Não foram encontradas certificações com os critérios especificados.</p>
            <div className="empty-actions">
              <button 
                onClick={limparFiltros} 
                className="btn-secondary"
              >
                Limpar filtros
              </button>
              <button 
                onClick={() => abrirModal('add')} 
                className="btn-primary"
              >
                Adicionar Certificação
              </button>
            </div>
          </div>
        ) : (
          <div className="certificacoes-grid">
            {certificacoes.map((certificacao) => (
              <div key={certificacao.id} className="certificacao-card">
                <div className="certificacao-header">
                  <div className="certificacao-title">
                    <h3 title={certificacao.nome_certificacao}>
                      {certificacao.nome_certificacao.length > 30 
                        ? certificacao.nome_certificacao.substring(0, 27) + '...' 
                        : certificacao.nome_certificacao}
                    </h3>
                    <span className={`status-badge ${
                      certificacao.status === 'válido' ? 
                        estaPrestesAExpirar(certificacao.data_validade) ? 'status-warning' : 'status-active' 
                        : certificacao.status === 'expirado' ? 'status-danger' 
                        : 'status-info'
                    }`}>
                      {certificacao.status === 'válido' && estaPrestesAExpirar(certificacao.data_validade) 
                        ? 'Expira em breve' 
                        : certificacao.status.charAt(0).toUpperCase() + certificacao.status.slice(1)}
                    </span>
                  </div>
                  <div className="certificacao-subtitle">
                    <Link to={`/materiais/${certificacao.material_id}`}>
                      {certificacao.material_nome}
                    </Link>
                  </div>
                </div>
                
                <div className="certificacao-body">
                  <div className="certificacao-detail">
                    <span className="detail-label">Entidade:</span>
                    <span className="detail-value">{certificacao.entidade_certificadora}</span>
                  </div>
                  
                  <div className="certificacao-detail">
                    <span className="detail-label">Número:</span>
                    <span className="detail-value">{certificacao.numero_certificacao}</span>
                  </div>
                  
                  <div className="certificacao-detail">
                    <span className="detail-label">Emissão:</span>
                    <span className="detail-value">{certificacao.data_emissao}</span>
                  </div>
                  
                  <div className="certificacao-detail">
                    <span className="detail-label">Validade:</span>
                    <span className={`detail-value ${
                      certificacao.status === 'válido' && estaPrestesAExpirar(certificacao.data_validade) 
                        ? 'expiring-soon' 
                        : certificacao.status === 'expirado' ? 'expired' : ''
                    }`}>
                      {certificacao.data_validade || 'N/A'}
                    </span>
                  </div>
                  
                  {certificacao.observacoes && (
                    <div className="certificacao-detail full-width">
                      <span className="detail-label">Observações:</span>
                      <span className="detail-value">{certificacao.observacoes}</span>
                    </div>
                  )}
                </div>
                
                <div className="certificacao-footer">
                  <div className="certificacao-actions">
                    {certificacao.documento_url && (
                      <a 
                        href={certificacao.documento_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-secondary"
                      >
                        <i className="fas fa-file-pdf"></i> Ver Documento
                      </a>
                    )}
                    <button 
                      className="btn-icon" 
                      title="Editar"
                      onClick={() => abrirModal('edit', certificacao)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="btn-icon" 
                      title="Renovar"
                      onClick={() => {
                        // Lógica para renovar certificação
                        alert('Funcionalidade de renovação a ser implementada');
                      }}
                    >
                      <i className="fas fa-sync-alt"></i>
                    </button>
                    <button 
                      className="btn-icon" 
                      title="Eliminar"
                      onClick={() => {
                        // Lógica para eliminar certificação
                        alert('Funcionalidade de eliminação a ser implementada');
                      }}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal para adicionar/editar certificação */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container certificacao-modal">
            <div className="modal-header">
              <h3>{modalType === 'add' ? 'Nova Certificação' : 'Editar Certificação'}</h3>
              <button className="close-btn" onClick={fecharModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <form className="certificacao-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="material">Material:</label>
                    <select 
                      id="material" 
                      defaultValue={currentCertificacao?.material_id?.toString() || ''}
                      required
                    >
                      <option value="">Selecione um material</option>
                      {materiais.map((material) => (
                        <option key={material.id} value={material.id.toString()}>
                          {material.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select 
                      id="status" 
                      defaultValue={currentCertificacao?.status || 'válido'}
                      required
                    >
                      <option value="válido">Válido</option>
                      <option value="pendente">Pendente</option>
                      <option value="expirado">Expirado</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="nome_certificacao">Nome da Certificação:</label>
                  <input 
                    type="text" 
                    id="nome_certificacao" 
                    defaultValue={currentCertificacao?.nome_certificacao || ''}
                    placeholder="Ex: Certificado de Conformidade CE"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="entidade_certificadora">Entidade Certificadora:</label>
                    <input 
                      type="text" 
                      id="entidade_certificadora" 
                      defaultValue={currentCertificacao?.entidade_certificadora || ''}
                      placeholder="Ex: LNEC, IPQ, CERTIF"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="numero_certificacao">Número da Certificação:</label>
                    <input 
                      type="text" 
                      id="numero_certificacao" 
                      defaultValue={currentCertificacao?.numero_certificacao || ''}
                      placeholder="Ex: CE-1234/2025"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="data_emissao">Data de Emissão:</label>
                    <input 
                      type="date" 
                      id="data_emissao" 
                      defaultValue={currentCertificacao?.data_emissao || ''}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="data_validade">Data de Validade:</label>
                    <input 
                      type="date" 
                      id="data_validade" 
                      defaultValue={currentCertificacao?.data_validade || ''}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="documento">Documento:</label>
                  <div className="file-upload-container">
                    {currentCertificacao?.documento_url ? (
                      <div className="existing-file">
                        <span>Documento atual: </span>
                        <a 
                          href={currentCertificacao.documento_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver documento
                        </a>
                        <span className="file-actions">
                          <button type="button" className="btn-icon-small">
                            <i className="fas fa-sync-alt"></i>
                          </button>
                          <button type="button" className="btn-icon-small">
                            <i className="fas fa-times"></i>
                          </button>
                        </span>
                      </div>
                    ) : (
                      <div className="file-upload">
                        <input type="file" id="documento" accept=".pdf,.doc,.docx" />
                        <label htmlFor="documento" className="file-upload-label">
                          <i className="fas fa-upload"></i> Escolher ficheiro
                        </label>
                      </div>
                    )}
                  </div>
                  <small className="form-help-text">Formatos suportados: PDF, DOC, DOCX. Tamanho máximo: 10MB</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="observacoes">Observações:</label>
                  <textarea 
                    id="observacoes" 
                    defaultValue={currentCertificacao?.observacoes || ''}
                    rows={3}
                    placeholder="Observações adicionais sobre a certificação"
                  ></textarea>
                </div>
              </form>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={fecharModal}>
                Cancelar
              </button>
              <button className="btn-primary">
                {modalType === 'add' ? 'Adicionar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialCertificacoes;
