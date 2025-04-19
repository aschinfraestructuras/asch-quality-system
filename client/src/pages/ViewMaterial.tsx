import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { 
  MaterialDetalhes, 
  MaterialStock, 
  MaterialFornecedor,
  MaterialCertificacao,
  MaterialLote,
  MaterialUtilizacao,
  MaterialEnsaio,
  MaterialNaoConformidade
} from '../interfaces/MaterialInterfaces';
import '../styles/ViewMaterial.css';

const ViewMaterial: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Estados para os dados do material
  const [material, setMaterial] = useState<MaterialDetalhes | null>(null);
  const [stock, setStock] = useState<MaterialStock[]>([]);
  const [fornecedores, setFornecedores] = useState<MaterialFornecedor[]>([]);
  const [certificacoes, setCertificacoes] = useState<MaterialCertificacao[]>([]);
  const [lotes, setLotes] = useState<MaterialLote[]>([]);
  const [utilizacoes, setUtilizacoes] = useState<MaterialUtilizacao[]>([]);
  const [ensaios, setEnsaios] = useState<MaterialEnsaio[]>([]);
  const [naoConformidades, setNaoConformidades] = useState<MaterialNaoConformidade[]>([]);
  
  // Estados de UI
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabAtiva, setTabAtiva] = useState<string>('info');
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  
  // Carregar dados do material
  useEffect(() => {
    const carregarDadosMaterial = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Carregar dados básicos do material
        const { data, error } = await supabase
          .from('materiais')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data) {
          setMaterial(data as MaterialDetalhes);
          
          // Após carregar o material, carregar dados relacionados
          await Promise.all([
            carregarStock(),
            carregarFornecedores(),
            carregarCertificacoes(),
            carregarLotes(),
            carregarUtilizacoes(),
            carregarEnsaios(),
            carregarNaoConformidades()
          ]);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocorreu um erro ao carregar os dados do material');
        }
        console.error('Erro:', err);
        
        // Dados simulados para desenvolvimento
        setMaterial({
          id: parseInt(id || '0'),
          codigo: 'MAT-0001',
          nome: 'Betão C30/37',
          descricao: 'Betão estrutural para elementos em contacto com ambientes agressivos',
          categoria: 'Betão',
          subcategoria: 'Estrutural',
          unidade: 'm³',
          preco_unitario: 85.50,
          foto_url: 'https://via.placeholder.com/400x300?text=Bet%C3%A3o+C30/37',
          data_criacao: '2025-01-15',
          ultima_atualizacao: '2025-04-10',
          especificacoes_tecnicas: 'Classe de exposição XC4, consistência S3, Dmáx=22mm',
          dimensoes: 'N/A',
          peso: 2400,
          fabricante: 'BetãoLisboa, Lda.',
          modelo: 'C30/37',
          normas_aplicaveis: ['EN 206-1', 'NP EN 12390'],
          observacoes: 'Manter hidratado durante a cura. Tempo de cura mínimo: 28 dias.'
        });
        
        // Carregar dados simulados relacionados
        carregarDadosSimulados();
      } finally {
        setLoading(false);
      }
    };
    
    carregarDadosMaterial();
  }, [id]);
  
  // Funções para carregar dados relacionados
  const carregarStock = async () => {
    try {
      const { data, error } = await supabase
        .from('material_stock')
        .select('*')
        .eq('material_id', id);
      
      if (error) {
        console.error('Erro ao carregar stock:', error);
      } else if (data) {
        setStock(data as MaterialStock[]);
      }
    } catch (err) {
      console.error('Erro ao carregar stock:', err);
    }
  };
  
  const carregarFornecedores = async () => {
    try {
      const { data, error } = await supabase
        .from('material_fornecedores')
        .select('*, fornecedores(nome)')
        .eq('material_id', id);
      
      if (error) {
        console.error('Erro ao carregar fornecedores:', error);
      } else if (data) {
        // Processar dados para o formato esperado
        const fornecedoresProcessados: MaterialFornecedor[] = data.map(item => ({
          fornecedor_id: item.fornecedor_id,
          fornecedor_nome: item.fornecedores.nome,
          material_id: item.material_id,
          material_nome: material?.nome || '',
          codigo_referencia_fornecedor: item.codigo_referencia,
          preco: item.preco,
          prazo_entrega: item.prazo_entrega,
          ultima_compra: item.ultima_compra,
          avaliacao: item.avaliacao,
          is_preferencial: item.is_preferencial
        }));
        
        setFornecedores(fornecedoresProcessados);
      }
    } catch (err) {
      console.error('Erro ao carregar fornecedores:', err);
    }
  };
  
  const carregarCertificacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('material_certificacoes')
        .select('*')
        .eq('material_id', id);
      
      if (error) {
        console.error('Erro ao carregar certificações:', error);
      } else if (data) {
        setCertificacoes(data as MaterialCertificacao[]);
      }
    } catch (err) {
      console.error('Erro ao carregar certificações:', err);
    }
  };
  
  const carregarLotes = async () => {
    try {
      const { data, error } = await supabase
        .from('material_lotes')
        .select('*, fornecedores(nome)')
        .eq('material_id', id)
        .order('data_recepcao', { ascending: false });
      
      if (error) {
        console.error('Erro ao carregar lotes:', error);
      } else if (data) {
        // Processar dados para o formato esperado
        const lotesProcessados: MaterialLote[] = data.map(item => ({
          id: item.id,
          material_id: item.material_id,
          material_nome: material?.nome || '',
          numero_lote: item.numero_lote,
          fornecedor_id: item.fornecedor_id,
          fornecedor_nome: item.fornecedores.nome,
          data_recepcao: item.data_recepcao,
          quantidade: item.quantidade,
          guia_remessa: item.guia_remessa,
          observacoes: item.observacoes,
          status: item.status
        }));
        
        setLotes(lotesProcessados);
      }
    } catch (err) {
      console.error('Erro ao carregar lotes:', err);
    }
  };
  
  const carregarUtilizacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('material_utilizacoes')
        .select('*, projetos(nome), obras(nome)')
        .eq('material_id', id)
        .order('data_utilizacao', { ascending: false });
      
      if (error) {
        console.error('Erro ao carregar utilizações:', error);
      } else if (data) {
        // Processar dados para o formato esperado
        const utilizacoesProcessadas: MaterialUtilizacao[] = data.map(item => ({
          id: item.id,
          material_id: item.material_id,
          material_nome: material?.nome || '',
          projeto_id: item.projeto_id,
          projeto_nome: item.projetos?.nome || '',
          obra_id: item.obra_id,
          obra_nome: item.obras?.nome || '',
          quantidade: item.quantidade,
          data_utilizacao: item.data_utilizacao,
          lote_id: item.lote_id,
          lote_numero: item.lote_numero,
          autorizado_por: item.autorizado_por,
          observacoes: item.observacoes
        }));
        
        setUtilizacoes(utilizacoesProcessadas);
      }
    } catch (err) {
      console.error('Erro ao carregar utilizações:', err);
    }
  };
  
  const carregarEnsaios = async () => {
    try {
      const { data, error } = await supabase
        .from('material_ensaios')
        .select('*, ensaios(tipo)')
        .eq('material_id', id)
        .order('data_ensaio', { ascending: false });
      
      if (error) {
        console.error('Erro ao carregar ensaios:', error);
      } else if (data) {
        // Processar dados para o formato esperado
        const ensaiosProcessados: MaterialEnsaio[] = data.map(item => ({
          id: item.id,
          material_id: item.material_id,
          material_nome: material?.nome || '',
          ensaio_id: item.ensaio_id,
          ensaio_tipo: item.ensaios?.tipo || '',
          lote_id: item.lote_id,
          lote_numero: item.lote_numero,
          data_ensaio: item.data_ensaio,
          resultado: item.resultado,
          laboratorio: item.laboratorio,
          observacoes: item.observacoes,
          relatorio_url: item.relatorio_url
        }));
        
        setEnsaios(ensaiosProcessados);
      }
    } catch (err) {
      console.error('Erro ao carregar ensaios:', err);
    }
  };
  
  const carregarNaoConformidades = async () => {
    try {
      const { data, error } = await supabase
        .from('material_nao_conformidades')
        .select('*, fornecedores(nome)')
        .eq('material_id', id)
        .order('data_detecao', { ascending: false });
      
      if (error) {
        console.error('Erro ao carregar não conformidades:', error);
      } else if (data) {
        // Processar dados para o formato esperado
        const ncProcessadas: MaterialNaoConformidade[] = data.map(item => ({
          id: item.id,
          material_id: item.material_id,
          material_nome: material?.nome || '',
          lote_id: item.lote_id,
          lote_numero: item.lote_numero,
          fornecedor_id: item.fornecedor_id,
          fornecedor_nome: item.fornecedores?.nome || '',
          data_detecao: item.data_detecao,
          descricao: item.descricao,
          severidade: item.severidade,
          status: item.status,
          acao_corretiva: item.acao_corretiva,
          responsavel: item.responsavel,
          data_resolucao: item.data_resolucao
        }));
        
        setNaoConformidades(ncProcessadas);
      }
    } catch (err) {
      console.error('Erro ao carregar não conformidades:', err);
    }
  };
  
  // Carregar dados simulados para desenvolvimento
  const carregarDadosSimulados = () => {
    // Stock simulado
    setStock([
      {
        id: 1,
        material_id: parseInt(id || '0'),
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
        material_id: parseInt(id || '0'),
        obra_id: 2,
        obra_nome: 'Ponte Vasco da Gama - Manutenção',
        quantidade_disponivel: 35,
        quantidade_reservada: 10,
        quantidade_minima: 20,
        localizacao: 'Armazém Local - Obra',
        data_atualizacao: '2025-04-10'
      }
    ]);
    
    // Fornecedores simulados
    setFornecedores([
      {
        fornecedor_id: 1,
        fornecedor_nome: 'BetãoLisboa, Lda.',
        material_id: parseInt(id || '0'),
        material_nome: 'Betão C30/37',
        codigo_referencia_fornecedor: 'BL-C30',
        preco: 82.50,
        prazo_entrega: 2,
        ultima_compra: '2025-04-05',
        avaliacao: 4.5,
        is_preferencial: true
      },
      {
        fornecedor_id: 2,
        fornecedor_nome: 'Cimentos do Tejo, S.A.',
        material_id: parseInt(id || '0'),
        material_nome: 'Betão C30/37',
        codigo_referencia_fornecedor: 'CT-B37',
        preco: 85.00,
        prazo_entrega: 1,
        ultima_compra: '2025-03-20',
        avaliacao: 4.2,
        is_preferencial: false
      }
    ]);
    
    // Certificações simuladas
    setCertificacoes([
      {
        id: 1,
        material_id: parseInt(id || '0'),
        material_nome: 'Betão C30/37',
        nome_certificacao: 'Certificado de Conformidade CE',
        entidade_certificadora: 'LNEC',
        numero_certificacao: 'CE-1234/2025',
        data_emissao: '2025-01-10',
        data_validade: '2026-01-10',
        documento_url: 'https://example.com/cert/1234',
        status: 'válido'
      },
      {
        id: 2,
        material_id: parseInt(id || '0'),
        material_nome: 'Betão C30/37',
        nome_certificacao: 'Declaração de Desempenho',
        entidade_certificadora: 'BetãoLisboa, Lda.',
        numero_certificacao: 'DoP-B37-2025',
        data_emissao: '2025-01-15',
        documento_url: 'https://example.com/dop/b37',
        status: 'válido'
      }
    ]);
    
    // Lotes simulados
    setLotes([
      {
        id: 1,
        material_id: parseInt(id || '0'),
        material_nome: 'Betão C30/37',
        numero_lote: 'BL-2025-0412',
        fornecedor_id: 1,
        fornecedor_nome: 'BetãoLisboa, Lda.',
        data_recepcao: '2025-04-12',
        quantidade: 50,
        guia_remessa: 'GR-1234/2025',
        status: 'disponível'
      },
      {
        id: 2,
        material_id: parseInt(id || '0'),
        material_nome: 'Betão C30/37',
        numero_lote: 'BL-2025-0405',
        fornecedor_id: 1,
        fornecedor_nome: 'BetãoLisboa, Lda.',
        data_recepcao: '2025-04-05',
        quantidade: 75,
        guia_remessa: 'GR-1215/2025',
        observacoes: 'Entrega parcial',
        status: 'parcialmente utilizado'
      }
    ]);
    
    // Utilizações simuladas
    setUtilizacoes([
      {
        id: 1,
        material_id: parseInt(id || '0'),
        material_nome: 'Betão C30/37',
        projeto_id: 1,
        projeto_nome: 'Obra Ferroviária Setúbal',
        obra_id: 1,
        obra_nome: 'Obra Ferroviária Setúbal',
        quantidade: 25,
        data_utilizacao: '2025-04-14',
        lote_id: 1,
        lote_numero: 'BL-2025-0412',
        autorizado_por: 'João Silva',
        observacoes: 'Fundações Bloco A'
      },
      {
        id: 2,
        material_id: parseInt(id || '0'),
        material_nome: 'Betão C30/37',
        projeto_id: 2,
        projeto_nome: 'Ponte Vasco da Gama - Manutenção',
        obra_id: 2,
        obra_nome: 'Ponte Vasco da Gama - Manutenção',
        quantidade: 15,
        data_utilizacao: '2025-04-10',
        lote_id: 2,
        lote_numero: 'BL-2025-0405',
        autorizado_por: 'Ana Costa',
        observacoes: 'Reparação pilar P12'
      }
    ]);
    
    // Ensaios simulados
    setEnsaios([
      {
        id: 1,
        material_id: parseInt(id || '0'),
        material_nome: 'Betão C30/37',
        ensaio_id: 1,
        ensaio_tipo: 'Resistência à Compressão',
        lote_id: 1,
        lote_numero: 'BL-2025-0412',
        data_ensaio: '2025-04-13',
        resultado: 'conforme',
        laboratorio: 'LabTeste, Lda.',
        relatorio_url: 'https://example.com/ensaios/e1234'
      },
      {
        id: 2,
        material_id: parseInt(id || '0'),
        material_nome: 'Betão C30/37',
        ensaio_id: 2,
        ensaio_tipo: 'Consistência (Abaixamento)',
        lote_id: 1,
        lote_numero: 'BL-2025-0412',
        data_ensaio: '2025-04-12',
        resultado: 'conforme',
        laboratorio: 'In Situ',
        observacoes: 'Realizado no local da obra'
      }
    ]);
    
    // Não conformidades simuladas
    setNaoConformidades([
      {
        id: 1,
        material_id: parseInt(id || '0'),
        material_nome: 'Betão C30/37',
        lote_id: 2,
        lote_numero: 'BL-2025-0405',
        fornecedor_id: 1,
        fornecedor_nome: 'BetãoLisboa, Lda.',
        data_detecao: '2025-04-06',
        descricao: 'Consistência inadequada (mais fluida que o especificado)',
        severidade: 'média',
        status: 'resolvida',
        acao_corretiva: 'Ajuste da mistura no local com adição de cimento',
        responsavel: 'Ricardo Pereira',
        data_resolucao: '2025-04-06'
      }
    ]);
  };
  
  // Manipulador para exclusão de material
  const handleEliminarMaterial = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    try {
      // Eliminar o material
      const { error } = await supabase
        .from('materiais')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Redirecionar para a lista de materiais
      navigate('/materiais');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao eliminar o material');
      }
      console.error('Erro:', err);
      
      // Para fins de desenvolvimento, redirecionar mesmo assim
      navigate('/materiais');
    }
  };
  
  // Cancelar exclusão
  const handleCancelarEliminar = () => {
    setConfirmDelete(false);
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>A carregar dados do material...</p>
      </div>
    );
  }
  
  if (error && !material) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-triangle"></i>
        <p>Erro ao carregar material: {error}</p>
        <button onClick={() => navigate('/materiais')} className="btn-primary">
          Voltar à Lista
        </button>
      </div>
    );
  }
  
  if (!material) {
    return (
      <div className="error-container">
        <i className="fas fa-search"></i>
        <p>Material não encontrado</p>
        <button onClick={() => navigate('/materiais')} className="btn-primary">
          Voltar à Lista
        </button>
      </div>
    );
  }
  
  return (
    <div className="view-material-container">
      {/* Cabeçalho do material */}
      <div className="material-header">
        <div className="material-header-info">
          <div className="material-codigo-badge">{material.codigo}</div>
          <h2>{material.nome}</h2>
          <p className="material-categoria">{material.categoria} {material.subcategoria ? `› ${material.subcategoria}` : ''}</p>
        </div>
        
        <div className="material-header-actions">
          <Link to={`/materiais/${id}/editar`} className="btn-primary">
            <i className="fas fa-edit"></i> Editar
          </Link>
          
          {confirmDelete ? (
            <div className="delete-confirmation">
              <span>Confirmar eliminação?</span>
              <button onClick={handleEliminarMaterial} className="btn-danger">
                Sim
              </button>
              <button onClick={handleCancelarEliminar} className="btn-secondary">
                Não
              </button>
            </div>
          ) : (
            <button onClick={handleEliminarMaterial} className="btn-danger">
              <i className="fas fa-trash-alt"></i> Eliminar
            </button>
          )}
        </div>
      </div>
      
      {/* Alerta de erro */}
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      {/* Tabs de navegação */}
      <div className="material-tabs">
        <button 
          className={`tab-btn ${tabAtiva === 'info' ? 'active' : ''}`}
          onClick={() => setTabAtiva('info')}
        >
          <i className="fas fa-info-circle"></i> Informações
        </button>
        <button 
          className={`tab-btn ${tabAtiva === 'stock' ? 'active' : ''}`}
          onClick={() => setTabAtiva('stock')}
        >
          <i className="fas fa-warehouse"></i> Stock
          <span className="badge">{stock.length}</span>
        </button>
        <button 
          className={`tab-btn ${tabAtiva === 'fornecedores' ? 'active' : ''}`}
          onClick={() => setTabAtiva('fornecedores')}
        >
          <i className="fas fa-truck"></i> Fornecedores
          <span className="badge">{fornecedores.length}</span>
        </button>
        <button 
          className={`tab-btn ${tabAtiva === 'certificacoes' ? 'active' : ''}`}
          onClick={() => setTabAtiva('certificacoes')}
        >
          <i className="fas fa-certificate"></i> Certificações
          <span className="badge">{certificacoes.length}</span>
        </button>
        <button 
          className={`tab-btn ${tabAtiva === 'lotes' ? 'active' : ''}`}
          onClick={() => setTabAtiva('lotes')}
        >
          <i className="fas fa-boxes"></i> Lotes
          <span className="badge">{lotes.length}</span>
        </button>
        <button 
          className={`tab-btn ${tabAtiva === 'utilizacoes' ? 'active' : ''}`}
          onClick={() => setTabAtiva('utilizacoes')}
        >
          <i className="fas fa-clipboard-list"></i> Utilizações
          <span className="badge">{utilizacoes.length}</span>
        </button>
        <button 
          className={`tab-btn ${tabAtiva === 'ensaios' ? 'active' : ''}`}
          onClick={() => setTabAtiva('ensaios')}
        >
          <i className="fas fa-flask"></i> Ensaios
          <span className="badge">{ensaios.length}</span>
        </button>
        <button 
          className={`tab-btn ${tabAtiva === 'nao_conformidades' ? 'active' : ''}`}
          onClick={() => setTabAtiva('nao_conformidades')}
        >
          <i className="fas fa-exclamation-triangle"></i> Não Conformidades
          <span className="badge">{naoConformidades.length}</span>
        </button>
      </div>
      
      {/* Tab de informações gerais */}
      <div className={`tab-content ${tabAtiva === 'info' ? 'active' : ''}`}>
        <div className="material-info-container">
          <div className="material-info-main">
            <div className="material-info-section">
              <h3>Informações Gerais</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Código</span>
                  <span className="info-value">{material.codigo}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Nome</span>
                  <span className="info-value">{material.nome}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Categoria</span>
                  <span className="info-value">{material.categoria}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Subcategoria</span>
                  <span className="info-value">{material.subcategoria || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Unidade</span>
                  <span className="info-value">{material.unidade}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Preço Unitário</span>
                  <span className="info-value">{material.preco_unitario.toFixed(2)} €</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Data de Criação</span>
                  <span className="info-value">{material.data_criacao}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Última Atualização</span>
                  <span className="info-value">{material.ultima_atualizacao}</span>
                </div>
              </div>
            </div>
            
            <div className="material-info-section">
              <h3>Especificações Técnicas</h3>
              <div className="info-grid">
                <div className="info-item full-width">
                  <span className="info-label">Descrição</span>
                  <span className="info-value">{material.descricao || '-'}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Especificações</span>
                  <span className="info-value">{material.especificacoes_tecnicas || '-'}</span>
                  </div>
                <div className="info-item">
                  <span className="info-label">Dimensões</span>
                  <span className="info-value">{material.dimensoes || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Peso</span>
                  <span className="info-value">{material.peso ? `${material.peso} kg` : '-'}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Fabricante</span>
                  <span className="info-value">{material.fabricante || '-'}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Modelo</span>
                  <span className="info-value">{material.modelo || '-'}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Normas Aplicáveis</span>
                  <span className="info-value">
                    {material.normas_aplicaveis && material.normas_aplicaveis.length > 0
                      ? material.normas_aplicaveis.join(', ')
                      : '-'}
                  </span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Observações</span>
                  <span className="info-value">{material.observacoes || '-'}</span>
                </div>
              </div> {/* fecha info-grid */}
            </div> {/* fecha material-info-section */}
          </div> {/* fecha material-info-main */}
        </div> {/* fecha material-info-container */}
      </div> {/* fecha tab-content info */}

      {/* Aqui podem ser adicionadas outras tabs se quiseres depois */}
    </div> // fecha view-material-container
  );
};

export default ViewMaterial;
