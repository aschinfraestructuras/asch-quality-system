import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Material, MaterialFiltros } from '../interfaces/MaterialInterfaces';
import '../styles/MateriaisList.css';

const MateriaisList: React.FC = () => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<string[]>([]);
  
  // Estados para filtros e paginação
  const [filtros, setFiltros] = useState<MaterialFiltros>({
    termo_pesquisa: '',
    categorias: [],
    fornecedores: [],
    obras: [],
    com_stock_minimo: false,
    com_certificacao_valida: false,
    com_nao_conformidades: false,
    ordenar_por: 'nome',
    ordem: 'asc',
    pagina: 1,
    itens_por_pagina: 10
  });
  
  const [totalMateriais, setTotalMateriais] = useState<number>(0);
  const [categoriaExpandida, setCategoriaExpandida] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Carregar materiais
  useEffect(() => {
    const carregarMateriais = async () => {
      setLoading(true);
      try {
        // Consulta principal para materiais
        let query = supabase
          .from('materiais')
          .select('*', { count: 'exact' });
        
        // Aplicar filtros
        if (filtros.termo_pesquisa) {
          query = query.or(`nome.ilike.%${filtros.termo_pesquisa}%,codigo.ilike.%${filtros.termo_pesquisa}%,descricao.ilike.%${filtros.termo_pesquisa}%`);
        }
        
        if (filtros.categorias && filtros.categorias.length > 0) {
          query = query.in('categoria', filtros.categorias);
        }
        
        // Ordenação
        if (filtros.ordenar_por) {
          query = query.order(filtros.ordenar_por, { ascending: filtros.ordem === 'asc' });
        }
        
        // Paginação
        const from = (filtros.pagina - 1) * filtros.itens_por_pagina;
        const to = from + filtros.itens_por_pagina - 1;
        query = query.range(from, to);
        
        const { data, error, count } = await query;
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data) {
          setMateriais(data as Material[]);
          if (count !== null) {
            setTotalMateriais(count);
          }
        }
        
        // Carregar categorias para filtros
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
        
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocorreu um erro ao carregar os materiais');
        }
        console.error('Erro:', err);
        
        // Dados simulados para desenvolvimento
        setMateriais([
          {
            id: 1,
            codigo: 'MAT-0001',
            nome: 'Betão C30/37',
            descricao: 'Betão estrutural para elementos em contacto com ambientes agressivos',
            categoria: 'Betão',
            unidade: 'm³',
            preco_unitario: 85.50,
            data_criacao: '2025-01-15',
            ultima_atualizacao: '2025-04-10'
          },
          {
            id: 2,
            codigo: 'MAT-0002',
            nome: 'Aço A500 NR',
            descricao: 'Varão de aço nervurado para betão armado',
            categoria: 'Aço',
            unidade: 'kg',
            preco_unitario: 1.25,
            data_criacao: '2025-01-15',
            ultima_atualizacao: '2025-03-25'
          },
          {
            id: 3,
            codigo: 'MAT-0003',
            nome: 'Tijolo cerâmico 30x20x15',
            descricao: 'Tijolo cerâmico para alvenaria estrutural',
            categoria: 'Alvenaria',
            unidade: 'un',
            preco_unitario: 0.45,
            data_criacao: '2025-01-20',
            ultima_atualizacao: '2025-02-18'
          },
          {
            id: 4,
            codigo: 'MAT-0004',
            nome: 'Tinta acrílica branca',
            descricao: 'Tinta acrílica de alta qualidade para interiores e exteriores',
            categoria: 'Pintura',
            unidade: 'l',
            preco_unitario: 12.75,
            data_criacao: '2025-02-05',
            ultima_atualizacao: '2025-04-12'
          },
          {
            id: 5,
            codigo: 'MAT-0005',
            nome: 'Perfil IPE 200',
            descricao: 'Perfil metálico estrutural tipo IPE 200',
            categoria: 'Estrutura Metálica',
            unidade: 'm',
            preco_unitario: 28.90,
            data_criacao: '2025-02-10',
            ultima_atualizacao: '2025-03-30'
          }
        ]);
        
        // Categorias simuladas
        setCategorias(['Betão', 'Aço', 'Alvenaria', 'Pintura', 'Estrutura Metálica', 'Madeira', 'Cobertura', 'Impermeabilização']);
        setTotalMateriais(5);
      } finally {
        setLoading(false);
      }
    };
    
    carregarMateriais();
  }, [filtros]);
  
  // Manipuladores de eventos para filtros
  const handlePesquisaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({
      ...filtros,
      termo_pesquisa: e.target.value,
      pagina: 1 // Reset para a primeira página ao mudar a pesquisa
    });
  };
  
  const handleCategoriaChange = (categoria: string) => {
    let novasCategorias: string[];
    
    if (filtros.categorias?.includes(categoria)) {
      novasCategorias = filtros.categorias.filter(c => c !== categoria);
    } else {
      novasCategorias = [...(filtros.categorias || []), categoria];
    }
    
    setFiltros({
      ...filtros,
      categorias: novasCategorias,
      pagina: 1
    });
  };
  
  const handleOrdenacaoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [ordenarPor, ordem] = e.target.value.split('-');
    setFiltros({
      ...filtros,
      ordenar_por: ordenarPor as 'nome' | 'codigo' | 'categoria' | 'preco' | 'stock',
      ordem: ordem as 'asc' | 'desc'
    });
  };
  
  const handleChangePagina = (novaPagina: number) => {
    setFiltros({
      ...filtros,
      pagina: novaPagina
    });
  };
  
  const handleLimparFiltros = () => {
    setFiltros({
      termo_pesquisa: '',
      categorias: [],
      fornecedores: [],
      obras: [],
      com_stock_minimo: false,
      com_certificacao_valida: false,
      com_nao_conformidades: false,
      ordenar_por: 'nome',
      ordem: 'asc',
      pagina: 1,
      itens_por_pagina: 10
    });
  };
  
  // Expandir/colapsar categoria
  const toggleCategoria = (categoria: string) => {
    if (categoriaExpandida === categoria) {
      setCategoriaExpandida(null);
    } else {
      setCategoriaExpandida(categoria);
    }
  };
  
  // Calcular número total de páginas
  const totalPaginas = Math.ceil(totalMateriais / filtros.itens_por_pagina);
  
  return (
    <div className="materiais-list-container">
      <div className="materiais-header">
        <div className="materiais-title">
          <h2>Materiais</h2>
          <p>Gestão de materiais, stocks e fornecimentos</p>
        </div>
        <div className="materiais-actions">
          <Link to="/materiais/novo" className="btn-primary">
            <i className="fas fa-plus"></i> Novo Material
          </Link>
          <Link to="/materiais/importar" className="btn-secondary">
            <i className="fas fa-file-import"></i> Importar
          </Link>
        </div>
      </div>
      
      <div className="materiais-filter-section">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Pesquisar materiais..." 
            value={filtros.termo_pesquisa}
            onChange={handlePesquisaChange}
          />
          <button type="button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        
        <div className="filter-options">
          <div className="filter-group">
            <label>Ordenar por:</label>
            <select 
              value={`${filtros.ordenar_por}-${filtros.ordem}`}
              onChange={handleOrdenacaoChange}
            >
              <option value="nome-asc">Nome (A-Z)</option>
              <option value="nome-desc">Nome (Z-A)</option>
              <option value="codigo-asc">Código (Crescente)</option>
              <option value="codigo-desc">Código (Decrescente)</option>
              <option value="categoria-asc">Categoria (A-Z)</option>
              <option value="preco-asc">Preço (Crescente)</option>
              <option value="preco-desc">Preço (Decrescente)</option>
            </select>
          </div>
          
          <div className="view-toggle">
            <button 
              className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <i className="fas fa-list"></i>
            </button>
            <button 
              className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <i className="fas fa-th-large"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div className="materiais-content">
        <div className="materiais-sidebar">
          <div className="filter-section">
            <h3>Filtros</h3>
            <button className="btn-clear" onClick={handleLimparFiltros}>
              Limpar filtros
            </button>
          </div>
          
          <div className="filter-section">
            <h4>Categorias</h4>
            <div className="categoria-list">
              {categorias.map((categoria) => (
                <div key={categoria} className="categoria-item">
                  <label className="checkbox-container">
                    <input 
                      type="checkbox"
                      checked={filtros.categorias?.includes(categoria) || false}
                      onChange={() => handleCategoriaChange(categoria)}
                    />
                    <span className="checkmark"></span>
                    {categoria}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Estado</h4>
            <div className="estado-list">
              <label className="checkbox-container">
                <input 
                  type="checkbox"
                  checked={filtros.com_stock_minimo}
                  onChange={() => setFiltros({...filtros, com_stock_minimo: !filtros.com_stock_minimo})}
                />
                <span className="checkmark"></span>
                Abaixo do stock mínimo
              </label>
              
              <label className="checkbox-container">
                <input 
                  type="checkbox"
                  checked={filtros.com_certificacao_valida}
                  onChange={() => setFiltros({...filtros, com_certificacao_valida: !filtros.com_certificacao_valida})}
                />
                <span className="checkmark"></span>
                Com certificações válidas
              </label>
              
              <label className="checkbox-container">
                <input 
                  type="checkbox"
                  checked={filtros.com_nao_conformidades}
                  onChange={() => setFiltros({...filtros, com_nao_conformidades: !filtros.com_nao_conformidades})}
                />
                <span className="checkmark"></span>
                Com não conformidades
              </label>
            </div>
          </div>
        </div>
        
        <div className="materiais-main">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>A carregar materiais...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Erro ao carregar materiais: {error}</p>
              <button onClick={() => window.location.reload()} className="btn-retry">
                Tentar novamente
              </button>
            </div>
          ) : materiais.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <h3>Nenhum material encontrado</h3>
              <p>Não foram encontrados materiais com os critérios especificados.</p>
              <div className="empty-actions">
                <button onClick={handleLimparFiltros} className="btn-secondary">
                  Limpar filtros
                </button>
                <Link to="/materiais/novo" className="btn-primary">
                  Adicionar Material
                </Link>
              </div>
            </div>
          ) : (
            <>
              {viewMode === 'list' ? (
                <div className="materiais-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Unidade</th>
                        <th>Preço Unitário</th>
                        <th>Stock</th>
                        <th>Última Atualização</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materiais.map((material) => (
                        <tr key={material.id}>
                          <td>{material.codigo}</td>
                          <td>
                            <Link to={`/materiais/${material.id}`} className="material-name-link">
                              {material.nome}
                            </Link>
                          </td>
                          <td>{material.categoria}</td>
                          <td>{material.unidade}</td>
                          <td>{material.preco_unitario.toFixed(2)} €</td>
                          <td>
                            <span className="stock-badge stock-ok">
                              Disponível
                            </span>
                          </td>
                          <td>{material.ultima_atualizacao}</td>
                          <td>
                            <div className="action-buttons">
                              <Link to={`/materiais/${material.id}`} className="btn-icon" title="Ver detalhes">
                                <i className="fas fa-eye"></i>
                              </Link>
                              <Link to={`/materiais/${material.id}/editar`} className="btn-icon" title="Editar">
                                <i className="fas fa-edit"></i>
                              </Link>
                              <button className="btn-icon" title="Eliminar">
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="materiais-grid">
                  {materiais.map((material) => (
                    <div key={material.id} className="material-card">
                      <div className="material-card-header">
                        <span className="material-codigo">{material.codigo}</span>
                        <span className="stock-badge stock-ok">Disponível</span>
                      </div>
                      <div className="material-card-body">
                        <div className="material-image">
                          {material.foto_url ? (
                            <img src={material.foto_url} alt={material.nome} />
                          ) : (
                            <div className="material-placeholder">
                              <i className="fas fa-box"></i>
                            </div>
                          )}
                        </div>
                        <h3 className="material-nome">{material.nome}</h3>
                        <p className="material-categoria">{material.categoria}</p>
                        <p className="material-preco">{material.preco_unitario.toFixed(2)} € / {material.unidade}</p>
                      </div>
                      <div className="material-card-footer">
                        <Link to={`/materiais/${material.id}`} className="btn-secondary">
                          Ver detalhes
                        </Link>
                        <div className="card-actions">
                          <Link to={`/materiais/${material.id}/editar`} className="btn-icon" title="Editar">
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button className="btn-icon" title="Eliminar">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Paginação */}
              <div className="pagination">
                <button 
                  className="pagination-btn" 
                  disabled={filtros.pagina === 1}
                  onClick={() => handleChangePagina(filtros.pagina - 1)}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                <div className="pagination-info">
                  Página {filtros.pagina} de {totalPaginas} 
                  ({totalMateriais} materiais)
                </div>
                
                <button 
                  className="pagination-btn" 
                  disabled={filtros.pagina >= totalPaginas}
                  onClick={() => handleChangePagina(filtros.pagina + 1)}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MateriaisList;