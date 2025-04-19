import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { MaterialStock, Material } from '../interfaces/MaterialInterfaces';
import '../styles/MaterialInventario.css';

interface StockItem extends MaterialStock {
  material_nome: string;
  material_codigo: string;
  categoria: string;
  unidade: string;
}

const MaterialInventario: React.FC = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estados para o modal de movimentação
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'entrada' | 'saida' | 'transferencia' | 'ajuste'>('entrada');
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);
  const [quantidade, setQuantidade] = useState<number>(0);
  const [origem, setOrigem] = useState<string>('');
  const [destino, setDestino] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');
  
  // Estados para filtros e busca
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [obraFiltro, setObraFiltro] = useState<number | null>(null);
  const [stockMinimo, setStockMinimo] = useState<boolean>(false);
  
  // Opções para os selects
  const [categorias, setCategorias] = useState<string[]>([]);
  const [obras, setObras] = useState<{id: number, nome: string}[]>([]);
  
  // Carregar dados de stock
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      
      try {
        // Construir a consulta base
        let query = supabase
          .from('material_stock')
          .select(`
            *,
            materiais:material_id (
              nome,
              codigo,
              categoria,
              unidade
            ),
            obras:obra_id (
              nome
            )
          `);
        
     // Aplicar filtros
if (obraFiltro) {
  query = query.eq('obra_id', obraFiltro);
}

const { data, error } = await query;

if (error) {
  throw new Error(error.message);
}

if (data) {
  // Aplicar filtro local para stock mínimo
  let dadosFiltrados = data;
  if (stockMinimo) {
    dadosFiltrados = dadosFiltrados.filter(
      (item) => item.quantidade_disponivel < item.quantidade_minima
    );
  }
          // Transformar os dados para o formato esperado
          const stockData: StockItem[] = data.map(item => ({
            id: item.id,
            material_id: item.material_id,
            material_nome: item.materiais.nome,
            material_codigo: item.materiais.codigo,
            categoria: item.materiais.categoria,
            unidade: item.materiais.unidade,
            obra_id: item.obra_id,
            obra_nome: item.obras.nome,
            quantidade_disponivel: item.quantidade_disponivel,
            quantidade_reservada: item.quantidade_reservada,
            quantidade_minima: item.quantidade_minima,
            localizacao: item.localizacao,
            data_atualizacao: item.data_atualizacao
          }));
          
          // Aplicar filtro de categoria se selecionado
          let filteredData = stockData;
          if (categoriaFiltro !== 'todas') {
            filteredData = stockData.filter(item => item.categoria === categoriaFiltro);
          }
          
          // Aplicar filtro de busca
          if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filteredData = filteredData.filter(item => 
              item.material_nome.toLowerCase().includes(searchLower) ||
              item.material_codigo.toLowerCase().includes(searchLower) ||
              item.localizacao.toLowerCase().includes(searchLower)
            );
          }
          
          setStockItems(filteredData);
          
          // Extrair categorias únicas para o filtro
          const uniqueCategorias = Array.from(new Set(stockData.map(item => item.categoria)));
          setCategorias(uniqueCategorias);
        }
        
        // Carregar obras para o filtro
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
          setError('Ocorreu um erro ao carregar os dados de stock');
        }
        console.error('Erro:', err);
        
        // Dados simulados para desenvolvimento
        const stockSimulado: StockItem[] = [
          {
            id: 1,
            material_id: 1,
            material_nome: 'Betão C30/37',
            material_codigo: 'MAT-0001',
            categoria: 'Betão',
            unidade: 'm³',
            obra_id: 1,
            obra_nome: 'Obra Ferroviária Setúbal',
            quantidade_disponivel: 125,
            quantidade_reservada: 45,
            quantidade_minima: 50,
            localizacao: 'Armazém Principal - Setor B12',
            data_atualizacao: '2025-04-15'
          },
          {
            id: 2,
            material_id: 1,
            material_nome: 'Betão C30/37',
            material_codigo: 'MAT-0001',
            categoria: 'Betão',
            unidade: 'm³',
            obra_id: 2,
            obra_nome: 'Ponte Vasco da Gama - Manutenção',
            quantidade_disponivel: 35,
            quantidade_reservada: 10,
            quantidade_minima: 20,
            localizacao: 'Armazém Local - Obra',
            data_atualizacao: '2025-04-10'
          },
          {
            id: 3,
            material_id: 2,
            material_nome: 'Aço A500 NR',
            material_codigo: 'MAT-0002',
            categoria: 'Aço',
            unidade: 'kg',
            obra_id: 1,
            obra_nome: 'Obra Ferroviária Setúbal',
            quantidade_disponivel: 5000,
            quantidade_reservada: 1200,
            quantidade_minima: 2000,
            localizacao: 'Armazém Principal - Setor A05',
            data_atualizacao: '2025-04-14'
          },
          {
            id: 4,
            material_id: 3,
            material_nome: 'Tijolo cerâmico 30x20x15',
            material_codigo: 'MAT-0003',
            categoria: 'Alvenaria',
            unidade: 'un',
            obra_id: 3,
            obra_nome: 'Ampliação Terminal Portuário',
            quantidade_disponivel: 2500,
            quantidade_reservada: 0,
            quantidade_minima: 1000,
            localizacao: 'Armazém Local - Obra',
            data_atualizacao: '2025-04-12'
          },
          {
            id: 5,
            material_id: 4,
            material_nome: 'Tinta acrílica branca',
            material_codigo: 'MAT-0004',
            categoria: 'Pintura',
            unidade: 'l',
            obra_id: 4,
            obra_nome: 'Reabilitação Urbana Baixa',
            quantidade_disponivel: 75,
            quantidade_reservada: 25,
            quantidade_minima: 100,
            localizacao: 'Armazém Principal - Setor P03',
            data_atualizacao: '2025-04-08'
          }
        ];
        
        // Aplicar filtros aos dados simulados
        let filteredData = stockSimulado;
        if (categoriaFiltro !== 'todas') {
          filteredData = stockSimulado.filter(item => item.categoria === categoriaFiltro);
        }
        
        if (obraFiltro) {
          filteredData = filteredData.filter(item => item.obra_id === obraFiltro);
        }
        
        if (stockMinimo) {
          filteredData = filteredData.filter(item => item.quantidade_disponivel < item.quantidade_minima);
        }
        
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          filteredData = filteredData.filter(item => 
            item.material_nome.toLowerCase().includes(searchLower) ||
            item.material_codigo.toLowerCase().includes(searchLower) ||
            item.localizacao.toLowerCase().includes(searchLower)
          );
        }
        
        setStockItems(filteredData);
        
        // Categorias simuladas
        setCategorias(['Betão', 'Aço', 'Alvenaria', 'Pintura', 'Estrutura Metálica']);
        
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
  }, [searchTerm, categoriaFiltro, obraFiltro, stockMinimo]);
  
  // Abrir modal de movimentação
  const openMovimentacaoModal = (type: 'entrada' | 'saida' | 'transferencia' | 'ajuste', materialId?: number) => {
    setModalType(type);
    setSelectedMaterial(materialId || null);
    setQuantidade(0);
    setOrigem('');
    setDestino('');
    setObservacoes('');
    setShowModal(true);
  };
  
  // Fechar modal
  const closeModal = () => {
    setShowModal(false);
  };
  
  // Registrar movimentação
  const handleRegistrarMovimentacao = async () => {
    try {
      // Validações
      if (quantidade <= 0) {
        throw new Error('A quantidade deve ser maior que zero');
      }
      
      if (modalType === 'entrada' && !origem) {
        throw new Error('Informe a origem da entrada');
      }
      
      if (modalType === 'saida' && !destino) {
        throw new Error('Informe o destino da saída');
      }
      
      if (modalType === 'transferencia' && (!origem || !destino)) {
        throw new Error('Informe a origem e o destino da transferência');
      }
      
      // Preparar dados da movimentação
      const movimentacaoData = {
        tipo: modalType,
        material_id: selectedMaterial,
        quantidade: modalType === 'saida' ? -quantidade : quantidade,
        data: new Date().toISOString().split('T')[0],
        origem,
        destino,
        responsavel: 'Usuário Atual', // Em um sistema real, seria o usuário logado
        observacoes
      };
      
      // Registrar movimentação no banco de dados
      // const { data, error } = await supabase.from('material_movimentacoes').insert([movimentacaoData]);
      
      // if (error) {
      //   throw new Error(error.message);
      // }
      
      // Simular sucesso para desenvolvimento
      console.log('Movimentação registrada:', movimentacaoData);
      
      // Atualizar stock
      // Em um sistema real, isto seria feito por um trigger no banco de dados
      // ou pela função que processa a movimentação
      
      // Mostrar mensagem de sucesso
      setSuccess(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} registrada com sucesso!`);
      
      // Fechar modal
      closeModal();
      
      // Limpar mensagem de sucesso após alguns segundos
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
      
      // Recarregar dados
      // Em um sistema real, faríamos uma nova consulta ao banco de dados
      // Para desenvolvimento, vamos simular atualizando os dados locais
      if (selectedMaterial) {
        const updatedStockItems = stockItems.map(item => {
          if (item.material_id === selectedMaterial) {
            return {
              ...item,
              quantidade_disponivel: modalType === 'saida' 
                ? item.quantidade_disponivel - quantidade
                : item.quantidade_disponivel + quantidade,
              data_atualizacao: new Date().toISOString().split('T')[0]
            };
          }
          return item;
        });
        
        setStockItems(updatedStockItems);
      }
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao registrar a movimentação');
      }
      console.error('Erro:', err);
    }
  };
  
  // Manipuladores para filtros
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoriaFiltro(e.target.value);
  };
  
  const handleObraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setObraFiltro(valor === 'todas' ? null : parseInt(valor));
  };
  
  const handleStockMinimoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStockMinimo(e.target.checked);
  };
  
  // Calcular totais para sumário
  const calcularTotais = () => {
    const totalItens = stockItems.length;
    const totalDisponivel = stockItems.reduce((total, item) => total + item.quantidade_disponivel, 0);
    const totalReservado = stockItems.reduce((total, item) => total + item.quantidade_reservada, 0);
    const totalAbaixoMinimo = stockItems.filter(item => item.quantidade_disponivel < item.quantidade_minima).length;
    
    return {
      totalItens,
      totalDisponivel,
      totalReservado,
      totalAbaixoMinimo
    };
  };
  
  const totais = calcularTotais();
  
  return (
    <div className="material-inventario-container">
      <div className="inventario-header">
        <div className="inventario-title">
          <h2>Inventário de Materiais</h2>
          <p>Gestão de stock, entradas e saídas de materiais</p>
        </div>
        
        <div className="inventario-actions">
          <button 
            className="btn-primary"
            onClick={() => openMovimentacaoModal('entrada')}
          >
            <i className="fas fa-plus-circle"></i> Registar Entrada
          </button>
          <button 
            className="btn-secondary"
            onClick={() => openMovimentacaoModal('saida')}
          >
            <i className="fas fa-minus-circle"></i> Registar Saída
          </button>
          <button 
            className="btn-secondary"
            onClick={() => openMovimentacaoModal('transferencia')}
          >
            <i className="fas fa-exchange-alt"></i> Transferir
          </button>
          <button 
            className="btn-secondary"
            onClick={() => openMovimentacaoModal('ajuste')}
          >
            <i className="fas fa-balance-scale"></i> Ajuste
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
      
      <div className="inventario-filter-section">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Pesquisar materiais..." 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        
        <div className="filter-options">
          <div className="filter-group">
            <label htmlFor="categoria-filtro">Categoria:</label>
            <select 
              id="categoria-filtro" 
              value={categoriaFiltro}
              onChange={handleCategoriaChange}
              className="filter-select"
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
              className="filter-select"
            >
              <option value="todas">Todas as Obras</option>
              {obras.map((obra) => (
                <option key={obra.id} value={obra.id.toString()}>
                  {obra.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group checkbox-filter">
            <label className="checkbox-container">
              <input 
                type="checkbox"
                checked={stockMinimo}
                onChange={handleStockMinimoChange}
              />
              <span className="checkmark"></span>
              Abaixo do Stock Mínimo
            </label>
          </div>
        </div>
      </div>
      
      <div className="inventario-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>A carregar dados de inventário...</p>
          </div>
        ) : stockItems.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-boxes"></i>
            <h3>Nenhum item encontrado</h3>
            <p>Não foram encontrados itens de stock com os critérios especificados.</p>
            <div className="empty-actions">
              <button onClick={() => { setSearchTerm(''); setCategoriaFiltro('todas'); setObraFiltro(null); setStockMinimo(false); }} className="btn-secondary">
                Limpar filtros
              </button>
              <button onClick={() => openMovimentacaoModal('entrada')} className="btn-primary">
                Registar Entrada
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="stock-summary">
              <div className="summary-box">
                <div className="summary-title">Total de Itens</div>
                <div className="summary-value">{totais.totalItens}</div>
              </div>
              <div className="summary-box">
                <div className="summary-title">Stock Disponível</div>
                <div className="summary-value">{totais.totalDisponivel}</div>
              </div>
              <div className="summary-box">
                <div className="summary-title">Stock Reservado</div>
                <div className="summary-value">{totais.totalReservado}</div>
              </div>
              <div className="summary-box warning">
                <div className="summary-title">Abaixo do Mínimo</div>
                <div className="summary-value">{totais.totalAbaixoMinimo}</div>
              </div>
            </div>
            
            <div className="stock-table">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Material</th>
                    <th>Categoria</th>
                    <th>Obra</th>
                    <th>Disponível</th>
                    <th>Reservado</th>
                    <th>Mínimo</th>
                    <th>Localização</th>
                    <th>Atualização</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {stockItems.map((item) => (
                    <tr 
                      key={item.id}
                      className={item.quantidade_disponivel < item.quantidade_minima ? 'row-warning' : ''}
                    >
                      <td>{item.material_codigo}</td>
                      <td>
                        <Link to={`/materiais/${item.material_id}`} className="material-link">
                          {item.material_nome}
                        </Link>
                      </td>
                      <td>{item.categoria}</td>
                      <td>{item.obra_nome}</td>
                      <td className={item.quantidade_disponivel < item.quantidade_minima ? 'stock-low' : 'stock-ok'}>
                        {item.quantidade_disponivel} {item.unidade}
                      </td>
                      <td>{item.quantidade_reservada} {item.unidade}</td>
                      <td>{item.quantidade_minima} {item.unidade}</td>
                      <td>{item.localizacao}</td>
                      <td>{item.data_atualizacao}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-icon" 
                            title="Entrada"
                            onClick={() => openMovimentacaoModal('entrada', item.material_id)}
                          >
                            <i className="fas fa-plus-circle"></i>
                          </button>
                          <button 
                            className="btn-icon" 
                            title="Saída"
                            onClick={() => openMovimentacaoModal('saida', item.material_id)}
                          >
                            <i className="fas fa-minus-circle"></i>
                          </button>
                          <button 
                            className="btn-icon" 
                            title="Ajustar"
                            onClick={() => openMovimentacaoModal('ajuste', item.material_id)}
                          >
                            <i className="fas fa-cog"></i>
                          </button>
                          <button className="btn-icon" title="Histórico">
                            <i className="fas fa-history"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      
      {/* Modal de Movimentação */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>
                {modalType === 'entrada' ? 'Registar Entrada' : 
                 modalType === 'saida' ? 'Registar Saída' : 
                 modalType === 'transferencia' ? 'Registar Transferência' : 
                 'Registar Ajuste'} de Material
              </h3>
              <button className="close-btn" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="material-select">Material:</label>
                <select 
                  id="material-select" 
                  value={selectedMaterial?.toString() || ''}
                  onChange={(e) => setSelectedMaterial(e.target.value ? parseInt(e.target.value) : null)}
                  required
                >
                  <option value="">Selecione um material</option>
                  {Array.from(new Set(stockItems.map(item => item.material_id))).map(materialId => {
                    const material = stockItems.find(item => item.material_id === materialId);
                    return material ? (
                      <option key={materialId} value={materialId}>
                        {material.material_codigo} - {material.material_nome}
                      </option>
                    ) : null;
                  })}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="quantidade">Quantidade:</label>
                <input 
                  type="number" 
                  id="quantidade" 
                  value={quantidade}
                  onChange={(e) => setQuantidade(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              {(modalType === 'entrada' || modalType === 'transferencia') && (
                <div className="form-group">
                  <label htmlFor="origem">Origem:</label>
                  <input 
                    type="text" 
                    id="origem" 
                    value={origem}
                    onChange={(e) => setOrigem(e.target.value)}
                    placeholder="Ex: Fornecedor, Armazém, Obra..."
                    required
                  />
                </div>
              )}
              
              {(modalType === 'saida' || modalType === 'transferencia') && (
                <div className="form-group">
                  <label htmlFor="destino">Destino:</label>
                  <input 
                    type="text" 
                    id="destino" 
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    placeholder="Ex: Obra, Armazém, Cliente..."
                    required
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="observacoes">Observações:</label>
                <textarea 
                  id="observacoes" 
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={3}
                  placeholder="Observações adicionais..."
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleRegistrarMovimentacao}>
                Registar {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialInventario;