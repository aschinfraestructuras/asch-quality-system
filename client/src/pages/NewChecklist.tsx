import React, { useState } from 'react';
import '../styles/NewChecklist.css';

// Modelos de checklists disponíveis
const checklistTemplates = [
  { id: 1, name: 'Recebimento de Materiais - Geral', category: 'Recebimento de Materiais' },
  { id: 2, name: 'Recebimento de Aço', category: 'Recebimento de Materiais' },
  { id: 3, name: 'Recebimento de Concreto', category: 'Recebimento de Materiais' },
  { id: 4, name: 'Inspeção de Fôrmas', category: 'Inspeção de Execução' },
  { id: 5, name: 'Inspeção de Armaduras', category: 'Inspeção de Execução' },
  { id: 6, name: 'Inspeção de Concretagem', category: 'Inspeção de Execução' },
  { id: 7, name: 'Verificação de EPI', category: 'Segurança do Trabalho' },
  { id: 8, name: 'Verificação de Projetos Estruturais', category: 'Verificação de Projetos' },
  { id: 9, name: 'Inspeção de Soldas', category: 'Inspeção de Execução' },
  { id: 10, name: 'Controle de Balastro', category: 'Controle de Materiais' },
];

// Projetos disponíveis
const availableProjects = [
  { id: 1, name: 'Obra Ferroviária Setúbal' },
  { id: 2, name: 'Ponte Vasco da Gama - Manutenção' },
  { id: 3, name: 'Ampliação Terminal Portuário' },
];

// Responsáveis disponíveis
const availableResponsibles = [
  { id: 1, name: 'João Silva', role: 'Engenheiro de Qualidade' },
  { id: 2, name: 'Maria Oliveira', role: 'Supervisora de Obras' },
  { id: 3, name: 'Carlos Santos', role: 'Técnico de Qualidade' },
  { id: 4, name: 'Ana Pereira', role: 'Engenheira de Segurança' },
  { id: 5, name: 'Pedro Costa', role: 'Gerente de Projetos' },
];

// Categorias de checklists
const checklistCategories = [
  'Recebimento de Materiais',
  'Inspeção de Execução',
  'Controle de Materiais',
  'Segurança do Trabalho',
  'Verificação de Projetos',
];

// Exemplo de estrutura de itens para um template de checklist
const templateItems = [
  {
    id: 1,
    description: 'Verificação de documentação',
    items: [
      { id: 101, text: 'Nota fiscal confere com o pedido', required: true },
      { id: 102, text: 'Certificado de qualidade do fabricante', required: true },
      { id: 103, text: 'Laudo técnico anexado', required: false },
    ]
  },
  {
    id: 2,
    description: 'Inspeção visual',
    items: [
      { id: 201, text: 'Material sem danos aparentes', required: true },
      { id: 202, text: 'Embalagem íntegra', required: true },
      { id: 203, text: 'Identificação do material visível', required: true },
    ]
  },
  {
    id: 3,
    description: 'Verificação de especificações',
    items: [
      { id: 301, text: 'Dimensões conforme projeto', required: true },
      { id: 302, text: 'Quantidade conforme pedido', required: true },
      { id: 303, text: 'Tipo/modelo conforme especificado', required: true },
    ]
  },
];

const NewChecklist = () => {
  // Estados
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas as categorias');
  const [checklistName, setChecklistName] = useState('');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [responsible, setResponsible] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState(templateItems);

  // Filtragem de templates
  const filteredTemplates = checklistTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas as categorias' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Função para selecionar um template
  const selectTemplate = (templateId: number) => {
    setSelectedTemplate(templateId);
    // Em um cenário real, aqui você carregaria os itens do template a partir do backend
    const template = checklistTemplates.find(t => t.id === templateId);
    if (template) {
      setChecklistName(`Novo ${template.name}`);
    }
  };

  // Função para adicionar um novo grupo de itens
  const addItemGroup = () => {
    const newGroup = {
      id: items.length + 1,
      description: 'Novo grupo de itens',
      items: [{ id: Date.now(), text: 'Novo item', required: true }]
    };
    setItems([...items, newGroup]);
  };

  // Função para adicionar um novo item a um grupo
  const addItem = (groupId: number) => {
    const updatedItems = items.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          items: [...group.items, { id: Date.now(), text: 'Novo item', required: true }]
        };
      }
      return group;
    });
    setItems(updatedItems);
  };

  // Função para atualizar um item
  const updateItem = (groupId: number, itemId: number, field: string, value: any) => {
    const updatedItems = items.map(group => {
      if (group.id === groupId) {
        const updatedGroupItems = group.items.map(item => {
          if (item.id === itemId) {
            return { ...item, [field]: value };
          }
          return item;
        });
        return { ...group, items: updatedGroupItems };
      }
      return group;
    });
    setItems(updatedItems);
  };

  // Função para atualizar a descrição de um grupo
  const updateGroupDescription = (groupId: number, value: string) => {
    const updatedItems = items.map(group => {
      if (group.id === groupId) {
        return { ...group, description: value };
      }
      return group;
    });
    setItems(updatedItems);
  };

  // Função para remover um item
  const removeItem = (groupId: number, itemId: number) => {
    const updatedItems = items.map(group => {
      if (group.id === groupId) {
        const filteredItems = group.items.filter(item => item.id !== itemId);
        return { ...group, items: filteredItems };
      }
      return group;
    });
    setItems(updatedItems);
  };

  // Função para remover um grupo
  const removeGroup = (groupId: number) => {
    const filteredGroups = items.filter(group => group.id !== groupId);
    setItems(filteredGroups);
  };

  // Função para avançar para o próximo passo
  const nextStep = () => {
    setStep(step + 1);
  };

  // Função para voltar ao passo anterior
  const prevStep = () => {
    setStep(step - 1);
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você faria a submissão para o backend
    alert('Checklist criado com sucesso!');
    // Redirecionar para a listagem de checklists
  };

  return (
    <div className="new-checklist-page">
      <div className="page-header">
        <h1>Novo Checklist</h1>
      </div>

      <div className="stepper">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-text">Selecionar Template</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-text">Informações Básicas</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-text">Personalizar Itens</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${step >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-text">Revisar e Finalizar</div>
        </div>
      </div>

      <div className="checklist-form-container">
        {step === 1 && (
          <div className="template-selection">
            <h2>Selecione um Template</h2>
            
            <div className="template-filters">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Pesquisar templates..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="category-filter"
              >
                <option value="Todas as categorias">Todas as categorias</option>
                {checklistCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="templates-grid">
              {filteredTemplates.map(template => (
                <div 
                  key={template.id} 
                  className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                  onClick={() => selectTemplate(template.id)}
                >
                  <div className="template-icon">
                    {template.category.charAt(0)}
                  </div>
                  <div className="template-info">
                    <h3>{template.name}</h3>
                    <span className="template-category">{template.category}</span>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="selected-indicator">✓</div>
                  )}
                </div>
              ))}
            </div>

            <div className="template-actions">
              <button className="btn-outline-primary">Criar Checklist do Zero</button>
              <button 
                className="btn-primary"
                disabled={!selectedTemplate}
                onClick={nextStep}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="basic-info">
            <h2>Informações Básicas do Checklist</h2>
            
            <form className="basic-info-form">
              <div className="form-group">
                <label htmlFor="checklistName">Nome do Checklist</label>
                <input 
                  type="text" 
                  id="checklistName" 
                  value={checklistName}
                  onChange={(e) => setChecklistName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="project">Projeto</label>
                <select 
                  id="project"
                  value={selectedProject || ''}
                  onChange={(e) => setSelectedProject(Number(e.target.value) || null)}
                  required
                >
                  <option value="">Selecione um projeto</option>
                  {availableProjects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="responsible">Responsável</label>
                <select 
                  id="responsible"
                  value={responsible || ''}
                  onChange={(e) => setResponsible(Number(e.target.value) || null)}
                  required
                >
                  <option value="">Selecione um responsável</option>
                  {availableResponsibles.map(person => (
                    <option key={person.id} value={person.id}>{person.name} ({person.role})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Data Limite</label>
                <input 
                  type="date" 
                  id="dueDate" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descrição (opcional)</label>
                <textarea 
                  id="description" 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </form>

            <div className="form-actions">
              <button className="btn-outline-primary" onClick={prevStep}>Voltar</button>
              <button 
                className="btn-primary"
                onClick={nextStep}
                disabled={!checklistName || !selectedProject || !responsible}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="customize-items">
            <h2>Personalizar Itens de Verificação</h2>
            
            <div className="checklist-items">
              {items.map((group, groupIndex) => (
                <div key={group.id} className="item-group">
                  <div className="group-header">
                    <input 
                      type="text" 
                      value={group.description}
                      onChange={(e) => updateGroupDescription(group.id, e.target.value)}
                      className="group-title"
                    />
                    <button 
                      className="btn-icon remove-group" 
                      onClick={() => removeGroup(group.id)}
                      title="Remover grupo"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="group-items">
                    {group.items.map((item, itemIndex) => (
                      <div key={item.id} className="checklist-item">
                        <div className="item-content">
                          <div className="item-number">{groupIndex + 1}.{itemIndex + 1}</div>
                          <input 
                            type="text" 
                            value={item.text}
                            onChange={(e) => updateItem(group.id, item.id, 'text', e.target.value)}
                            className="item-text"
                          />
                        </div>
                        <div className="item-controls">
                          <label className="required-toggle">
                            <input 
                              type="checkbox" 
                              checked={item.required}
                              onChange={(e) => updateItem(group.id, item.id, 'required', e.target.checked)}
                            />
                            Obrigatório
                          </label>
                          <button 
                            className="btn-icon remove-item" 
                            onClick={() => removeItem(group.id, item.id)}
                            title="Remover item"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    className="btn-outline-primary add-item" 
                    onClick={() => addItem(group.id)}
                  >
                    + Adicionar Item
                  </button>
                </div>
              ))}
            </div>

            <button 
              className="btn-primary add-group"
              onClick={addItemGroup}
            >
              + Adicionar Grupo de Itens
            </button>

            <div className="form-actions">
              <button className="btn-outline-primary" onClick={prevStep}>Voltar</button>
              <button 
                className="btn-primary"
                onClick={nextStep}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="review-finalize">
            <h2>Revisar e Finalizar</h2>
            
            <div className="review-section">
              <h3>Informações Gerais</h3>
              <div className="review-info">
                <div className="review-item">
                  <span className="review-label">Nome do Checklist:</span>
                  <span className="review-value">{checklistName}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Projeto:</span>
                  <span className="review-value">{
                    availableProjects.find(p => p.id === selectedProject)?.name || 'Não selecionado'
                  }</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Responsável:</span>
                  <span className="review-value">{
                    availableResponsibles.find(r => r.id === responsible)?.name || 'Não selecionado'
                  }</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Data Limite:</span>
                  <span className="review-value">{dueDate || 'Não definida'}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Descrição:</span>
                  <span className="review-value">{description || 'Não fornecida'}</span>
                </div>
              </div>
            </div>

            <div className="review-section">
              <h3>Itens de Verificação</h3>
              <div className="review-items">
                {items.map((group, groupIndex) => (
                  <div key={group.id} className="review-group">
                    <h4>{groupIndex + 1}. {group.description}</h4>
                    <ul className="review-group-items">
                      {group.items.map((item, itemIndex) => (
                        <li key={item.id} className="review-group-item">
                          {groupIndex + 1}.{itemIndex + 1} {item.text}
                          {item.required && <span className="required-tag">Obrigatório</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-outline-primary" onClick={prevStep}>Voltar</button>
              <button 
                className="btn-primary"
                onClick={handleSubmit}
              >
                Criar Checklist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewChecklist;