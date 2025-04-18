import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NewEnsaio.css';

// Tipos para o formulário de ensaio
interface EnsaioForm {
  name: string;
  type: string;
  project: string;
  material: string;
  normReference: string;
  testDate: string;
  description: string;
  technician: string;
  equipment: string[];
  samples: Sample[];
  results: Result[];
}

interface Sample {
  id: string;
  code: string;
  description: string;
  collectionDate: string;
  collectionLocation: string;
}

interface Result {
  id: string;
  parameter: string;
  value: string;
  unit: string;
  minValue?: string;
  maxValue?: string;
  isConform?: boolean;
}

// Dados para seleção
const projectOptions = [
  'Obra Ferroviária Setúbal',
  'Ponte Vasco da Gama - Manutenção',
  'Ampliação Terminal Portuário',
  'Edifício Sede - Lisboa',
  'Barragem Norte'
];

const materialOptions = [
  'Concreto',
  'Solo',
  'Aço',
  'Balastro',
  'Agregado',
  'Asfalto',
  'Outro'
];

const ensaioTypes = [
  {
    category: 'Concreto',
    types: [
      { id: 'comp-concreto', name: 'Compressão', norm: 'NBR 5739' },
      { id: 'abat-concreto', name: 'Abatimento', norm: 'NBR NM 67' },
      { id: 'trac-concreto', name: 'Tração por Compressão Diametral', norm: 'NBR 7222' },
      { id: 'mod-concreto', name: 'Módulo de Elasticidade', norm: 'NBR 8522' }
    ]
  },
  {
    category: 'Solos',
    types: [
      { id: 'cbr-solo', name: 'CBR', norm: 'ASTM D1883' },
      { id: 'comp-solo', name: 'Compactação', norm: 'NBR 7182' },
      { id: 'gran-solo', name: 'Granulometria', norm: 'NBR 7181' },
      { id: 'lim-solo', name: 'Limites de Atterberg', norm: 'NBR 6459/7180' }
    ]
  },
  {
    category: 'Agregados',
    types: [
      { id: 'gran-agreg', name: 'Granulométrica', norm: 'NBR NM 248' },
      { id: 'abs-agreg', name: 'Absorção de Água', norm: 'NBR NM 30' },
      { id: 'abr-agreg', name: 'Abrasão Los Angeles', norm: 'NBR NM 51' }
    ]
  },
  {
    category: 'Estruturais',
    types: [
      { id: 'trac-aco', name: 'Tração', norm: 'ISO 6892-1' },
      { id: 'flex-aco', name: 'Flexão', norm: 'ASTM E290' },
      { id: 'dur-aco', name: 'Dureza', norm: 'ASTM E18' }
    ]
  }
];

// Definições de parâmetros por tipo de ensaio
const ensaioParameters: Record<string, { parameters: { name: string, unit: string, min?: string, max?: string }[] }> = {
  'comp-concreto': {
    parameters: [
      { name: 'Resistência à Compressão', unit: 'MPa', min: '20', max: '40' },
      { name: 'Diâmetro do Corpo de Prova', unit: 'mm' },
      { name: 'Altura do Corpo de Prova', unit: 'mm' },
      { name: 'Idade', unit: 'dias' }
    ]
  },
  'abat-concreto': {
    parameters: [
      { name: 'Abatimento', unit: 'cm', min: '8', max: '12' },
      { name: 'Temperatura do Concreto', unit: '°C', min: '15', max: '30' }
    ]
  },
  'cbr-solo': {
    parameters: [
      { name: 'Valor CBR', unit: '%', min: '10', max: '100' },
      { name: 'Expansão', unit: '%', min: '0', max: '2' },
      { name: 'Umidade Ótima', unit: '%' },
      { name: 'Massa Específica Máxima', unit: 'g/cm³' }
    ]
  },
  'gran-agreg': {
    parameters: [
      { name: 'Módulo de Finura', unit: '' },
      { name: 'Dimensão Máxima', unit: 'mm' },
      { name: 'Teor de Material Pulverulento', unit: '%', min: '0', max: '5' }
    ]
  },
  'trac-aco': {
    parameters: [
      { name: 'Limite de Escoamento', unit: 'MPa', min: '250', max: '600' },
      { name: 'Limite de Resistência', unit: 'MPa', min: '400', max: '800' },
      { name: 'Alongamento', unit: '%', min: '18', max: '40' }
    ]
  }
};

// Equipamentos por categoria
const equipmentOptions: Record<string, string[]> = {
  'Concreto': [
    'Prensa Hidráulica 100t',
    'Prensa Hidráulica 200t',
    'Moldes Cilíndricos 10x20cm',
    'Moldes Cilíndricos 15x30cm',
    'Cone de Abrams',
    'Tanque de Cura',
    'Retífica de Corpos de Prova'
  ],
  'Solos': [
    'Prensa CBR',
    'Conjunto de Peneiras',
    'Compactador Proctor',
    'Aparelho Casagrande',
    'Estufa de Secagem',
    'Balança de Precisão'
  ],
  'Agregados': [
    'Conjunto de Peneiras',
    'Máquina Los Angeles',
    'Estufa de Secagem',
    'Balança de Precisão',
    'Picnômetro'
  ],
  'Estruturais': [
    'Máquina Universal de Ensaios 10t',
    'Máquina Universal de Ensaios 50t',
    'Durômetro Rockwell',
    'Extensômetros',
    'Deflectômetros'
  ]
};

const NewEnsaioPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState<EnsaioForm>({
    name: '',
    type: '',
    project: '',
    material: '',
    normReference: '',
    testDate: '',
    description: '',
    technician: '',
    equipment: [],
    samples: [
      {
        id: '1',
        code: '',
        description: '',
        collectionDate: '',
        collectionLocation: ''
      }
    ],
    results: []
  });

  // Manipular mudança de campos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manipular seleção de tipo de ensaio
  const handleTypeSelect = (category: string, typeId: string, typeName: string, norm: string) => {
    setSelectedCategory(category);
    setFormData({
      ...formData,
      type: typeName,
      normReference: norm
    });

    // Carregar parâmetros específicos do tipo de ensaio
    if (ensaioParameters[typeId]) {
      const newResults = ensaioParameters[typeId].parameters.map((param, index) => ({
        id: `result-${index+1}`,
        parameter: param.name,
        value: '',
        unit: param.unit,
        minValue: param.min,
        maxValue: param.max,
        isConform: undefined
      }));

      setFormData(prev => ({
        ...prev,
        results: newResults
      }));
    }
  };

  // Adicionar nova amostra
  const addSample = () => {
    const newSample = {
      id: `sample-${formData.samples.length + 1}`,
      code: '',
      description: '',
      collectionDate: '',
      collectionLocation: ''
    };

    setFormData({
      ...formData,
      samples: [...formData.samples, newSample]
    });
  };

  // Remover amostra
  const removeSample = (id: string) => {
    setFormData({
      ...formData,
      samples: formData.samples.filter(sample => sample.id !== id)
    });
  };

  // Atualizar dados da amostra
  const updateSample = (id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      samples: formData.samples.map(sample => 
        sample.id === id ? { ...sample, [field]: value } : sample
      )
    });
  };

  // Atualizar resultado
  const updateResult = (id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      results: formData.results.map(result => {
        if (result.id === id) {
          const updatedResult = { ...result, [field]: value };
          
          // Verificar conformidade se o campo for valor e houver min/max
          if (field === 'value' && (result.minValue || result.maxValue)) {
            const numValue = parseFloat(value);
            const min = result.minValue ? parseFloat(result.minValue) : undefined;
            const max = result.maxValue ? parseFloat(result.maxValue) : undefined;
            
            if (min !== undefined && max !== undefined) {
              updatedResult.isConform = numValue >= min && numValue <= max;
            } else if (min !== undefined) {
              updatedResult.isConform = numValue >= min;
            } else if (max !== undefined) {
              updatedResult.isConform = numValue <= max;
            }
          }
          
          return updatedResult;
        }
        return result;
      })
    });
  };

  // Manipular seleção de equipamento
  const handleEquipmentChange = (equipment: string) => {
    const updatedEquipment = [...formData.equipment];
    const index = updatedEquipment.indexOf(equipment);
    
    if (index === -1) {
      updatedEquipment.push(equipment);
    } else {
      updatedEquipment.splice(index, 1);
    }
    
    setFormData({
      ...formData,
      equipment: updatedEquipment
    });
  };

  // Avançar para o próximo passo
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Voltar ao passo anterior
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Enviar formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você faria a chamada API para salvar o ensaio
    console.log('Dados de ensaio a serem enviados:', formData);
    
    // Simulando redirecionamento após salvar
    alert('Ensaio criado com sucesso!');
    navigate('/ensaios');
  };

  // Renderizar passo 1: Seleção de tipo de ensaio
  const renderStep1 = () => {
    return (
      <div className="step-container">
        <h2>Passo 1: Selecione o Tipo de Ensaio</h2>
        
        <div className="ensaio-categories">
          {ensaioTypes.map(category => (
            <div key={category.category} className="ensaio-category">
              <h3>{category.category}</h3>
              <div className="ensaio-types">
                {category.types.map(type => (
                  <div 
                    key={type.id}
                    className={`ensaio-type-card ${formData.type === type.name ? 'selected' : ''}`}
                    onClick={() => handleTypeSelect(category.category, type.id, type.name, type.norm)}
                  >
                    <h4>{type.name}</h4>
                    <p className="norm-reference">Norma: {type.norm}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar passo 2: Informações básicas
  const renderStep2 = () => {
    return (
      <div className="step-container">
        <h2>Passo 2: Informações Básicas</h2>
        
        <div className="form-group">
          <label htmlFor="name">Nome do Ensaio</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ex: Ensaio de Compressão - Pilar P1"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Tipo de Ensaio</label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              readOnly
              className="readonly-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="normReference">Norma de Referência</label>
            <input
              type="text"
              id="normReference"
              name="normReference"
              value={formData.normReference}
              onChange={handleInputChange}
              placeholder="Ex: NBR 5739"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="project">Projeto</label>
            <select
              id="project"
              name="project"
              value={formData.project}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione um projeto</option>
              {projectOptions.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="material">Material</label>
            <select
              id="material"
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione um material</option>
              {materialOptions.map(material => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="testDate">Data do Ensaio</label>
            <input
              type="date"
              id="testDate"
              name="testDate"
              value={formData.testDate}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="technician">Técnico Responsável</label>
            <input
              type="text"
              id="technician"
              name="technician"
              value={formData.technician}
              onChange={handleInputChange}
              placeholder="Nome do técnico responsável"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descrição detalhada do ensaio e seu propósito"
            rows={4}
          />
        </div>
        
        <div className="form-group">
          <label>Equipamentos Utilizados</label>
          <div className="equipment-options">
            {selectedCategory && equipmentOptions[selectedCategory] ? 
              equipmentOptions[selectedCategory].map(equipment => (
                <div key={equipment} className="equipment-option">
                  <input
                    type="checkbox"
                    id={`equipment-${equipment}`}
                    checked={formData.equipment.includes(equipment)}
                    onChange={() => handleEquipmentChange(equipment)}
                  />
                  <label htmlFor={`equipment-${equipment}`}>{equipment}</label>
                </div>
              )) : 
              <p>Selecione um tipo de ensaio para ver equipamentos disponíveis.</p>
            }
          </div>
        </div>
      </div>
    );
  };

  // Renderizar passo 3: Amostras
  const renderStep3 = () => {
    return (
      <div className="step-container">
        <h2>Passo 3: Amostras</h2>
        
        <div className="samples-container">
          {formData.samples.map((sample, index) => (
            <div key={sample.id} className="sample-card">
              <div className="sample-header">
                <h3>Amostra {index + 1}</h3>
                {formData.samples.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-sample-btn"
                    onClick={() => removeSample(sample.id)}
                  >
                    Remover
                  </button>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`sample-code-${sample.id}`}>Código/Identificação</label>
                  <input
                    type="text"
                    id={`sample-code-${sample.id}`}
                    value={sample.code}
                    onChange={(e) => updateSample(sample.id, 'code', e.target.value)}
                    placeholder="Ex: CP-001"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`sample-collection-date-${sample.id}`}>Data de Coleta</label>
                  <input
                    type="date"
                    id={`sample-collection-date-${sample.id}`}
                    value={sample.collectionDate}
                    onChange={(e) => updateSample(sample.id, 'collectionDate', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor={`sample-location-${sample.id}`}>Local de Coleta</label>
                <input
                  type="text"
                  id={`sample-location-${sample.id}`}
                  value={sample.collectionLocation}
                  onChange={(e) => updateSample(sample.id, 'collectionLocation', e.target.value)}
                  placeholder="Ex: Bloco B, Pilar P12"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`sample-description-${sample.id}`}>Descrição da Amostra</label>
                <textarea
                  id={`sample-description-${sample.id}`}
                  value={sample.description}
                  onChange={(e) => updateSample(sample.id, 'description', e.target.value)}
                  placeholder="Características, dimensões, condições..."
                  rows={3}
                />
              </div>
            </div>
          ))}
          
          <button 
            type="button" 
            className="add-sample-btn"
            onClick={addSample}
          >
            + Adicionar Amostra
          </button>
        </div>
      </div>
    );
  };

  // Renderizar passo 4: Resultados
  const renderStep4 = () => {
    return (
      <div className="step-container">
        <h2>Passo 4: Resultados e Finalização</h2>
        
        {formData.results.length > 0 ? (
          <div className="results-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Parâmetro</th>
                  <th>Valor</th>
                  <th>Unidade</th>
                  <th>Critério</th>
                  <th>Conformidade</th>
                </tr>
              </thead>
              <tbody>
                {formData.results.map(result => (
                  <tr key={result.id}>
                    <td>{result.parameter}</td>
                    <td>
                      <input
                        type="text"
                        value={result.value}
                        onChange={(e) => updateResult(result.id, 'value', e.target.value)}
                        placeholder="Valor"
                        required
                      />
                    </td>
                    <td>{result.unit}</td>
                    <td>
                      {result.minValue && result.maxValue 
                        ? `${result.minValue} - ${result.maxValue} ${result.unit}`
                        : result.minValue 
                          ? `≥ ${result.minValue} ${result.unit}`
                          : result.maxValue 
                            ? `≤ ${result.maxValue} ${result.unit}`
                            : 'N/A'
                      }
                    </td>
                    <td className="conformity-cell">
                      {result.value && (result.minValue || result.maxValue) ? (
                        <span className={`conformity-badge ${
                          result.isConform 
                            ? 'conform' 
                            : result.isConform === false 
                              ? 'non-conform' 
                              : ''
                        }`}>
                          {result.isConform 
                            ? 'Conforme' 
                            : result.isConform === false 
                              ? 'Não Conforme' 
                              : 'Verificar'}
                        </span>
                      ) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-results-message">
            <p>Não há parâmetros definidos para este tipo de ensaio.</p>
            <p>Adicione resultados manualmente ou selecione outro tipo de ensaio.</p>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="attachment">Adicionar Anexos</label>
          <div className="attachment-upload">
            <input
              type="file"
              id="attachment"
              multiple
              className="file-input"
            />
            <label htmlFor="attachment" className="file-label">
              Escolher Arquivos
            </label>
            <span className="file-info">JPG, PNG, PDF (máx. 10MB cada)</span>
          </div>
        </div>
        
        <div className="summary-section">
          <h3>Resumo do Ensaio</h3>
          <div className="summary-details">
            <div className="summary-item">
              <span className="summary-label">Tipo de Ensaio:</span>
              <span>{formData.type}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Projeto:</span>
              <span>{formData.project}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Material:</span>
              <span>{formData.material}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Norma:</span>
              <span>{formData.normReference}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Técnico:</span>
              <span>{formData.technician}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Quantidade de Amostras:</span>
              <span>{formData.samples.length}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderização do componente principal
  return (
    <div className="new-ensaio-container">
      <div className="new-ensaio-header">
        <h1>Novo Ensaio</h1>
        <button 
          type="button" 
          className="cancel-btn"
          onClick={() => navigate('/ensaios')}
        >
          Cancelar
        </button>
      </div>

      <div className="progress-bar">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Tipo de Ensaio</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Informações Básicas</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Amostras</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">Resultados</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        <div className="form-navigation">
          {currentStep > 1 && (
            <button 
              type="button" 
              className="prev-btn"
              onClick={prevStep}
            >
              Anterior
            </button>
          )}
          
          {currentStep < 4 ? (
            <button 
              type="button" 
              className="next-btn"
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !formData.type) ||
                (currentStep === 2 && (!formData.name || !formData.project || !formData.material || !formData.testDate || !formData.technician))
              }
            >
              Próximo
            </button>
          ) : (
            <button 
              type="submit" 
              className="submit-btn"
              disabled={formData.results.some(result => !result.value)}
            >
              Guardar Ensaio
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default NewEnsaioPage;