import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NewNaoConformidade.css';

// Dados de exemplo para os selects
interface Projeto {
  id: number;
  nome: string;
}

interface Responsavel {
  id: number;
  nome: string;
}

interface FormData {
  titulo: string;
  descricao: string;
  projeto: string;
  data: string;
  gravidade: string;
  origem: string;
  tipo: string;
  responsavel: string;
  prazoCorrecao: string;
  acaoImediata: string;
  acaoCorretiva: string;
  anexos: File[];
}

const projetos: Projeto[] = [
  { id: 1, nome: 'Obra Ferroviária Setúbal' },
  { id: 2, nome: 'Ponte Vasco da Gama - Manutenção' },
  { id: 3, nome: 'Ampliação Terminal Portuário' }
];

const responsaveis: Responsavel[] = [
  { id: 1, nome: 'João Silva' },
  { id: 2, nome: 'Ana Costa' },
  { id: 3, nome: 'Manuel Gomes' },
  { id: 4, nome: 'Sofia Martins' },
  { id: 5, nome: 'Carlos Oliveira' }
];

const origens: string[] = [
  'Inspeção Visual',
  'Ensaio Laboratorial',
  'Auditoria Interna',
  'Reclamação Cliente',
  'Verificação de Checklist',
  'Entrega de Material',
  'Controlo de Processo'
];

const tiposNC: string[] = [
  'Estrutural',
  'Material',
  'Processo',
  'Documental',
  'Regulamentar',
  'Segurança',
  'Ambiental'
];

const NewNaoConformidade: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    descricao: '',
    projeto: '',
    data: new Date().toISOString().split('T')[0],
    gravidade: 'Média',
    origem: '',
    tipo: '',
    responsavel: '',
    prazoCorrecao: '',
    acaoImediata: '',
    acaoCorretiva: '',
    anexos: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        anexos: [...formData.anexos, ...Array.from(e.target.files)]
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    const newAnexos = [...formData.anexos];
    newAnexos.splice(index, 1);
    setFormData({ ...formData, anexos: newAnexos });
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aqui seria implementada a lógica para salvar os dados
    console.log('Dados da não conformidade:', formData);
    alert('Não conformidade registada com sucesso!');
    navigate('/nao-conformidades');
  };

  return (
    <div className="new-nao-conformidade">
      <h2>Registar Nova Não Conformidade</h2>
      
      <div className="stepper">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-title">Identificação</div>
        </div>
        <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-title">Classificação</div>
        </div>
        <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-title">Tratamento</div>
        </div>
        <div className={`step-line ${currentStep >= 4 ? 'active' : ''}`}></div>
        <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-title">Documentos</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="form-step">
            <h3>Identificação da Não Conformidade</h3>
            
            <div className="form-group">
              <label htmlFor="titulo">Título</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                placeholder="Título da não conformidade"
              />
            </div>

            <div className="form-group">
              <label htmlFor="descricao">Descrição Detalhada</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Descreva detalhadamente a não conformidade observada"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="projeto">Projeto</label>
                <select
                  id="projeto"
                  name="projeto"
                  value={formData.projeto}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o projeto</option>
                  {projetos.map(projeto => (
                    <option key={projeto.id} value={projeto.nome}>
                      {projeto.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="data">Data de Identificação</label>
                <input
                  type="date"
                  id="data"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="button" className="btn-cancelar" onClick={() => navigate('/nao-conformidades')}>
                Cancelar
              </button>
              <button type="button" className="btn-continuar" onClick={nextStep}>
                Continuar
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step">
            <h3>Classificação da Não Conformidade</h3>
            
            <div className="form-group">
              <label htmlFor="gravidade">Gravidade</label>
              <select
                id="gravidade"
                name="gravidade"
                value={formData.gravidade}
                onChange={handleChange}
                required
              >
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="origem">Origem</label>
                <select
                  id="origem"
                  name="origem"
                  value={formData.origem}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione a origem</option>
                  {origens.map((origem, index) => (
                    <option key={index} value={origem}>
                      {origem}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tipo">Tipo</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  {tiposNC.map((tipo, index) => (
                    <option key={index} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-buttons">
              <button type="button" className="btn-voltar" onClick={prevStep}>
                Voltar
              </button>
              <button type="button" className="btn-continuar" onClick={nextStep}>
                Continuar
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step">
            <h3>Tratamento da Não Conformidade</h3>
            
            <div className="form-group">
              <label htmlFor="responsavel">Responsável pelo Tratamento</label>
              <select
                id="responsavel"
                name="responsavel"
                value={formData.responsavel}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o responsável</option>
                {responsaveis.map(responsavel => (
                  <option key={responsavel.id} value={responsavel.nome}>
                    {responsavel.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prazoCorrecao">Prazo para Correção</label>
              <input
                type="date"
                id="prazoCorrecao"
                name="prazoCorrecao"
                value={formData.prazoCorrecao}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="acaoImediata">Ação Imediata</label>
              <textarea
                id="acaoImediata"
                name="acaoImediata"
                value={formData.acaoImediata}
                onChange={handleChange}
                rows={3}
                placeholder="Descreva a ação imediata a ser tomada"
              />
            </div>

            <div className="form-group">
              <label htmlFor="acaoCorretiva">Ação Corretiva Proposta</label>
              <textarea
                id="acaoCorretiva"
                name="acaoCorretiva"
                value={formData.acaoCorretiva}
                onChange={handleChange}
                rows={3}
                placeholder="Descreva a ação corretiva proposta para evitar recorrência"
              />
            </div>

            <div className="form-buttons">
              <button type="button" className="btn-voltar" onClick={prevStep}>
                Voltar
              </button>
              <button type="button" className="btn-continuar" onClick={nextStep}>
                Continuar
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="form-step">
            <h3>Documentos</h3>
            
            <div className="form-group">
              <label htmlFor="anexos">Anexar Documentos</label>
              <div className="file-upload">
                <input
                  type="file"
                  id="anexos"
                  name="anexos"
                  onChange={handleFileChange}
                  multiple
                />
                <label htmlFor="anexos" className="file-upload-label">
                  <i className="fas fa-cloud-upload-alt"></i> Selecionar Ficheiros
                </label>
              </div>
            </div>

            {formData.anexos.length > 0 && (
              <div className="anexos-list">
                <h4>Documentos Anexados:</h4>
                <ul>
                  {formData.anexos.map((file, index) => (
                    <li key={index}>
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
                      <button 
                        type="button" 
                        className="btn-remove-file"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="form-buttons">
              <button type="button" className="btn-voltar" onClick={prevStep}>
                Voltar
              </button>
              <button type="submit" className="btn-registar">
                Registar Não Conformidade
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewNaoConformidade;