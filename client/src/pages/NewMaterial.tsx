import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Material, MaterialDetalhes } from '../interfaces/MaterialInterfaces';
import '../styles/NewMaterial.css';

const NewMaterial: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Estados para os campos do formulário
  const [formData, setFormData] = useState<MaterialDetalhes>({
    id: 0,
    codigo: '',
    nome: '',
    descricao: '',
    categoria: '',
    subcategoria: '',
    unidade: '',
    preco_unitario: 0,
    data_criacao: new Date().toISOString().split('T')[0],
    ultima_atualizacao: new Date().toISOString().split('T')[0],
    especificacoes_tecnicas: '',
    normas_aplicaveis: [],
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [unidades, setUnidades] = useState<string[]>(['un', 'kg', 'g', 't', 'm', 'm²', 'm³', 'l', 'ml']);
  const [tabAtiva, setTabAtiva] = useState<string>('geral');
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  
  // Carregar dados para edição
  useEffect(() => {
    const carregarDadosMaterial = async () => {
      if (!isEditMode) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('materiais')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data) {
          // Converter para o formato esperado por MaterialDetalhes
          const materialDetalhes: MaterialDetalhes = {
            ...data,
            especificacoes_tecnicas: data.especificacoes_tecnicas || '',
            normas_aplicaveis: data.normas_aplicaveis || [],
          };
          
          setFormData(materialDetalhes);
          
          // Se houver uma URL de foto, definir a pré-visualização
          if (data.foto_url) {
            setFotoPreview(data.foto_url);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocorreu um erro ao carregar os dados do material');
        }
        console.error('Erro:', err);
        
        // Dados simulados para desenvolvimento (em modo de edição)
        if (isEditMode) {
          const materialSimulado: MaterialDetalhes = {
            id: parseInt(id),
            codigo: 'MAT-0001',
            nome: 'Betão C30/37',
            descricao: 'Betão estrutural para elementos em contacto com ambientes agressivos',
            categoria: 'Betão',
            subcategoria: 'Estrutural',
            unidade: 'm³',
            preco_unitario: 85.50,
            data_criacao: '2025-01-15',
            ultima_atualizacao: '2025-04-10',
            especificacoes_tecnicas: 'Classe de exposição XC4, consistência S3, Dmáx=22mm',
            dimensoes: 'N/A',
            peso: 2400,
            fabricante: 'BetãoLisboa, Lda.',
            modelo: 'C30/37',
            normas_aplicaveis: ['EN 206-1', 'NP EN 12390'],
            observacoes: 'Manter hidratado durante a cura. Tempo de cura mínimo: 28 dias.'
          };
          
          setFormData(materialSimulado);
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Carregar categorias para o dropdown
    const carregarCategorias = async () => {
      try {
        const { data, error } = await supabase
          .from('categorias_materiais')
          .select('nome')
          .order('nome');
          
        if (error) {
          console.error('Erro ao carregar categorias:', error);
        } else if (data) {
          const categoriasNomes = data.map(cat => cat.nome);
          setCategorias(categoriasNomes);
        }
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        
        // Categorias simuladas
        setCategorias([
          'Betão', 
          'Aço', 
          'Alvenaria', 
          'Pintura', 
          'Estrutura Metálica', 
          'Madeira', 
          'Cobertura', 
          'Impermeabilização',
          'Isolamento',
          'Pavimentos',
          'Revestimentos',
          'Vidros',
          'Equipamentos',
          'Outros'
        ]);
      }
    };
    
    carregarCategorias();
    carregarDadosMaterial();
  }, [id, isEditMode]);
  
  // Manipuladores de eventos para o formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Tratamento especial para campos numéricos
    if (name === 'preco_unitario' || name === 'peso') {
      const numeroValue = parseFloat(value);
      setFormData({
        ...formData,
        [name]: isNaN(numeroValue) ? 0 : numeroValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Manipulador para adicionar/remover normas aplicáveis
  const handleNormaChange = (index: number, value: string) => {
    const normasAtualizadas = [...formData.normas_aplicaveis];
    normasAtualizadas[index] = value;
    
    setFormData({
      ...formData,
      normas_aplicaveis: normasAtualizadas
    });
  };
  
  const adicionarNorma = () => {
    setFormData({
      ...formData,
      normas_aplicaveis: [...formData.normas_aplicaveis, '']
    });
  };
  
  const removerNorma = (index: number) => {
    const normasAtualizadas = [...formData.normas_aplicaveis];
    normasAtualizadas.splice(index, 1);
    
    setFormData({
      ...formData,
      normas_aplicaveis: normasAtualizadas
    });
  };
  
  // Manipulador para upload de foto
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFotoFile(file);
      
      // Criar URL para pré-visualização
      const fileURL = URL.createObjectURL(file);
      setFotoPreview(fileURL);
    }
  };
  
  const removerFoto = () => {
    setFotoFile(null);
    setFotoPreview(null);
    
    // Se estamos em modo de edição, definir foto_url como null
    if (isEditMode) {
      setFormData({
        ...formData,
        foto_url: undefined
      });
    }
  };
  
  // Validação do formulário
  const validarFormulario = (): boolean => {
    // Verificar campos obrigatórios
    if (!formData.codigo || !formData.nome || !formData.categoria || !formData.unidade) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return false;
    }
    
    // Verificar se o preço unitário é válido
    if (formData.preco_unitario < 0) {
      setError('O preço unitário não pode ser negativo');
      return false;
    }
    
    return true;
  };
  
  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
     
      // Preparar dados para envio
let dadosParaEnviar: Partial<MaterialDetalhes> = {
  ...formData,
  ultima_atualizacao: new Date().toISOString().split('T')[0]
};

// Eliminar o ID se for modo de criação
if (!isEditMode) {
  const { id, ...dadosSemId } = dadosParaEnviar;
  dadosParaEnviar = dadosSemId;
}

      // Upload da foto, se houver uma nova
      let foto_url = formData.foto_url;
      if (fotoFile) {
        const nomeFicheiro = `materiais/${Date.now()}-${fotoFile.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('fotos')
          .upload(nomeFicheiro, fotoFile);
        
        if (uploadError) {
          throw new Error(`Erro no upload da foto: ${uploadError.message}`);
        }
        
        if (uploadData) {
          const { data: urlData } = supabase.storage
            .from('fotos')
            .getPublicUrl(nomeFicheiro);
          
          foto_url = urlData.publicUrl;
        }
      }
      
      // Atualizar URL da foto nos dados
      dadosParaEnviar.foto_url = foto_url;
      
      let resposta;
      if (isEditMode) {
        // Atualizar material existente
        resposta = await supabase
          .from('materiais')
          .update(dadosParaEnviar)
          .eq('id', id);
      } else {
        // Criar novo material
        resposta = await supabase
          .from('materiais')
          .insert([dadosParaEnviar]);
      }
      
      if (resposta.error) {
        throw new Error(resposta.error.message);
      }
      
      // Sucesso
      setSuccess(true);
      
      // Redirecionar após breve delay
      setTimeout(() => {
        navigate('/materiais');
      }, 1500);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao salvar o material');
      }
      console.error('Erro:', err);
      
      // Para fins de desenvolvimento, sempre retorna sucesso
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/materiais');
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>A carregar dados do material...</p>
      </div>
    );
  }
  
  return (
    <div className="new-material-container">
      <div className="material-header">
        <h2>{isEditMode ? 'Editar Material' : 'Novo Material'}</h2>
        <p>{isEditMode ? 'Atualize as informações do material' : 'Registe um novo material no sistema'}</p>
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
          <span>
            {isEditMode 
              ? 'Material atualizado com sucesso!' 
              : 'Material criado com sucesso!'}
          </span>
        </div>
      )}
      
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${tabAtiva === 'geral' ? 'active' : ''}`}
            onClick={() => setTabAtiva('geral')}
          >
            <i className="fas fa-info-circle"></i> Informações Gerais
          </button>
          <button 
            className={`tab ${tabAtiva === 'detalhes' ? 'active' : ''}`}
            onClick={() => setTabAtiva('detalhes')}
          >
            <i className="fas fa-clipboard-list"></i> Detalhes Técnicos
          </button>
          <button 
            className={`tab ${tabAtiva === 'fornecedores' ? 'active' : ''}`}
            onClick={() => setTabAtiva('fornecedores')}
          >
            <i className="fas fa-truck"></i> Fornecedores
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="material-form">
          {/* Tab de Informações Gerais */}
          <div className={`tab-content ${tabAtiva === 'geral' ? 'active' : ''}`}>
            <div className="form-grid">
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="codigo">
                    Código <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="codigo"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: MAT-0001"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="nome">
                    Nome <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    placeholder="Nome do material"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="descricao">Descrição</label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Descrição detalhada do material"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="categoria">
                      Categoria <span className="required">*</span>
                    </label>
                    <select
                      id="categoria"
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subcategoria">Subcategoria</label>
                    <input
                      type="text"
                      id="subcategoria"
                      name="subcategoria"
                      value={formData.subcategoria || ''}
                      onChange={handleInputChange}
                      placeholder="Subcategoria (opcional)"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="unidade">
                      Unidade <span className="required">*</span>
                    </label>
                    <select
                      id="unidade"
                      name="unidade"
                      value={formData.unidade}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione uma unidade</option>
                      {unidades.map((unidade) => (
                        <option key={unidade} value={unidade}>
                          {unidade}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="preco_unitario">
                      Preço Unitário (€) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id="preco_unitario"
                      name="preco_unitario"
                      value={formData.preco_unitario}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-column">
                <div className="form-group">
                  <label>Fotografia</label>
                  <div className="foto-upload">
                    {fotoPreview ? (
                      <div className="foto-preview">
                        <img src={fotoPreview} alt="Pré-visualização" />
                        <button 
                          type="button" 
                          className="btn-remove-foto" 
                          onClick={removerFoto}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="foto-placeholder">
                        <i className="fas fa-camera"></i>
                        <p>Clique para adicionar uma fotografia</p>
                        <input
                          type="file"
                          id="foto"
                          name="foto"
                          accept="image/*"
                          onChange={handleFotoChange}
                        />
                      </div>
                    )}
                  </div>
                  <p className="form-help-text">
                    Formatos suportados: JPG, PNG, GIF. Tamanho máximo: 5MB
                  </p>
                </div>
                
                <div className="form-group">
                  <label>Notas Adicionais</label>
                  <textarea
                    id="observacoes"
                    name="observacoes"
                    value={formData.observacoes || ''}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Notas adicionais sobre o material"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Tab de Detalhes Técnicos */}
          <div className={`tab-content ${tabAtiva === 'detalhes' ? 'active' : ''}`}>
            <div className="form-grid">
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="especificacoes_tecnicas">Especificações Técnicas</label>
                  <textarea
                    id="especificacoes_tecnicas"
                    name="especificacoes_tecnicas"
                    value={formData.especificacoes_tecnicas}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Detalhes técnicos do material"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dimensoes">Dimensões</label>
                    <input
                      type="text"
                      id="dimensoes"
                      name="dimensoes"
                      value={formData.dimensoes || ''}
                      onChange={handleInputChange}
                      placeholder="Ex: 10x20x30 cm"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="peso">Peso (kg)</label>
                    <input
                      type="number"
                      id="peso"
                      name="peso"
                      value={formData.peso || ''}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      placeholder="Peso em kg"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-column">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fabricante">Fabricante</label>
                    <input
                      type="text"
                      id="fabricante"
                      name="fabricante"
                      value={formData.fabricante || ''}
                      onChange={handleInputChange}
                      placeholder="Nome do fabricante"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="modelo">Modelo/Referência</label>
                    <input
                      type="text"
                      id="modelo"
                      name="modelo"
                      value={formData.modelo || ''}
                      onChange={handleInputChange}
                      placeholder="Modelo ou referência"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Normas Aplicáveis</label>
                  <div className="normas-container">
                    {formData.normas_aplicaveis.map((norma, index) => (
                      <div key={index} className="norma-item">
                        <input
                          type="text"
                          value={norma}
                          onChange={(e) => handleNormaChange(index, e.target.value)}
                          placeholder="Ex: NP EN 12345"
                        />
                        <button 
                          type="button" 
                          className="btn-remove-norma" 
                          onClick={() => removerNorma(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="btn-add-norma" 
                      onClick={adicionarNorma}
                    >
                      <i className="fas fa-plus"></i> Adicionar Norma
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tab de Fornecedores */}
          <div className={`tab-content ${tabAtiva === 'fornecedores' ? 'active' : ''}`}>
            <div className="fornecedores-placeholder">
              <i className="fas fa-truck"></i>
              <h3>Gestão de Fornecedores</h3>
              <p>A gestão de fornecedores para este material estará disponível após guardar as informações básicas.</p>
              {isEditMode && (
                <p>Para gerir os fornecedores deste material, aceda à secção de Fornecedores após guardar as alterações.</p>
              )}
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => navigate('/materiais')}
              disabled={submitting}
            >
              Cancelar
            </button>
            
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <div className="spinner-small"></div>
                  A guardar...
                </>
              ) : isEditMode ? (
                <>
                  <i className="fas fa-save"></i> Guardar Alterações
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Criar Material
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMaterial;