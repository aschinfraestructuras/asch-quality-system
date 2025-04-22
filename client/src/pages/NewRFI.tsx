
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faSave, faTimes, faPaperclip, faQuestionCircle,
  faExclamationTriangle, faBuilding, faUserTie, faInfoCircle,
  faUpload, faFile, faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Documentos.css';

// Interfaces
interface Obra {
  id: number;
  nome: string;
}

interface Destinatario {
  id: number;
  nome: string;
  categoria: string;
}

interface Anexo {
  id: number;
  nome: string;
  tipo: string;
  tamanho: string;
  progresso?: number;
}

const NewRFI: React.FC = () => {
  const navigate = useNavigate();

  // Estados
  const [formData, setFormData] = useState({
    assunto: '',
    obra: '',
    destinatario: '',
    urgencia: 'media',
    descricao: '',
  });
  const [obras, setObras] = useState<Obra[]>([]);
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>([]);
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [mostrarDica, setMostrarDica] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState<{[key: string]: string}>({});
  const [uploading, setUploading] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      const obrasMock: Obra[] = [
        { id: 1, nome: 'Obra Ferroviária Setúbal' },
        { id: 2, nome: 'Metro de Lisboa - Expansão' },
        { id: 3, nome: 'Ampliação Terminal Portuário' },
        { id: 4, nome: 'Reabilitação Urbana Baixa' }
      ];
      
      const destinatariosMock: Destinatario[] = [
        { id: 1, nome: 'Projectista', categoria: 'Projecto' },
        { id: 2, nome: 'Direcção de Obra', categoria: 'Construção' },
        { id: 3, nome: 'Fiscalização', categoria: 'Supervisão' },
        { id: 4, nome: 'Dono de Obra', categoria: 'Cliente' },
        { id: 5, nome: 'Coordenação de Projecto', categoria: 'Projecto' },
        { id: 6, nome: 'Consultores Externos', categoria: 'Consultoria' }
      ];
      
      setObras(obrasMock);
      setDestinatarios(destinatariosMock);
    }, 300);
  }, []);

  // Manipuladores de eventos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro quando campo é editado
    if (erros[name]) {
      setErros(prev => {
        const newErros = { ...prev };
        delete newErros[name];
        return newErros;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      
      // Simular upload de arquivos
      const novosAnexos: Anexo[] = Array.from(e.target.files).map((file, index) => ({
        id: Date.now() + index,
        nome: file.name,
        tipo: file.type.split('/')[1].toUpperCase(),
        tamanho: formatarTamanhoArquivo(file.size),
        progresso: 0
      }));
      
      setAnexos(prev => [...prev, ...novosAnexos]);
      
      // Simular progresso de upload
      novosAnexos.forEach(anexo => {
        const intervalId = setInterval(() => {
          setAnexos(prevAnexos => 
            prevAnexos.map(a => 
              a.id === anexo.id 
                ? { ...a, progresso: a.progresso ? Math.min(a.progresso + 20, 100) : 20 } 
                : a
            )
          );
        }, 500);
        
        // Finalizar após completar
        setTimeout(() => {
          clearInterval(intervalId);
        }, 2500);
      });
      
      setUploading(false);
    }
  };

  const formatarTamanhoArquivo = (bytes: number) => {
    const tamanhos = ['Bytes', 'KB', 'MB', 'GB'];
    let i = 0;
    while (bytes >= 1024 && i < tamanhos.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(1)} ${tamanhos[i]}`;
  };

  const removerAnexo = (id: number) => {
    setAnexos(prev => prev.filter(anexo => anexo.id !== id));
  };

  const validarFormulario = () => {
    const novosErros: {[key: string]: string} = {};
    if (!formData.assunto.trim()) novosErros.assunto = 'O assunto é obrigatório.';
    if (!formData.obra) novosErros.obra = 'Selecione a obra.';
    if (!formData.destinatario) novosErros.destinatario = 'Selecione o destinatário.';
    if (!formData.descricao.trim()) novosErros.descricao = 'A descrição não pode estar vazia.';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const submeterFormulario = () => {
    if (!validarFormulario()) return;
    setCarregando(true);

    setTimeout(() => {
      setCarregando(false);
      alert('RFI criado com sucesso!');
      navigate('/documentos/rfis');
    }, 1200);
  };

  return (
    <div className="formulario-container">
      <div className="formulario-topo">
        <button onClick={() => navigate(-1)} className="btn-voltar">
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar
        </button>
        <h1><FontAwesomeIcon icon={faQuestionCircle} /> Novo Pedido de Informação (RFI)</h1>
      </div>

      <div className="formulario-corpo">
        <div className="form-group">
          <label>Assunto</label>
          <input 
            type="text"
            name="assunto"
            value={formData.assunto}
            onChange={handleInputChange}
            className={erros.assunto ? 'input-erro' : ''}
            placeholder="Ex: Clarificação técnica sobre armadura"
          />
          {erros.assunto && <span className="erro-msg">{erros.assunto}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><FontAwesomeIcon icon={faBuilding} /> Obra</label>
            <select 
              name="obra"
              value={formData.obra}
              onChange={handleInputChange}
              className={erros.obra ? 'input-erro' : ''}
            >
              <option value="">Selecione...</option>
              {obras.map(obra => (
                <option key={obra.id} value={obra.nome}>{obra.nome}</option>
              ))}
            </select>
            {erros.obra && <span className="erro-msg">{erros.obra}</span>}
          </div>

          <div className="form-group">
            <label><FontAwesomeIcon icon={faUserTie} /> Destinatário</label>
            <select 
              name="destinatario"
              value={formData.destinatario}
              onChange={handleInputChange}
              className={erros.destinatario ? 'input-erro' : ''}
            >
              <option value="">Selecione...</option>
              {destinatarios.map(dest => (
                <option key={dest.id} value={dest.nome}>{dest.nome} ({dest.categoria})</option>
              ))}
            </select>
            {erros.destinatario && <span className="erro-msg">{erros.destinatario}</span>}
          </div>
        </div>

        <div className="form-group">
          <label><FontAwesomeIcon icon={faInfoCircle} /> Descrição</label>
          <textarea 
            name="descricao"
            rows={5}
            value={formData.descricao}
            onChange={handleInputChange}
            className={erros.descricao ? 'input-erro' : ''}
          />
          {erros.descricao && <span className="erro-msg">{erros.descricao}</span>}
        </div>

        <div className="form-group">
          <label>Urgência</label>
          <select 
            name="urgencia"
            value={formData.urgencia}
            onChange={handleInputChange}
          >
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>

        <div className="form-group">
          <label><FontAwesomeIcon icon={faPaperclip} /> Anexar Ficheiros</label>
          <input type="file" multiple onChange={handleFileChange} />
          <div className="anexos-lista">
            {anexos.map(anexo => (
              <div key={anexo.id} className="anexo">
                <FontAwesomeIcon icon={faFile} /> {anexo.nome}
                <span className="tag">{anexo.tipo} - {anexo.tamanho}</span>
                {anexo.progresso !== undefined && anexo.progresso < 100 && (
                  <progress value={anexo.progresso} max="100" />
                )}
                <button onClick={() => removerAnexo(anexo.id)} className="btn-remover-anexo">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {mostrarDica && (
          <div className="dica-box">
            <FontAwesomeIcon icon={faExclamationTriangle} /> Por favor, verifique se os dados estão completos antes de submeter.
            <button onClick={() => setMostrarDica(false)}><FontAwesomeIcon icon={faTimes} /></button>
          </div>
        )}
      </div>

      <div className="formulario-footer">
        <button className="btn-secundario" onClick={() => navigate(-1)}>
          Cancelar
        </button>
        <button className="btn-primario" onClick={submeterFormulario} disabled={carregando}>
          <FontAwesomeIcon icon={faSave} /> {carregando ? 'A enviar...' : 'Submeter'}
        </button>
      </div>
    </div>
  );
};

export default NewRFI;
